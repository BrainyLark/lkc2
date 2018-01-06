const DataStore	= require('../../service/DataAdapter')[0]
const handleError	= require('../../service/ErrorHandler')
const Domain = require('./domain.model.js');

//global ids for the twenty-five unique beginner concepts
const uids = [
	161, 119, 124, 129, 15355, 127, 145, 138,
	131, 123, 40, 132, 83505, 121, 61558, 118, 120,
	143, 139, 28162, 142, 133, 130, 122, 134
]

const selection = {
	"synset": false,
	"example": false
}

const STATUS_OK = 1
const STATUS_NULL = 0

module.exports.index = function (req, res, next) {
	Domain.find({}, selection, function(err, domains) {
		if (err) throw err
		return res.json({domains: domains})
	})
}

module.exports.generate = function (req, res, next) {
	DataStore.getUniqueBeginners(uids, function (err, data) {
		if (err) return handleError(res, err)
		Domain.insert(data, function(err, dconcepts) {
			if (err) throw err
			return res.json({statusCode: STATUS_OK, statusMsg: "Successfully generated", dconcepts: dconcepts.ops})
		})
	})
}
