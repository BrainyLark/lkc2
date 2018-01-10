const Router	= require('express').Router
const controller	= require('./generate.controller')

var router = new Router()

router.get('/', controller.index)

exports['default'] = router
module.exports = exports['default']
