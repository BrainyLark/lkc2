const Modification      = require('./modification.model')
const TaskEvent         = require('../taskEvent/taskEvent.model')
const TaskEventCount    = require('../taskEventCount/taskEventCount.model')
const request           = require('request')
const handleError       = require('../../service/ErrorHandler')
const Task              = require('../task/task.model')
const meta              = require('../../meta')

module.exports.saveUserModificationData = (req, res, next) => {
    var user = req.user
    var modificationType = !req.body.modificationType ? meta.runType.synset : req.body.modificationType

    var generateValidTask = (modTaskId, mdType, callback) => {
        Modification.find({ taskId: modTaskId }, (err, run) => {
            if (err) return handleError(res, err)
            var words, glosses
            var qryString = 'conceptId synset domainId'
            if (mdType == meta.runType.synset) {
                var mset = new Set()
                let userCnt = run.length
                for (let u = 0; u < userCnt; u++) {
                    let userRun = run[u]
                    for (let w = 0; w < userRun.modifiedWords.length; w++) {
                        mset.add(userRun.modifiedWords[w].postWord)
                    }
                }
                var mlist = Array.from(mset)
                words = []
                for (let i = 0; i < mlist.length; i++) {
                    words.push({ word: mlist[i] })
                }
            } else if (mdType == meta.runType.gloss) {
                qryString += ' targetWords'
                glosses = []
                for (let user = 0; user < meta.tasklimit.modification; user++) {
                    glosses.push(run[user].modification)
                }
            }
            Task.findById(modTaskId, qryString, (err, origin) => {
                if (err) handleError(err)
                var validTaskData = {
                    conceptId: origin.conceptId,
                    synset: origin.synset,
                    domainId: origin.domainId,
                    taskType: origin.taskType + 1,
                    _modificationTaskId: modTaskId,
                }
                if (mdType == meta.runType.synset) {
                    validTaskData.modifiedWords = words   
                } else if (mdType == meta.runType.gloss) {
                    validTaskData.targetWords = origin.targetWords
                    validTaskData.modifiedGloss = glosses
                }
                Task.create(validTaskData, callback)
            })
        })
    }

    var data = {
        taskId: req.body.taskId,
        domainId: req.body.domainId,
        modifier: user.username,
        modifierId: user._id,
        modification: req.body.modification,
        skip: req.body.skip || false,
        startDate: req.body.start_date,
        endDate: req.body.end_date
    }

    if (translationType == meta.runType.synset) {
        data.gap = req.body.gap || false
        data.gapReason = req.body.gapReason || null
    }

    Modification.create(data, (err, modification) => {
        if (err) handleError(err)
        var con = 0
        var cb = (err, data) => {
            if (err) return handleError(res, err)
            con ++
            if (con == 2) {
                TaskEvent.count({ taskId: modification.taskId, state: meta.taskstate.terminated }, (err, e_count) => {
                    if (e_count >= meta.tasklimit.modification) {
                        generateValidTask(modification.taskId, modificationType, (err, task) => {
                            if (err) return handleError(res, err)
                            TaskEventCount.create({
                                taskId: task._id,
                                taskType: task.taskType,
                                domainId: task.domainId,
                                count: 0
                            }, (err, e_count) => {
                                if (err) return handleError(res, err)
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
