const Task = require('./task.model')
const handleError = require('../../service/ErrorHandler')

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
		res.json({ statusCode: 0, statusMsg: 'Collection truncated' })
	})
}
