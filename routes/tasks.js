'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const taskController = require('../controller/TaskController');
const translationController = require('../controller/TranslationController');
const modificationController = require('../controller/ModificationController');
const validationController = require('../controller/ValidationController');
const Translation = require('../models/translation');

router.get('/', function (req, res) {
	var cb = function (err, data) {
		if(err) throw err;
		res.json({data: data});
	}
	taskController.getUniqueBeginners(cb)
})

router.get('/generate', function (req, res) {
	if (!req.query.hasOwnProperty('uk_id')) {
		res.status(400).json({message: 'uk_id should be defined'})
	}
	var cb = function (err, data) {
		if (err) {
			res.status(400).json(err)
			return
		}
		res.json(data)
	}
	let offset = req.query.offset || 0;
	let limit = req.query.limit || 10;
	taskController.generate(req.query.uk_id, offset, limit, cb)
})

router.get('/generatetasklog', function (req, res) {
	var cb = function (err, data) {
		if (err) {
			res.status(400).json(err)
			return
		}
		res.json(data)
	}
	taskController.generateLogTable(cb);
})

router.get('/:id(\\d+)', function (req, res) {
	var cb = function (data) { res.json(data) }
	taskController.getTask(req.params, cb);
})

router.get('/translation/:domainId', passport.authenticate('jwt', {session: false}),
	function(req, res, next){
	      var user = req.user;
	      var domainId = req.params.domainId;
		var username = user.username;
		res.json({user: username});
		return;

	      console.log("Sanaa in tasks router : " + username);

	      translationController.allocateTask(username, domainId, function(err, data){
	            if(err) {
	                  res.send(err);
	            }
	            else {
	                  res.json({data: data});
	            }
	      });
	});

router.post('/translation', passport.authenticate('jwt', {session: false}),
	function(req, res, next) {
		var username = req.user.username;
		if(username == null) {
			res.json({success: false, msg: "Дахин нэвтрэх шаардлагатай!"});
		} else {
			let newTranslation = new Translation({
				translator: username,
				translation: req.body.translation,
				start_date: req.body.start_date,
				end_date: req.body.end_date
			});

			Translation.addTranslation(newTranslation, function(err, translation) {
				if(err) {
					res.json({success: false, msg: "Орчуулгыг хадгалахад алдаа гарлаа!"});
				} else {
					res.json({success: true, msg: "Орчуулгыг амжилттай хадгаллаа!"});
				}
			});
		}
	});

router.post('/modification', function(req, res, next){
      var username = req.body.username;
      var domainId = req.body.domainId;
      /*
            allocate task from modification class
      */

});

router.post('/validation', function(req, res, next){
      var username = req.body.username;
      var domainId = req.body.domainId;
      /*
            allocate task from validation class
      */
});


module.exports = router;
