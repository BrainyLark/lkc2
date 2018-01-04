const Router	= require('express').Router,
	controller	= require('./translation.controller'),
	taskController = require('../task/task.controller')

var router = new Router()

router.get('/', controller.showTranslations)
router.get('/:domainId(\\d+)/:taskId(\\d+)', taskController.next)
router.post('/', controller.saveUserTranslationData)

exports['default'] = router
module.exports = exports['default']
