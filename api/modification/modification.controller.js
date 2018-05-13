const Modification      = require('./modification.model')
const TaskEvent         = require('../taskEvent/taskEvent.model')
const TaskEventCount    = require('../taskEventCount/taskEventCount.model')
const request           = require('request')
const handleError       = require('../../service/ErrorHandler')
const Task              = require('../task/task.model')
const meta              = require('../../meta')

module.exports.saveUserModificationData = (req, res, next) => {
    var user = req.user
    var req_taskId = req.body.taskId
    var modificationType = !req.body.modificationType ? 'SynsetModification' : req.body.modificationType

    var generateValidTask = (modTaskId, mdType, callback) => {
        Modification.find({ taskId: modTaskId, skip: false }, 'modification', (err, run) => {
            if (err) return handleError(res, err)
            var words, glosses
            var qryString = 'conceptId synset domainId'
            if (mdType == 'SynsetModification') {
                var mset = new Set()
                let userCnt = run.length
                for (let u = 0; u < userCnt; u++) {
                    let userRun = run[u]
                    for (let w = 0; w < userRun.modification.length; w++) {
                        mset.add(userRun.modification[w].postWord)
                    }
                }
                var mlist = Array.from(mset)
                words = []
                for (let i = 0; i < mlist.length; i++) {
                    words.push({ word: mlist[i] })
                }
            } else if (mdType == 'GlossModification') {
                qryString += ' targetWords'
                glosses = []
                for (let user = 0; user < meta.tasklimit.modification; user++) {
                    glosses.push({ gloss: run[user].modification, _id: user })
                }
            }
            Task.findById(modTaskId, qryString, (err, origin) => {
                if (err) handleError(err)
                let taskType = origin.taskType == 'SynsetModificationTask' ? 'SynsetValidationTask' : 'GlossValidationTask'
                var validTaskData = {
                    conceptId: origin.conceptId,
                    synset: origin.synset,
                    domainId: origin.domainId,
                    taskType: taskType,
                    _modificationTaskId: modTaskId,
                }
                if (mdType == 'SynsetModification') {
                    validTaskData.modifiedWords = words   
                } else if (mdType == 'GlossModification') {
                    validTaskData.targetWords = origin.targetWords
                    validTaskData.modifiedGlosses = glosses
                }
                Task.create(validTaskData, callback)
            })
        })
    }

    var data = {
        modificationType: modificationType,
        taskId: req_taskId,
        domainId: req.body.domainId,
        modifier: user.username,
        modifierId: user._id,
        modification: req.body.modification,
        skip: req.body.skip || false,
        startDate: req.body.start_date,
        endDate: req.body.end_date
    }

    if (modificationType == 'SynsetModification') {
        data.gap = req.body.gap || false
        data.gapReason = req.body.gapReason || null
    }

    Modification.create(data, (err, modification) => {
        if (err) return handleError(res, err)
        var con = 0
        var cb = (err, data) => {
            if (err) return handleError(res, err)
            con ++
            if (con == 2) {
                TaskEvent.count({ taskId: modification.taskId, state: meta.taskstate.terminated }, (err, e_count) => {
                    if (e_count >= meta.tasklimit.modification) {
                        generateValidTask(req_taskId, modificationType, (err, task) => {
                            if (err) return handleError(res, err)
                            TaskEventCount.create({
                                taskId: task._id,
                                taskType: task.taskType,
                                domainId: task.domainId,
                                count: 0
                            }, (err, e_count) => {
                                if (err) return handleError(res, err)
                                console.log("ValidationTask successfully created! Molto Bene!")
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
