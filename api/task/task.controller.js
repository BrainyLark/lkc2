const Task 			= require('./task.model')
const TaskEvent		= require('../taskEvent/taskEvent.model')
const TaskEventCount	= require('../taskEventCount/taskEventCount.model')
const Translation		= require('../translation/translation.model')
const request		= require('request')
const handleError		= require('../../service/ErrorHandler')
const meta			= require('../../meta')

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
		if (err) return handleError(res, err)
		res.json({ statusCode: meta.status.null, statusMsg: meta.msg.mn.truncated.ok })
	})
}

module.exports.next = function (req, res, next) {
	var userId = req.user._id
	var domainId = req.params.domainId
	var typeId = req.params.typeId
	var taskLimit = (typeId == meta.tasktype.modification) ? meta.tasklimit.modification : meta.tasklimit.translation
	TaskEvent.lastEvent([userId, domainId, typeId], (err, lastEvent) => {
		if (err) return handleError(res, err)
		var createdAt = new Date(2014, 0, 1)
		var findNextTask = () => {
			TaskEventCount.find({ domainId: domainId, taskType: typeId })
				.where('count').lt(taskLimit)
				.where('createdAt').gt(createdAt)
				.sort('taskId')
				.limit(1)
				.exec( (err, pEvent) => {
					if (err) return handleError(res, err)
					if (!pEvent.length) {
						return res.json({ statusCode: meta.status.null, statusMsg: meta.msg.mn.task.unavailable })
					}
					else {
						var taskId = pEvent[0].taskId
						var cnt = 0
						var cb = (err, docs) => {
							if (err) return handleError(res, err)
							cnt++
							if (cnt == 2)
								Task.findById(taskId, (err, task) => {
									if (err) return handleError(res, err)
									return res.json({ 
										statusCode: meta.status.ok,
										task: task
									})
								})
						}
						TaskEvent.findOne({ taskId: taskId, userId: userId }, (err, tevent) => {
							if (err) return handleError(res, err)
							if (!tevent) {
								TaskEvent.create({
									taskId: taskId,
									taskType: typeId,
									domainId: domainId,
									userId: userId
								}, cb)
								TaskEventCount.update({ taskId: taskId }, { $inc: { count: 1 } }, cb)
							} else {
								TaskEvent.update({ taskId: taskId, userId: userId }, { $set: { updatedAt: new Date() }}, cb)
								cb(null, null)
							}
						})
					}
				})
		}
		if (lastEvent) {
			if (lastEvent.state == meta.taskstate.ongoing) {
				var cb = (err, docs) => {
					if (err) return handleError(res, err)
					Task.findById(lastEvent.taskId, (err, task) => {
						if (err) handleError(res, err)
						return res.json({ 
							statusCode: meta.status.ok, 
							task: task
						})
					})
				}
				TaskEvent.update({ taskId: lastEvent.taskId, userId: userId }, { $set: { updatedAt: new Date() }}, cb)
			} else {
				TaskEventCount.findOne({ taskId: lastEvent.taskId }, (err, tEvCon) => {
					if (err) return handleError(res, err)
					createdAt = tEvCon.createdAt
					findNextTask()
				})
			}
		}
		else findNextTask()
	})
}
