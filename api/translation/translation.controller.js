const Task 			= require('../task/task.model'),
	TaskEvent		= require('../taskEvent/taskEvent.model'),
	TaskEventCount	= require('../taskEventCount/taskEventCount.model'),
	Translation		= require('./translation.model'),
	request		= require('request'),
	handleError		= require('../../service/ErrorHandler')

// defining constant variables
const TRANSLATION_TASK_TYPE = 1
const MAX_TRANSLATION = 5
const STATUS_OK = 1
const STATUS_NULL = 0

module.exports.showTranslations = function(req, res, next) {
	Translation.findBySettings(req.query, function (err, data) {
		if (err) return handleError(res, err)
		res.json(data)
	})
}

module.exports.getUserNextTask = function (req, res, next) {
	var userId = req.user._id
	var domainId = req.params.domainId
	TaskEvent.findLastEventForUser([userId, domainId, TRANSLATION_TASK_TYPE], function(err, lastEvent) {
		if (err) return handleError(res, err)
		var createdAt = new Date(2014, 0, 1)
		var findNextTask = function() {
			TaskEventCount.find({ domainId: domainId })
				.where('count').lt(MAX_TRANSLATION)
				.where('createdAt').gt(createdAt)
				.sort('taskId')
				.limit(1)
				.exec(function(err, pEvent) {
					if (err) return handleError(res, err)
					if (pEvent.length == 0) {
						request('http://localhost:3000/generate?uk_id=' + domainId, (err, response, body) => {
							if(!err && response.statusCode == 200) {
								if (JSON.parse(body).created == 0)
									return res.json({ statusCode: 0, statusMsg: 'no more tasks on this domain' })
								else return findNextTask();
							}
						})
					}
					else {
						Task.findById(pEvent[0].taskId, (err, task) => {
							if (err) return handleError(res, err)
							task.statusCode = 1
							res.json(task)
						})
					}
				})
		}
		if (lastEvent) {
			TaskEventCount.findOne({ taskId: lastEvent.taskId }, (err, tEvCon) => {
				if (err) return handleError(res, err)
				createdAt = tEvCon.createdAt
				findNextTask()
			})
		}
		else findNextTask()
	})
}

module.exports.saveUserTranslationData = function (req, res, next) {
	var user = req.user
	Translation.create({
		taskId: req.body.taskId,
		domainId: req.body.domainId,
		translator: user.username,
		translatorId: user._id,
		translation: req.body.translation,
		skip: req.body.skip || false,
		gap: req.body.gap || false,
		startDate: req.body.start_date,
		endDate: req.body.end_date
	}, function(err, translation) {
		if (err) return handleError(res, err)
		var con = 0
		var done = function(err, data) {
			con++
			if (err) return handleError(res, err)
			if (con == 2) return res.json({ success: true, msg: "Орчуулгыг амжилттай хадгаллаа!"})
		}
		TaskEvent.create({
			userId: translation.translatorId,
			domainId: translation.domainId,
			taskType: TRANSLATION_TASK_TYPE,
			taskId: translation.taskId
		}, done)
		TaskEventCount.update({ taskId: translation.taskId }, { $inc: { count: 1 } }, done)
	})
}