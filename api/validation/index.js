const router	 = require('express').Router	
const controller = require('./validation.controller')

router('/', controller.saveUserValidationData)

module.exports = router