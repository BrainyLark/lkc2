const Router            = require('express').Router
const controller        = require('./modification.controller')
const taskController    = require('../task/task.controller')

var router = new Router()

router.post('/', controller.saveUserModificationData)
router.get('/:domainId(\\d+)', taskController.next)

module.exports = router
