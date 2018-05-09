const mongoose 	= require('mongoose')

const TaskEventCountSchema = mongoose.Schema({
	taskId: 		{ type: String, required: true, unique: true },
	taskType: 		{ type: String, required: true },
	domainId: 		{ type: Number, required: true },
	count: 		{ type: Number, required: true, default: 0}
}, { timestamps: true })

const TaskEventCount = module.exports = mongoose.model('TaskEventCount', TaskEventCountSchema)
