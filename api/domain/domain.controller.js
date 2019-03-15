const DataStore	= require('../../service/DataAdapterPostgres')[0]
const handleError	= require('../../service/ErrorHandler')
const Domain 	= require('./domain.model.js')
const TaskEventCount	= require('../taskEventCount/taskEventCount.model')
const meta		= require('../../meta')

//global ids for the twenty-five unique beginner concepts
const uids = meta.ub_ids

const selection = {
	"example": false
}

module.exports.index = function (req, res, next) {

	var typeId = req.query.taskType

	if (!typeId || typeId > 6 || typeId < 0) {
		return res.json({ successStatus: false, msg: "Invalid task type or nothing included" })
	}

	var requestedType = meta.taskTypeTable[typeId]
	var limit = (typeId == 2 || typeId == 5) ? 3 : 5

	// console.log("requestedType:",requestedType)

	Domain.find({}, function(err, domains) {
		if (err) return handleError(res, err)
		var globalCnt = 0
		domains.forEach(domain => {
			// console.log(domain)
			TaskEventCount.count({ domainId: domain.globalId, taskType: requestedType, count: { $lt: limit } }, (err, cnt) => {
				domain.available = cnt
				globalCnt++
				if (globalCnt == 25) return res.json(domains)
			})

		})
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
