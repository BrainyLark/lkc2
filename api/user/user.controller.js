const jwt 		= require('jsonwebtoken'),
	config 	= require('../../config'),
	User 		= require('./user.model'),
	handleError	= require('../../service/ErrorHandler')

//Register
exports.register = function(req, res, next) {
	const username = req.body.username.toLowerCase()

	User.getByUsername(username, function(err, result){
		if (err) handleError(res, err)
		if (result != null){
			res.json({success: false, message: username + " нэртэй оролцогч бүртгэлтэй байна. Өөр нэр сонгоно уу!"})
		} else {
			let newUser = new User({
				name: req.body.name,
				email: req.body.email,
				username: username,
				password: req.body.password
			})

			User.addUser(newUser, function(err, user) {
				if (err) {
					res.json({success: false, message: "Оролцогчийг бүртгэх боломжгүй байна"})
				} else {
					res.json({success: true, message: "Оролцогч амжилттай бүртгэгдлээ"})
				}
			})
		}
	})
}

//Authenticate
exports.authenticate = function(req, res, next) {
	const username = req.body.username.toLowerCase()
	const password = req.body.password

	User.getByUsername(username, function(err, user) {
		if (err) handleError(res, err)
		if (!user) {
			return res.json({success: false, msg: "Оролцогч олдсонгүй!"})
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
					msg: 'Нууц үг буруу байна!'
				})
			}
		})
	})
}

//Profile
exports.profile = function(req, res, next) { res.json(req.user) }