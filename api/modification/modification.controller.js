const Modification      = require('./modification.model')
const TaskEvent         = require('../taskEvent/taskEvent.model')
const TaskEventCount    = require('../taskEventCount/taskEventCount.model')
const request           = require('request')
const handleError       = require('../../service/ErrorHandler')
const Task              = require('../task/task.model')
const meta              = require('../../meta')

module.exports.saveUserModificationData = function (req, res, next) {
    var user = req.user
    
    var generateValidTask = function(modTaskId, callback) {
        Modification.find({ taskId: modTaskId }, (err, run) => {
            if (err) handleError(err)
            var mset = new Set()
            let userCnt = run.length
            for (let u = 0; u < userCnt; u++) {
                let userRun = run[u]
                for (let w = 0; w < userRun.modifiedWords.length; w++) {
                    mset.add(userRun.modifiedWords[w].postWord)
                }
            }
            var mlist = Array.from(mset)
            var words = []
            for (let i = 0; i < mlist.length; i++) {
                words.push({ word: mlist[i] })
            }
            Task.findById(modTaskId, 'conceptId lemma gloss domainId', (err, origin) => {
                if (err) handleError(err)
                Task.create({
                    conceptId: origin.conceptId,
                    gloss: origin.gloss,
                    lemma: origin.lemma,
                    domainId: origin.domainId,
                    taskType: meta.tasktype.validation,
                    _modificationTaskId: modTaskId,
                    modifiedWords: words
                }, callback)
            })
        })
    }

    Modification.create({
        taskId: req.body.taskId,
        domainId: req.body.domainId,
        modifier: user.username,
        modifierId: user._id,
        modifiedWords: req.body.modifiedWords,
        gap: req.body.gap || false,
        skip: req.body.skip || false,
        startDate: req.body.start_date,
        endDate: req.body.end_date
    }, function(err, modification) {
        if (err) handleError(err)
        var con = 0
        var done = function(err, data) {
            if (err) handleError(err)
            con ++
            if (con == 2) {
                TaskEventCount.findOne({ taskId: modification.taskId }, 'count', (err, tEvCon) => {
                    if (tEvCon.count >= meta.tasklimit.modification) {
                        generateValidTask(modification.taskId, (err, task) => {
                            if (err) handleError(err)
                            TaskEventCount.create({
                                taskId: task._id,
                                taskType: meta.tasktype.validation,
                                domainId: task.domainId,
                                count: 0
                            }, (err, tEvCon) => {
                                return res.json({ statusSuccess: meta.status.ok, statusMsg: meta.msg.mn.modsaved.ok, validationTask: task, taskLog: tEvCon })
                            })
                        })
                    } else {
                        return res.json({ statusSuccess: meta.status.ok, statusMsg: meta.msg.mn.modsaved.ok })
                    }
                })
            }
        }
        TaskEvent.create({
            userId: modification.modifierId,
            domainId: modification.domainId,
            taskType: meta.tasktype.modification,
            taskId: modification.taskId
        }, done)
        if(!modification.skip) TaskEventCount.update({ taskId: modification.taskId }, { $inc: { count: 1 } }, done)
        else done(null, null)
    })
}
