'use strict';
var path = require('path');

// All configurations will extend these options
// ============================================
module.exports = {
	env: process.env.NODE_ENV,
	root: path.normalize(__dirname + '/..'),
	// Server port
	port: process.env.PORT || 80,
	// Server IP
	ip: process.env.IP || '0.0.0.0',
	// Secret for session, you will want to change this and make it an environment variable
	database: {
		uri: "mongodb://localhost:27017/lkc2",
		secret: "gew&*HFE*&QQ)@2(jdmoiJF(*#R"
	},
	// lkc api requires this one
	// this cookie must be renewed within 3 days, in which one is valid and so that task and domain generation are valid
	cookie: "connect.sid=s%3AxNeTUTuhXlKiJrl9ubcKP6aEPNbQcm1e.eeaRuMRHUMrcA8AGCFRlcpkMaaWoa4lO%2BrdpTskaRV0"
}
