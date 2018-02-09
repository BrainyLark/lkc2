const DataStore	= require('../../service/DataAdapter')[0]
const handleError	= require('../../service/ErrorHandler')
const Domain 	= require('./domain.model.js')
const meta		= require('../../meta')

//global ids for the twenty-five unique beginner concepts
const uids = meta.ub_ids

const selection = {
	"example": false
}

module.exports.index = function (req, res, next) {
	Domain.find({}, selection, function(err, domains) {
		if (err) return handleError(res, err)
		return res.json(domains)
	})
}

module.exports.generate = function (req, res, next) {
	DataStore.getUniqueBeginners(uids, function (err, data) {
		if (err) return handleError(res, err)
		Domain.insert(data, function(err, dconcepts) {
			if (err) throw err
			return res.json({statusCode: meta.status.ok, statusMsg: meta.msg.mn.generated.ok, dconcepts: dconcepts.ops})
		})
	})
}
