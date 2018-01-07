const Router            = require('express').Router
const controller        = require('./modification.controller')

var router = new Router()

router.post('/', controller.saveUserModificationData)

module.exports = router
