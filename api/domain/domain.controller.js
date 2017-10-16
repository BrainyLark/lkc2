const DataStore	= require('../../service/DataAdapter')[0],
	handleError	= require('../../service/ErrorHandler')

const unique_beginners_uk_ids = [
	161, 119, 124, 129, 15355, 127, 145, 138, 131, 123, 40, 132, 83505, 121, 61558, 118, 120, 143, 139, 28162, 142, 133, 130, 122, 134
]

module.exports.index = function (req, res, next) {
	DataStore.getUniqueBeginners(unique_beginners_uk_ids, function (err, data) {
		if (err) return handleError(res, err)
		res.json(data)
	})
}