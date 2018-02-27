const Translation = require('../translation/translation.model')
const Modification = require('../modification/modification.model')
const Validation = require('../validation/validation.model')
const meta		= require('../../meta')
const handleError = require('../../service/ErrorHandler')

module.exports.getPerformance = (req, res, next) => {
	var userId = req.user._id
	var cntData = { }
	var cnt = 0
	var getCount = () => {
		var done = () => {
			cnt ++
			if (cnt == 3) return res.json(cntData)
		}
		Translation.count({ translatorId: userId, skip: false }, (err, count) => {
			if (err) return handleError(res, err)
			cntData.translation = count
			done()
		})
		Validation.count({ validatorId: userId, skip: false }, (err, count) => {
			if (err) return handleError(res, err)
			cntData.validation = count
			done()
		})
		Modification.count({ modifierId: userId, skip: false }, (err, count) => {
			if (err) return handleError(res, err)
			cntData.modification = count
			done()
		})
	}
	getCount()
}