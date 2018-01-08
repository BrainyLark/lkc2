const Router	 = require('express').Router	
const controller = require('./validation.controller')

var router = new Router()

router.post('/', controller.saveUserValidationData)

module.exports = router