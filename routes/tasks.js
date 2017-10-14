'use strict';

const express = require('express');
const router = express.Router();
const taskController = require('../controller/TaskController');

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

router.get('/:id(\\d+)', function (req, res) {
	var cb = function (data) { res.json(data) }
	taskController.getTask(req.params, cb);
})

module.exports = router;
