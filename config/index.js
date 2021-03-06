'use strict';
var path = require('path');

// All configurations will extend these options
// ============================================
module.exports = {
	env: process.env.NODE_ENV,
	root: path.normalize(__dirname + '/..'),
	// Server port
	port: process.env.PORT || 3000,
	// Server IP
	ip: process.env.IP || '0.0.0.0',
	// Secret for session, you will want to change this and make it an environment variable
	database: {
		uri: "mongodb://localhost:27017/lkc2",
		secret: "gew&*HFE*&QQ)@2(jdmoiJF(*#R"
	},
	email: {
		address: "mnlkcproject@gmail.com",
		pass: "eventhorizon"
	},
	// lkc api requires this one
	// this cookie must be renewed within 3 days, in which one is valid and so that task and domain generation are valid
	cookie: "connect.sid=s%3AzwNyvzt2jFkzq0QGlzq5kfIpo-TCY9yE.mW1rZsUxSYrWbb2AeHx2UAKCiWJmiHgcutxkjML9lyI",
	// Connection information for UKC Postgres database
	pgDatabase: {
		PGHOST: 'localhost',
		PGUSER: 'postgres',
		PGDATABASE: 'ukc-v1.0.210219',
		PGPASSWORD: 'pgsa',
		PGPORT: 5432
	}
}
