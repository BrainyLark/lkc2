const Router	= require('express').Router,
	controller	= require('./task.controller')

var router = new Router()

router.get('/', controller.index)
router.get('/truncate', controller.truncate)
router.get('/:id', controller.show)

exports['default'] = router
module.exports = exports['default']