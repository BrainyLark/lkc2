const Validation 		= require('./validation.model')
const TaskEvent 		= require('../taskEvent/taskEvent.model')
const TaskEventCount 	= require('../taskEventCount/taskEventCount.model')
const handleError 		= require('../../service/ErrorHandler')
const request 			= require('request')
const meta				= require('../../meta')
const Estimator			= require('../../service/Estimator')

module.exports.saveUserValidationData = (req, res, next) => {
	var user = req.user

	var analyseSynset = (taskId, callback) => {
		Validation.find({ taskId: taskId }, 'validations', (err, run) => {
			if (err) return handleError(res, err)
			
			var raterCnt = run.length
			var unitCnt = run[0].validations.length
			var reliabilityMatrix = new Array(raterCnt)
			
			for (let r = 0; r < raterCnt; r++) {
				reliabilityMatrix[r] = new Array(unitCnt)
				for (let u = 0; u < unitCnt; u++) {
					reliabilityMatrix[r][u] = run[r].validations[u].rating
				}
			}

			console.log("Reliability Matrix: ", reliabilityMatrix)

			let alpha = Estimator.calculateAlpha(reliabilityMatrix, raterCnt, unitCnt)
			if (alpha >= meta.agreement.alpha) {
				callback("create gloss translation task")
			} else {
				callback("erase validation, modification run, validation task, update modification task")
			}
		})
	}

	Validation.create({
		taskId: req.body.taskId,
		domainId: req.body.domainId,
		validatorId: user._id,
		validator: user.username,
		validations: req.body.validations,
		gap: req.body.gap || false,
		gapReason: req.body.gapReason || null,
		skip: req.body.skip || false,
		startDate: req.body.start_date,
		endDate: req.body.end_date
	}, (err, validation) => {
		if (err) return handleError(res, err)
		var con = 0
		var cb = (err, data) => {
			if (err) return handleError(res, err)
			con++
			if (con == 2) {
				TaskEvent.count({ taskId: validation.taskId, state: meta.taskstate.terminated }, (err, e_count) => {
					if (err) return handleError(res, err)
					if (e_count >= meta.tasklimit.validation) {
						//determine what route the synset would meet
						analyseSynset(validation.taskId, (state) => {
							console.log(state)
							console.log("Determination end!")
						})
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
