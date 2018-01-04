const Task 				= require('../task/task.model')
const TaskEvent			= require('../taskEvent/taskEvent.model')
const TaskEventCount	= require('../taskEventCount/taskEventCount.model')
const Translation		= require('./translation.model')
const request			= require('request')
const handleError		= require('../../service/ErrorHandler')

// defining constant variables
const TRANSLATION_TASK_TYPE 	= 1
const MODIFICATION_TASKTYPE		= 2
const MAX_TRANSLATION			= 5
const STATUS_OK 				= 1
const STATUS_NULL 				= 0

module.exports.showTranslations = function(req, res, next) {
	Translation.findBySettings(req.query, function (err, data) {
		if (err) return handleError(res, err)
		res.json(data)
	})
}

module.exports.saveUserTranslationData = function (req, res, next) {
	var generateModTask = function (translationTaskId, callback) {
		Task.findOne({ _id: translationTaskId }, function (err, task) {
			if (err) handleError(err)
			Task.create({
				conceptId: task.conceptId,
				gloss: task.gloss,
				lemma: task.lemma,
				domainId: task.domainId,
				taskType: task.taskType,
				_translationTaskId: translationTaskId,
				
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
		startDate: req.body.start_date,
		endDate: req.body.end_date
	}, function(err, translation) {
		if (err) return handleError(res, err)
		var con = 0
		var done = function(err, data) {
			con++
			if (err) return handleError(res, err)
			if (con == 2) {
				TaskEventCount.findOne({ taskId: translation.taskId }, (err, tEvCon) => {
					if (tEvCon.count >= MAX_TRANSLATION) {

					}
					return res.json({ statusSuccess: STATUS_OK, statusMsg: "Орчуулгыг амжилттай хадгаллаа!"})
				})
			}
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
