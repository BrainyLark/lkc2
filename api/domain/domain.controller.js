const DataStore	= require('../../service/DataAdapter')[0]
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
	Domain.find({}, selection, function(err, domains) {
		if (err) return handleError(res, err)
		
		let globalCnt = 0;
		var globalCb = () => {
			globalCnt ++
			if (globalCnt == 25) return res.json(domains)
		}

		domains.forEach(domain => {

			var innerCnt = 0
			var innerCb = () => {
				innerCnt ++
				if (innerCnt == 3) globalCb()
			}
			
			TaskEventCount.count({ domainId: domain.globalId, taskType: 1, count: { $lt: 5 } }, (err, cnt) => {
				domain.availableTrn = cnt
				innerCb()
			})

			TaskEventCount.count({ domainId: domain.globalId, taskType: 2, count: { $lt: 3 } }, (err, cnt) => {
				domain.availableMod = cnt
				innerCb()
			})

			TaskEventCount.count({ domainId: domain.globalId, taskType: 3, count: { $lt: 5 } }, (err, cnt) => {
				domain.availableVal = cnt
				innerCb()
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
