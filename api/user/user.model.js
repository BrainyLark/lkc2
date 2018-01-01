const mongoose 	= require('mongoose'),
	bcrypt 	= require('bcryptjs'),
	handleError	= require('../../service/ErrorHandler')

const UserSchema = mongoose.Schema({
	name:		{type: String, trim: true },
	email: 	{type: String, lowercase: true, requried: true },
	username: 	{type: String, lowercase: true, trim: true, required: true },
	password: 	{type: String, required: true }
}, { timestamps: true })

const User = module.exports = mongoose.model('User', UserSchema)

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback)
}

module.exports.getByUsername = function(username, callback) {
	const query = {username: username}
	User.findOne(query, callback)
}

module.exports.addUser = function(newUser, callback) {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newUser.password, salt, function(err, hash) {
			if (err) return handleError(res, err)
			newUser.password = hash
			newUser.save(callback)
		})
	})
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
		if (err) return handleError(res, err)
		callback(null, isMatch)
	})
}