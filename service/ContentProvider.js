const mongoose = require('mongoose')

module.exports.connect = (db_uri) => {
      // connection via uri
      mongoose.connect(db_uri, {})
      // on successful
      mongoose.connection.on('connected', () => {
      	console.log("connected to database " + db_uri)
      })
      // on error
      mongoose.connection.on('error', (err) => {
      	console.log("Database error: " + err)
      })
}
