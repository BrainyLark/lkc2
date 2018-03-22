const Modification      = require('./modification.model')
const TaskEvent         = require('../taskEvent/taskEvent.model')
const TaskEventCount    = require('../taskEventCount/taskEventCount.model')
const request           = require('request')
const handleError       = require('../../service/ErrorHandler')
const Task              = require('../task/task.model')
const meta              = require('../../meta')

module.exports.saveUserModificationData = (req, res, next) => {
    var user = req.user

    var generateValidTask = (modTaskId, callback) => {
        Modification.find({ taskId: modTaskId }, (err, run) => {
            if (err) return handleError(res, err)
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
            Task.findById(modTaskId, 'conceptId synset lemma gloss domainId', (err, origin) => {
                if (err) handleError(err)
                Task.create({
                    conceptId: origin.conceptId,
                    gloss: origin.gloss,
                    lemma: origin.lemma,
                    synset: origin.synset,
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
        gapReason: req.body.gapReason || null,
        skip: req.body.skip || false,
        startDate: req.body.start_date,
        endDate: req.body.end_date
    }, (err, modification) => {
        if (err) handleError(err)
        var con = 0
        var cb = (err, data) => {
            if (err) return handleError(res, err)
            con ++
            if (con == 2) {
                TaskEvent.count({ taskId: modification.taskId, state: meta.taskstate.terminated }, (err, e_count) => {
                    if (e_count >= meta.tasklimit.modification) {
                        generateValidTask(modification.taskId, (err, task) => {
                            if (err) handleError(err)
                            TaskEventCount.create({
                                taskId: task._id,
                                taskType: meta.tasktype.validation,
                                domainId: task.domainId,
                                count: 0
                            }, (err, e_count) => {
                                if (err) return handleError(res, err)
                                console.log("Validation task successfully generated:\n")
								console.log("Created task: ", task)
								console.log("Task log: ", e_count)
                            })
                        })
                    }
                    return res.json({ statusSuccess: meta.status.ok, statusMsg: meta.msg.mn.modsaved.ok })
                })
            }
        }
        if (modification.skip) {
            TaskEventCount.update({ taskId: modification.taskId }, { $inc: { count: -1 } }, cb)
            TaskEvent.update({ taskId: modification.taskId, userId: modification.modifierId }, { $set: { state: meta.taskstate.skipped } }, cb)
        }
        else {
            TaskEvent.update({ taskId: modification.taskId, userId: modification.modifierId }, { $set: { state: meta.taskstate.terminated } }, cb)
            cb(null, null)
        }
    })
}
