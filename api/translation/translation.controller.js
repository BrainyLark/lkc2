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
	var generateModTask = (translationTaskId, callback) => {
		Translation.find({ taskId: translationTaskId }, 'translation', (err, run) => {
			if (err) return handleError(res, err)
			var tset = new Set()
			for (let user = 0; user < meta.tasklimit.translation; user++) {
				for (let ind = 0; ind < run[user].translation.length; ind++)
					tset.add(run[user].translation[ind].lemma)
			}
			var tlist = Array.from(tset)
			var words = []
			for (let w = 0; w < tlist.length; w++) {
				words.push({word: tlist[w]})
			}
			Task.findById(translationTaskId, 'conceptId synset lemma gloss domainId', (err, origin) => {
				if (err) return handleError(res, err)
				Task.create({
					conceptId: origin.conceptId,
					gloss: origin.gloss,
					synset: origin.synset,
					lemma: origin.lemma,
					domainId: origin.domainId,
					taskType: meta.tasktype.modification,
					_translationTaskId: translationTaskId,
					translatedWords: words
				}, callback)
			})
		})
	}
	var user = req.user
	Translation.create({
		taskId: req.body.taskId,
		domainId: req.body.domainId,
		translator: user.username,
		translatorId: user._id,
		translation: req.body.translation,
		skip: req.body.skip || false,
		gap: req.body.gap || false,
		gapReason: req.body.gapReason || null,
		startDate: req.body.start_date,
		endDate: req.body.end_date
	}, (err, translation) => {
		if (err) return handleError(res, err)
		var con = 0
		var cb = (err, data) => {
			con++
			if (err) return handleError(res, err)
			if (con == 2) {
				TaskEvent.count({ taskId: req.body.taskId, state: meta.taskstate.terminated }, (err, r_count) => {
					if (r_count >= meta.tasklimit.translation) {
						generateModTask(req.body.taskId, (err, task) => {
							if (err) return handleError(res, err)
							TaskEventCount.create({
								taskId: task._id,
								taskType: meta.tasktype.modification,
								domainId: task.domainId,
								count: 0
							}, (err, r_count) => {
								if (err) return handleError(res, err)
							 	console.log("Modification task successfully generated:\n")
								console.log("Created task: ", task)
								console.log("Task log: ", r_count)
							})
						})
					}
					return res.json({ statusSuccess: meta.status.ok, statusMsg: meta.msg.mn.transaved.ok})
				})
			}
		}
		TaskEvent.update({ taskId: translation.taskId, userId: translation.translatorId }, { $set: { state: meta.taskstate.terminated } }, cb)
		if (translation.skip) TaskEventCount.update({ taskId: translation.taskId }, { $inc: { count: -1 } }, cb)
		else cb(null, null)
	})
}
