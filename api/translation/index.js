const Router	= require('express').Router
const controller	= require('./translation.controller')

var router = new Router()

router.get('/prev', controller.getPrevious)
router.get('/next', controller.getNext)
router.post('/', controller.saveUserTranslationData)
router.post('/gloss', controller.saveGlossTranslationData)

exports['default'] = router
module.exports = exports['default']
