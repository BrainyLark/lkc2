const Task 				= require('./task.model')
const TaskEvent			= require('../taskEvent/taskEvent.model')
const TaskEventCount	= require('../taskEventCount/taskEventCount.model')
const Translation		= require('../translation/translation.model')
const request			= require('request')
const handleError		= require('../../service/ErrorHandler')
const meta				= require('../../meta')

module.exports.index = function (req, res, next) {
	Task.findBySettings(req.query, function (err, data) {
		if (err) return handleError(res, err)
		res.json(data)
	})
}

module.exports.show = function (req, res, next) {
	Task.findById(req.params.id, function (err, data) {
		if (err) return handleError(res, err)
		res.json(data)
	})
}

module.exports.truncate = function (req, res, next) {
	Task.remove({}, function(err) {
		if (err) return handleError(err)
		res.json({ statusCode: meta.status.null, statusMsg: 'Collection truncated' })
	})
}

module.exports.next = function (req, res, next) {
	var userId = req.user._id
	var domainId = req.params.domainId
	var typeId = req.params.typeId
	var taskLimit = (typeId == meta.tasktype.modification) ? meta.tasklimit.modification : meta.tasklimit.translation
	TaskEvent.findLastEventForUser([userId, domainId, typeId], function(err, lastEvent) {
		if (err) return handleError(res, err)
		var createdAt = new Date(2014, 0, 1)
		var findNextTask = function() {
			TaskEventCount.find({ domainId: domainId, taskType: typeId })
				.where('count').lt(taskLimit)
				.where('createdAt').gt(createdAt)
				.sort('taskId')
				.limit(1)
				.exec(function(err, pEvent) {
					if (err) return handleError(res, err)
					if (pEvent.length == 0) {
						return res.json({ statusCode: meta.status.null, statusMsg: "No task is available in this domain." })
					}
					else {
						Task.findById(pEvent[0].taskId, (err, task) => {
							if (err) return handleError(res, err)
							task.statusCode = meta.status.ok
							return res.json(task)
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
