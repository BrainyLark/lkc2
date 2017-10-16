const Router	= require('express').Router,
	controller	= require('./user.controller'),
	passport	= require('passport');

var router = new Router()

// Non-Authorized paths
router.post('/register', controller.register)
router.post('/authenticate', controller.authenticate)

// Authorized paths
router.get('/profile', passport.authenticate('jwt', {session: false}), controller.profile)

exports['default'] = router
module.exports = exports['default']