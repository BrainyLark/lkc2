const Router	= require('express').Router,
	controller	= require('./translation.controller')

var router = new Router()

router.get('/', controller.showTranslations)
router.post('/', controller.saveUserTranslationData)

exports['default'] = router
module.exports = exports['default']
