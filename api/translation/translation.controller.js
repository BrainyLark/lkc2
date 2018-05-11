const Task 			= require('../task/task.model')
const TaskEvent		= require('../taskEvent/taskEvent.model')
const TaskEventCount	= require('../taskEventCount/taskEventCount.model')
const Translation	= require('./translation.model')
const request		= require('request')
const handleError	= require('../../service/ErrorHandler')
const meta			= require('../../meta')

module.exports.getPrevious = function(req, res, next) {
	var domainId = req.query.domain
	var boundaryTask = req.query.task
	Translation.findOne({ translatorId: req.user._id, domainId: domainId, skip: false, taskId: { $lt: boundaryTask } }, {}, {sort: { endDate: -1 }}, (err, run) => {
		if (err) return handleError(res, err)
		if (!run) {
			return res.json({ success: false, data: null })
		}
		console.log("TID: ", run.taskId)
		var responseData = {}
		responseData.taskId = run.taskId
		responseData.translation = run.translation
		var cb = (err, task) => {
			if (err) return handleError(res, err)
			responseData.synset = task.synset
			return res.json({ success: true, data: responseData })
		}
		Task.findOne({ _id: run.taskId }, cb)
	})
}

module.exports.getNext = function(req, res, next) {
	var domainId = req.query.domain
	var boundaryTask = req.query.task
	Translation.findOne({ translatorId: req.user._id, domainId: domainId, skip: false, taskId: { $gt: boundaryTask } }, {}, {sort: { endDate: 1 }}, (err, run) => {
		if (err) return handleError(res, err)
		if (!run) {
			return res.json({ success: false, data: null })
		}
		var responseData = {}
		responseData.taskId = run.taskId
		responseData.translation = run.translation
		var cb = (err, task) => {
			if (err) return handleError(res, err)
			responseData.synset = task.synset
		return res.json({ success: true, data: responseData })
		}
		Task.findOne({ _id: run.taskId }, cb)
	})
}

module.exports.saveUserTranslationData = (req, res, next) => {
	var generateModTask = (translationTaskId, trType, callback) => {
		Translation.find({ taskId: translationTaskId, skip: false }, 'translation', (err, run) => {
			if (err) return handleError(res, err)
			var words, glosses
			var qryString = 'conceptId synset domainId taskType'
			if (trType == 'SynsetTranslation') {
				var tset = new Set()
				for (let user = 0; user < meta.tasklimit.translation; user++) {
					for (let ind = 0; ind < run[user].translation.length; ind++)
						tset.add(run[user].translation[ind].lemma)
				}
				var tlist = Array.from(tset)
				words = []
				for (let w = 0; w < tlist.length; w++) {
					words.push({word: tlist[w]})
				}
			} else if (trType == 'GlossTranslation') {
				qryString += ' targetWords'
				glosses = []
				for (let user = 0; user < meta.tasklimit.translation; user++) {
					glosses.push({ gloss: run[user].translation })
				}
			}
			Task.findById(translationTaskId, qryString, (err, origin) => {
				if (err) return handleError(res, err)
				let taskType = origin.taskType == 'SynsetTranslationTask' ? 'SynsetModificationTask' : 'GlossModificationTask'
				var mdTaskData = {
					conceptId: origin.conceptId,
					synset: origin.synset,
					domainId: origin.domainId,
					taskType: taskType,
					_translationTaskId: translationTaskId
				}
				if (trType == 'SynsetTranslation') {
					mdTaskData.translatedWords = words
				} else if (trType == 'GlossTranslation') {
					mdTaskData.targetWords = origin.targetWords
					mdTaskData.translatedGlosses = glosses
				}
				Task.create(mdTaskData, callback)
			})
		})		
	}
	
	var user = req.user
	var req_taskId = req.body.taskId
	var translationType = !req.body.translationType ? 'SynsetTranslation' : req.body.translationType
	var data = {
		taskId: req_taskId,
		domainId: req.body.domainId,
		translator: user.username,
		translatorId: user._id,
		translationType: translationType,
		translation: req.body.translation,
		startDate: req.body.start_date,
		endDate: req.body.end_date,
		skip: req.body.skip || false
	}
	if (translationType == 'SynsetTranslation') {
		data.gap = req.body.gap || false
		data.gapReason = req.body.gapReason || null
	}
	Translation.create(data, (err, translation) => {
		if (err) return handleError(res, err)
		var con = 0
		var cb = (err, data) => {
			con++
			if (err) return handleError(res, err)
			if (con == 2) {
				TaskEvent.count({ taskId: translation.taskId, state: meta.taskstate.terminated }, (err, r_count) => {
					if (err) return handleError(res, err)
					if (r_count >= meta.tasklimit.translation) {
						generateModTask(req_taskId, translationType, (err, task) => {
							if (err) return handleError(res, err)
							TaskEventCount.create({
								taskId: task._id,
								taskType: task.taskType,
								domainId: task.domainId,
								count: 0
							}, (err, t_count) => {
								if (err) return handleError(res, err)
								console.log("ModificationTask successfully created! Molto Bene!")
							})
						})
					}
					return res.json({ statusSuccess: meta.status.ok, statusMsg: meta.msg.mn.transaved.ok})
				})
			}
		}
		if (translation.skip) {
			TaskEventCount.update({ taskId: translation.taskId }, { $inc: { count: -1 } }, cb)
			TaskEvent.update({ taskId: translation.taskId, userId: translation.translatorId }, { $set: { state: meta.taskstate.skipped } }, cb)
		}
		else {
			TaskEvent.update({ taskId: translation.taskId, userId: translation.translatorId }, { $set: { state: meta.taskstate.terminated } }, cb)
			cb(null, null)
		}
	})
}
