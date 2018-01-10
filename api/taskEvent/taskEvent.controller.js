const TaskEvent 		= require('./taskEvent.model')
const TaskEventCount	= require('../taskEventCount/taskEventCount.model')
const handleError		= require('../../service/ErrorHandler')
const meta			= require('../../meta')

module.exports.index = function (req, res, next) {
	TaskEvent.find({}, function (err, data) {
		if (err) return handleError(res, err)
		res.json(data)
	})
}

module.exports.truncate = function (req, res, next) {
	TaskEvent.remove({}, function (err) {
		if (err) return handleError(res, err)
		TaskEventCount.find({}, (err, taskEventCounters) => {
			if (err) return handleError(res, err)
			for (let i = 0; i < taskEventCounters.length; i++) {
				taskEventCounters[i].count = 0;
				taskEventCounters[i].save()
			}
			res.json({ statusCode: meta.status.null, statusMsg: 'Collection truncated.' })
		})
	})
}
