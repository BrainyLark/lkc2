const Router	= require('express').Router,
	controller	= require('./taskEvent.controller')

var router = new Router()

router.get('/', controller.index)
router.get('/truncate', controller.truncate)

exports['default'] = router
module.exports = exports['default']