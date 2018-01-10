const Router	= require('express').Router
const controller	= require('./task.controller')

var router = new Router()

router.get('/', controller.index)
router.get('/truncate', controller.truncate)
router.get('/:id', controller.show)
router.get('/:typeId/:domainId(\\d+)', controller.next)

exports['default'] = router
module.exports = exports['default']
