const Router = require('express').Router
const controller = require('./performance.controller')

var router = new Router()

router.get('/', controller.getPerformance)

module.exports = router