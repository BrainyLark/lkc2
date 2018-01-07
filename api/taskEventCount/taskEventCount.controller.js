const TaskEventCount 	= require('./taskEventCount.model')
const handleError		= require('../../service/ErrorHandler')

module.exports.index = function (req, res, next) {
	TaskEventCount.find({}, function (err, data) {
		if (err) return handleError(res, err)
		res.json(data)
	})
}