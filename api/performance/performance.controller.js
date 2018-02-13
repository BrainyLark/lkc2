const TaskEvent = require('../taskEvent/taskEvent.model')
const meta		= require('../../meta')
const handleError = require('../../service/ErrorHandler')

module.exports.getPerformance = (req, res, next) => {
	var userId = req.user._id

	var cntData = { translation: -1, modification: -1, validation: -1 }

	var getCount = (taskType, cb) => {
		TaskEvent.count({ 
			taskType: taskType, userId: userId, state: meta.taskstate.terminated 
		}, (err, count) => {
			if (err) return handleError(res, err)
			cb(count)
		})
	}

	getCount(meta.tasktype.translation, (tcnt) => {
		getCount(meta.tasktype.modification, (mcnt) => {
			getCount(meta.tasktype.validation, (vcnt) => {
				cntData.translation = tcnt
				cntData.modification = mcnt
				cntData.validation = vcnt
				return res.json(cntData)
			})
		})
	})

}