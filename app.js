//main server entry point file
const express	= require('express'),
	path		= require('path'),
	morgan	= require('morgan'),
	bodyParser	= require('body-parser'),
	cors		= require('cors'),
	passport	= require('passport'),
	mongoose	= require('mongoose'),
	config	= require('./config')

//connect database
mongoose.connect(config.database.uri, { useMongoClient: true })

mongoose.connection.on('connected', function() {
	console.log("connected to database " + config.database.uri)
})

mongoose.connection.on('error', function(err) {
	console.log("Database error: " + err)
})

//Initiates app
const app = express()

//Cors Middleware
app.use(cors())

app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200')
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
	res.setHeader('Access-Control-Allow-Credentials', true)
	next()
})


//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//allows to extract data from req from front end

// Attach morgan
app.use(morgan('dev'))

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

require('./auth/passport')(passport)

// API routes of our server
app.use('/user', require('./api/user'))
app.use('/generate', require('./api/generate'))
app.use('/domain', require('./api/domain'))

// Authorized APIs
const APIs = ['taskEvent', 'taskEventCount', 'task', 'translation']
APIs.forEach(api => { app.use('/' + api, passport.authenticate('jwt', {session: false}), require('./api/' + api)) })

//Index Route
app.get('/', function(req, res) { res.json({status: -1, msg: "You have directed into the wrong endpoint!"}) })

//Start Server
app.listen(config.port, function() {
	console.log("server started on port " + config.port)
})

app.all('*', function(req, res) { require('./service/ErrorHandler').notFound(res) })
