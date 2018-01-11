const path = require('path')
const meta = require('../meta')
const TaskEvent = require('../api/taskEvent/taskEvent.model')
const TaskEventCount = require('../api/taskEventCount/taskEventCount.model')
const handleError = require('./ErrorHandler')

var cb = (err, events) => {
    if (err) return handleError(res, err)
    events.forEach(event => {
        TaskEventCount.update({ taskId: event.taskId }, { $inc: { count: -1 } }, (err, doc) => {
            if (err) return handleError(res, err)
            console.log("Task " + doc.taskId + " has now count of: " + doc.count)
        })
        TaskEvent.remove({ taskId: event.taskId, userId: event.userId }, (err) => {
            if (err) return handleError(res, err)
            console.log("Removal successful for task: " event.taskId + " and user: " + event.userId)
        })
    })
}

module.exports.purge = () => {
    console.log("Purification of task slots about to start")
    var expiration = new Date()
    expiration.setDate(expiration.getDate() - meta.exp_days)
    TaskEvent.find({ state: meta.taskstate.ongoing }).where('updatedAt').lt(expiration).exec(cb)
}
