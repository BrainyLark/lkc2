const Validation 		= require('./validation.model')
const Task 				= require('../task/task.model')
const TaskEvent 		= require('../taskEvent/taskEvent.model')
const TaskEventCount 	= require('../taskEventCount/taskEventCount.model')
const handleError 		= require('../../service/ErrorHandler')
const request 			= require('request')
const meta				= require('../../meta')
const Estimator			= require('../../service/Estimator')

module.exports.saveUserValidationData = (req, res, next) => {
	var user = req.user
	var validationType = !req.body.validationType ? 'SynsetValidation' : req.body.validationType

	var regenerateMod = (taskId, callback) => {
		Task.findById(taskId, '_modificationTaskId', (err, vtask) => {
			let mqryString = 'conceptId synset domainId translatedWords _translationTaskId'
			Task.findById(vtask._modificationTaskId, mqryString, (err, mtask) => {
				Task.create({
					conceptId: mtask.conceptId,
					domainId: mtask.domainId,
					synset: mtask.synset,
					taskType: 'SynsetModificationTask',
					translatedWords: mtask.translatedWords,
					_translationTaskId: mtask._translationTaskId,
				}, callback)
			})
		})
	}

	var analyseSynset = (taskId, callback) => {
		Validation.find({ taskId: taskId, skip: false }, 'validations', (err, run) => {
			if (err) return handleError(res, err)
			
			var raterCnt = run.length
			var unitCnt = run[0].validations.length
			var reliabilityMatrix = new Array(unitCnt)
			
			for (let u = 0; u < unitCnt; u++) {
				reliabilityMatrix[u] = new Array(raterCnt)
				for (let r = 0; r < raterCnt; r++) {
					reliabilityMatrix[u][r] = run[r].validations[u].rating
				}
			}

			let alpha = Estimator.calculateAlpha(reliabilityMatrix, raterCnt, unitCnt)

			alpha = parseFloat(Number(alpha).toFixed(3))

			if (alpha >= meta.agreement.alpha) {

				var cb_generate = (targetWords) => {
					Task.findById(taskId, 'conceptId synset domainId', (err, origin) => {
						if (err) return  handleError(res, err)
						Task.create({
							conceptId: origin.conceptId,
							domainId: origin.domainId,
							synset: origin.synset,
							taskType: 'GlossTranslationTask',
							_validationTaskId: taskId,
							targetWords: targetWords,
							synsetAlpha: alpha
						}, callback)
					})
				}

				var selection = reliabilityMatrix.map(v => v.filter(x => x == 0).length).map(e => e > 2 ? true : false)
				if (selection.filter(e => e == true).length) {
					var targetWords = []
					for (let i = 0; i < unitCnt; i++) {
						if (selection[i]) {
							targetWords.push(run[0].validations[i].word)
						}
					}
					cb_generate(targetWords.join(', '))
				} else {
					regenerateMod(taskId, callback)
				}

			} else {
				regenerateMod(taskId, callback)
			}
		})
	}

	var data = {
		validationType: validationType,
		taskId: req.body.taskId,
		domainId: req.body.domainId,
		validatorId: user._id,
		validator: user.username,
		validations: req.body.validations,
		skip: req.body.skip || false,
		startDate: req.body.start_date,
		endDate: req.body.end_date
	}

	if (validationType == 'SynsetValidation') {
		data.gap = req.body.gap || false
		data.gapReason = req.body.gapReason || null
	}

	Validation.create(data, (err, validation) => {
		if (err) return handleError(res, err)
		var con = 0
		var cb = (err, data) => {
			if (err) return handleError(res, err)
			con++
			if (con == 2) {
				TaskEvent.count({ taskId: validation.taskId, state: meta.taskstate.terminated }, (err, e_count) => {
					if (err) return handleError(res, err)
					if (e_count >= meta.tasklimit.validation) {
						if (validationType == 'SynsetValidation') {
							//determine what route the synset would meet
							analyseSynset(validation.taskId, (err, task) => {
								if (err) return handleError(res, err)
								console.log("Analysis finished, creating log!")
								TaskEventCount.create({
									taskId: task._id,
									taskType: task.taskType,
									domainId: task.domainId,
									count: 0
								}, (err, r_count) => {
									if (err) return handleError(res, err)
									console.log("Task-", r_count.taskType, " successfully created!")
								})
							})
						} else if (validationType == 'GlossValidation') {
							console.log("Gloss taskrun completed!")
							console.log("No gloss post-processing instruction given!")
						}
					}
				})
				return res.json({ statusSuccess: meta.status.ok, statusMsg: meta.msg.mn.validsaved.ok }) 
			}
		}

		if (validation.skip) {
			TaskEventCount.update({ taskId: validation.taskId }, { $inc: { count: -1 } }, cb)
			TaskEvent.update({ taskId: validation.taskId, userId: validation.validatorId }, { $set: { state: meta.taskstate.skipped } }, cb)
		}
		else {
			TaskEvent.update({ taskId: validation.taskId, userId: validation.validatorId }, { $set: { state: meta.taskstate.terminated } }, cb)
			cb(null, null)
		}

	})
}
