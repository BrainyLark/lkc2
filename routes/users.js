//it's gonna be all of our users routes

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User = require('../models/user');

//Register
router.post('/register', function(req, res, next) {
	var username = req.body.username.toLowerCase();
	User.getUserByUsername(username, function(err, result){
		if(err) throw err;
		if(result!=null){
			res.json({success: false, message: username + " нэртэй оролцогч бүртгэлтэй байна. Өөр нэр сонгоно уу!"});
		} else {
			let newUser = new User({
				name: req.body.name,
				email: req.body.email,
				username: username,
				password: req.body.password
			});

			User.addUser(newUser, function(err, user) {
				if(err){
					res.json({success: false, message: "Оролцогчийг бүртгэх боломжгүй байна"});
				} else{
					res.json({success: true, message: "Оролцогч амжилттай бүртгэгдлээ"});
				}
			});
		}
	});
});


//Authenticate
router.post('/authenticate', function(req, res, next) {
	const username = req.body.username.toLowerCase();
	const password = req.body.password;

	User.getUserByUsername(username, function(err, user) {
		if(err){
			throw err;
		}
		if(!user){
			return res.json({success: false, msg: "Оролцогч олдсонгүй!"});
		}

		User.comparePassword(password, user.password, function(err, isMatch) {
			if(err){
				throw err;
			}

			if(isMatch){
				const token = jwt.sign(user, config.secret, {
					expiresIn: 604800 // 1week
				});

				res.json({
					success: true,
					token: 'JWT '+token,
					user: {
						id: user._id,
						name: user.name,
						username: user.username,
						email: user.email
					}
				});
			} else {
				return res.json({
					success: false,
					msg: 'Нууц үг буруу байна!'
				});
			}
		});
	});
});

//Profile
router.get('/profile', passport.authenticate('jwt', {session: false}),
	function(req, res, next) {
		res.json({user: req.user});
	}
);

module.exports = router;
