const Task 				= require('../task/task.model')
const TaskEvent			= require('../taskEvent/taskEvent.model')
const TaskEventCount	= require('../taskEventCount/taskEventCount.model')
const Translation		= require('./translation.model')
const request			= require('request')
const handleError		= require('../../service/ErrorHandler')

// defining constant variables
const TRANSLATION_TASK_TYPE		= 1
const MODIFICATION_TASKTYPE		= 2
const MAX_TRANSLATION			= 5
const STATUS_OK 				= 1
const STATUS_NULL 				= 0

module.exports.showTranslations = function(req, res, next) {
	Translation.findBySettings(req.query, function (err, data) {
		if (err) return handleError(res, err)
		res.json(data)
	})
}

module.exports.saveUserTranslationData = function (req, res, next) {
	var generateModTask = function (translationTaskId, callback) {
		Translation.find({ taskId: translationTaskId }, 'translation', (err, run) => {
			if (err) handleError(err)
			var tset = new Set()
			for (let user = 0; user < 5; user++) {
				for (let ind = 0; ind < run[user].translation.length; ind++)
					tset.add(run[user].translation[ind].lemma)
			}
			tlist = Array.from(tset)
			var words = []
			for (let w = 0; w < tlist.length; w++) {
				words.push({word: tlist[w]})
			}
			Task.findById(translationTaskId, 'conceptId lemma gloss domainId', (err, origin) => {
				if (err) handleError(err)
				Task.create({
					conceptId: origin.conceptId,
					gloss: origin.gloss,
					lemma: origin.lemma,
					domainId: origin.domainId,
					taskType: MODIFICATION_TASKTYPE,
					_translationTaskId: translationTaskId,
					translatedWords: words
				}, callback)
			})
		})
	}
	var user = req.user
	Translation.create({
		taskId: req.body.taskId,
		domainId: req.body.domainId,
		translator: user.username,
		translatorId: user._id,
		translation: req.body.translation,
		skip: req.body.skip || false,
		gap: req.body.gap || false,
		startDate: req.body.start_date,
		endDate: req.body.end_date
	}, function(err, translation) {
		if (err) return handleError(res, err)
		var con = 0
		var done = function(err, data) {
			con++
			if (err) return handleError(res, err)
			if (con == 2) {
				TaskEventCount.findOne({ taskId: req.body.taskId }, (err, tEvCon) => {
					if (tEvCon.count >= MAX_TRANSLATION) {
						generateModTask(req.body.taskId, (err, task) => {
							if (err) handleError(err)
							TaskEventCount.create({ 
								taskId: task._id,
								taskType: MODIFICATION_TASKTYPE,
								domainId: task.domainId,
								count: 0
							}, (err, tEvCon) => {
								if (err) handleError(err)
							 	return res.json({ statusSuccess: STATUS_OK, statusMsg: "Орчуулгыг амжилттай хадгаллаа! Засварын дасгалыг мөн үүсгэлээ!", modificationTask: task, eventLog: tEvCon })
							})
							
						})
					}
					else return res.json({ statusSuccess: STATUS_OK, statusMsg: "Орчуулгыг амжилттай хадгаллаа!"})
				})
			}
		}
		TaskEvent.create({
			userId: translation.translatorId,
			domainId: translation.domainId,
			taskType: TRANSLATION_TASK_TYPE,
			taskId: translation.taskId
		}, done)
		if (!translation.skip) TaskEventCount.update({ taskId: translation.taskId }, { $inc: { count: 1 } }, done)
		else done(null, null)
	})
}
