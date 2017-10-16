const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../api/user/user.model')
const config = require('../config')

module.exports = function(passport){
	let opts = {}
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt")
	opts.secretOrKey = config.database.secret
	passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
		User.getByJWT(jwt_payload, function(err, user) {
			if(err) return done(err, false)

			if(user){
				return done(null, user[0])
			} else {
				return done(null, false)
			}
		})
	}))
}