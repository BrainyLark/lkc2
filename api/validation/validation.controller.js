const Validation 		= require('./validation.model')
const TaskEvent 		= require('../taskEvent/taskEvent.model')
const TaskEventCount 	= require('../taskEventCount/taskEventCount.model')
const handleError 		= require('../../service/ErrorHandler')
const request 			= require('request')

const STATUS_NULL = 0
const STATUS_OK = 1
const VALIDATION_TASKTYPE = 3

module.exports.saveUserValidationData = function(req, res, next) {
	var user = req.user
	Validation.create({
		taskId: req.body.taskId,
		domainId: req.body.domainId,
		validatorId: user._id,
		validator: user.username,
		validations: req.body.validations,
		gap: req.body.gap || false,
		skip: req.body.skip || false,
		startDate: req.body.start_date,
		endDate: req.body.end_date
	}, (err, validation) => {
		if (err) handleError(err)
		var con = 0
		var done = function(err, data) {
			if (err) handleError(err)
			con++
			if (con == 2) return res.json({ statusSuccess: STATUS_OK, statusMsg: "Үнэлгээ амжилттай хадгалагдлаа!" })
		}
		
		TaskEvent.create({
			taskId: validation.taskId,
			taskType: VALIDATION_TASKTYPE,
			domainId: validation.domainId,
			userId: user._id
		}, done)

		if (!validation.skip) TaskEventCount.update({ taskId: validation.taskId }, { $inc: { count: 1 } }, done)
		else done(null, null)

	})
}