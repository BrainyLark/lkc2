'use strict'
var path = require('path')

module.exports = {
	tasktype: {
		translation: 1,
		modification: 2,
		validation: 3
	},
	status: {
		ok: 1,
		null: 0
	},
	tasklimit: {
		translation: 5,
		modification: 3,
		validation: 5
	}
}