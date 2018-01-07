const Modification      = require('./modification.model')
const TaskEvent         = require('../taskEvent/taskEvent.model')
const TaskEventCount    = require('../taskEventCount/taskEventCount.model')
const request           = require('request')
const handleError       = require('../../service/ErrorHandler')

const MODIFICATION_TASKTYPE     = 2
const MAX_MODIFICATION          = 3
const STATUS_OK                 = 1
const STATUS_NULL               = 0

module.exports.saveUserModificationData = function (req, res, next) {
    var user = req.user
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
                    if (tEvCon.count >= MAX_MODIFICATION) {
                        return res.json({ statusSuccess: STATUS_NULL, statusMsg: "Validation task is created here" })
                    } else {
                        return res.json({ statusSuccess: STATUS_OK, statusMsg: "Засварлалтыг амжилттай хадгаллаа!" })
                    }
                })
            }
        }
        TaskEvent.create({
            userId: modification.modifierId,
            domainId: modification.domainId,
            taskType: MODIFICATION_TASKTYPE,
            taskId: modification.taskId
        }, done)
        if(!modification.skip) TaskEventCount.update({ taskId: modification.taskId }, { $inc: { count: 1 } }, done)
        else done(null, null)
    })
}
