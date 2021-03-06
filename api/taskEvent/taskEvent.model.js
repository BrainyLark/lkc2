const mongoose 	= require('mongoose')
const state		= require('../../meta').taskstate

const TaskEventSchema = mongoose.Schema({
	taskId: 		{ type: String, required: true },
	taskType: 		{ type: String, required: true },
	domainId: 		{ type: Number, required: true },
	userId: 		{ type: String, required: true },
	state:		{ type: Number, required: true, default: state.ongoing }
}, { timestamps: true })

const TaskEvent = module.exports = mongoose.model('TaskEvent', TaskEventSchema)

module.exports.lastEvent = function(query, callback) {
	TaskEvent.findOne({})
		.where('userId').equals(query[0])
		.where('domainId').equals(query[1])
		.where('taskType').equals(query[2])
		.sort('-_id').limit(1).exec(callback);
}
