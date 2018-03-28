const jwt 		= require('jsonwebtoken'),
	config 	= require('../../config'),
	User 		= require('./user.model'),
	handleError	= require('../../service/ErrorHandler'),
	meta		= require('../../meta'),
	nodemailer	= require('nodemailer'),
	bcrypt	 = require('bcryptjs')

//Register
exports.register = function(req, res, next) {
	const username = req.body.username.toLowerCase()

	User.getByUsername(username, function(err, result){
		if (err) handleError(res, err)
		if (result != null){
			res.json({success: false, message: meta.msg.mn.user.changeuname})
		} else {
			let newUser = new User({
				name: req.body.name,
				email: req.body.email,
				username: username,
				password: req.body.password
			})

			User.addUser(newUser, function(err, user) {
				if (err) {
					res.json({success: false, message: meta.msg.mn.user.register.null})
				} else {
					res.json({success: true, message: meta.msg.mn.user.register.ok})
				}
			})
		}
	})
}

exports.updatePassword = (req, res, next) => {
	const username = req.body.username.toLowerCase()
	const resetCode = req.body.resetCode.toLowerCase()
	const password = req.body.password.toLowerCase()

	User.getByUsername(username, (err, user) => {
		if (err) handleError(res, err)
		if (!user) {
			return res.json({success: false, msg: meta.msg.mn.user.auth.notfound})
		}

		if (user.resetCode != resetCode) {
			return res.json({success: false, msg: meta.msg.mn.user.reset.wrong})
		}

		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(password, salt, function(err, hash) {
				if (err) return handleError(res, err)
				User.update({ username: user.username }, { $set: { password: hash } }, (err, data) => {
					if (err) handleError(res, err)
					return res.json({ success: true, msg: meta.msg.mn.user.reset.success })
				})
			})
		})

	})

}

exports.checkResetCode = (req, res, next) => {
	const username = req.body.username.toLowerCase()
	const resetCode = req.body.resetCode.toLowerCase()

	User.getByUsername(username, (err, user) => {
		if (err) return handleError(res, err)
		if (!user) {
			return res.json({ success: false, msg: meta.msg.mn.user.auth.notfound })
		}

		if (resetCode == user.resetCode) {
			return res.json({ success: true, msg: meta.msg.mn.user.reset.allowed })
		} else {
			return res.json({ success: false, msg: meta.msg.mn.user.reset.denied })
		}
	})
}

exports.resetPassword = (req, res, next) => {
	const username = req.body.username.toLowerCase()

	User.getByUsername(username, (err, user) => {
		if (err) return handleError(res, err)
		if (!user) {
			return res.json({success: false, msg: meta.msg.mn.user.auth.notfound})
		}

		var resetCode = Math.random().toString(36).substr(2)
		var userEmail = user.email

		User.update({ username: username }, { $set: { resetCode: resetCode } }, (err, user) => {
			var transporter = nodemailer.createTransport({
		        service: 'Gmail',
		        auth: {
		            user: config.email.address, // Your email id
		            pass: config.email.pass // Your password
		        }
		    })

			var mailOptions = {
				from: config.email.address,
				to: userEmail,
				subject: 'Нууц үг сэргээх',
				html: 'Сайн байна уу, ' + username.toUpperCase() + ' <br><br> Нууц үг сэргээхэд баталгаажуулах код: <b>' + resetCode + '</b><br><br> Хүндэтгэсэн, <br> -Эрдэнэбилэг'
			}

			transporter.sendMail(mailOptions, function(error, info){
			    if (error) {
			        return res.json({ success: false, msg: null })
			    } else {
			        return res.json({ success: true, msg: info })
			    }
			})

		})

	})
}

//Authenticate
exports.authenticate = function(req, res, next) {
	const username = req.body.username.toLowerCase()
	const password = req.body.password

	User.getByUsername(username, function(err, user) {
		if (err) handleError(res, err)
		if (!user) {
			return res.json({success: false, msg: meta.msg.mn.user.auth.notfound})
		}

		User.comparePassword(password, user.password, function(err, isMatch) {
			if (err) handleError(res, err)

			if (isMatch){
				const token = jwt.sign(user.toObject(), config.database.secret, {
					expiresIn: 604800 // 1week
				})

				res.json({
					success: true,
					token: 'JWT ' + token,
					user: {
						id: user._id,
						name: user.name,
						username: user.username,
						email: user.email
					}
				})
			} else {
				return res.json({
					success: false,
					msg: meta.msg.mn.user.auth.wpass
				})
			}
		})
	})
}

//Profile
exports.profile = function(req, res, next) { 
	var user = req.user
	res.json({
		_id: user._id,
		name: user.name,
		username: user.username,
		email: user.email
	})
}