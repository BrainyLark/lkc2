//main server entry point file
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
//const jwt = require('jsonwebtoken');


//connect database
mongoose.connect(config.database);

mongoose.connection.on('connected', function() {
	console.log("connected to database " + config.database);
});

mongoose.connection.on('error', function(err) {
	console.log("Database error: " + err);
});

//Initiates app
const app = express();

//Where routes of users are
const users = require('./routes/users');
const tasks = require('./routes/tasks');

//Port Number
const port = 3000;

//Cors Middleware
app.use(cors());
//allows JS req accesses in domains

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public ')));

//Body Parser Middleware
app.use(bodyParser.json());
//allows to extract data from req from front end

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/tasks', tasks);
app.use('/tasks', passport.authenticate('jwt', {session: false}, tasks));

//Index Route
app.get('/', function(req, res) {
	res.send("Hey Buddy");
})

//Start Server
app.listen(port, function() {
	console.log("server started on port " + port);
});
