//main server entry point file
const express	= require('express')
const path		= require('path')
const morgan	= require('morgan')
const bodyParser	= require('body-parser')
const cors		= require('cors')
const passport	= require('passport')
const config	= require('./config')
const SlotResolver	= require('./service/SlotResolver')
const ContentProvider	= require('./service/ContentProvider')
const meta		= require('./meta')
const session	= require('express-session');
const cookieParser	= require('cookie-parser');

//connect database
ContentProvider.connect(config.database.uri)

//Initiates app
const app = express()

//Cors Middleware
app.use(cors())

app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200')
	res.setHeader('Access-Control-Allow-Origin', 'http://192.168.0.104:4200')
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
	res.setHeader('Access-Control-Allow-Credentials', true)
	next()
})


//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//allows to extract data from req from front end

//cookie parser
app.use(cookieParser())

// Attach morgan
app.use(morgan('dev'))

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

require('./auth/passport')(passport)

// SlotResolver purges every expired task placeholders
setInterval(SlotResolver.purge, meta.interval)

// API routes of our server
app.use('/user', require('./api/user'))
app.use('/generate', require('./api/generate'))

// Authorized APIs
const APIs = ['taskEvent', 'taskEventCount', 'domain', 'task', 'translation', 'modification', 'validation', 'performance']
APIs.forEach(api => { app.use('/' + api, passport.authenticate('jwt', {session: false}), require('./api/' + api)) })

//Index Route
app.get('/', function(req, res) {
	console.log(req.cookies)
	res.cookie('l_tr_id', 178, { maxAge: 60000 })
	res.cookie('l_tr_did', 161, { maxAge: 60000 })
	res.cookie('l_tr_trm', false, { maxAge: 60000 })
	res.json({status: -1, msg: "You have been directed into the wrong endpoint!"}) 
})

//Start Server
app.listen(config.port, function() {
	console.log("server started on port " + config.port)
})

app.all('*', function(req, res) { require('./service/ErrorHandler').notFound(res) })
