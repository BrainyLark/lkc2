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

const Estimator = require('./service/Estimator')

//connect database
ContentProvider.connect(config.database.uri)

//Initiates app
const app = express()

//Cors Middleware
app.use(cors())

app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200')
	//res.setHeader('Access-Control-Allow-Origin', 'http://lkc.num.edu.mn')
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
	res.setHeader('Access-Control-Allow-Credentials', true)
	next()
})

//set static folder
//app.use(express.static(path.join(__dirname, 'angular-src/dist')))

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

app.get('/alpha', (req, res, next) => {
	var reliMatrix = [[0,0,0,0,0], [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [0,1,0,2,1]]
	var alpha = Estimator.calculateAlpha(reliMatrix, 5, 5)
	console.log(reliMatrix)
	return res.json({ agreement: alpha })
})

// Authorized APIs
const APIs = ['taskEvent', 'taskEventCount', 'domain', 'task', 'translation', 'modification', 'validation', 'performance']
APIs.forEach(api => { app.use('/' + api, passport.authenticate('jwt', {session: false}), require('./api/' + api)) })

//Start Server
app.listen(config.port, function() {
	console.log("server started on port " + config.port)
})

app.all('*', function(req, res) { res.sendFile(path.join(__dirname, 'angular-src/dist/index.html')) })
