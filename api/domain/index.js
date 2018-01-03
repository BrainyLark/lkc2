const Router	= require('express').Router
const controller	= require('./domain.controller')

var router = new Router()

router.get('/', controller.index)
// must be used only once
router.get('/generate', controller.generate)

exports['default'] = router
module.exports = exports['default']
