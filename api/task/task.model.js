const mongoose 	= require('mongoose')

const TaskSchema = mongoose.Schema({
	label: 				{ type: String, required: true },
	gloss: 				{ type: String, required: true },
	conceptId: 				{ type: Number, required: true },
	conceptGlobalId: 			{ type: Number, required: true },
	parentConceptId: 			{ type: Number, required: true },
	parentConceptGlobalId: 		{ type: Number, required: true },
	lemma: 				{ type: String, required: true },
	domainId: 				{ type: Number, required: true },
	taskType: 				{ type: Number, min: 1, max: 10, required: true },
	wordnetId: 				{ type: Number, required: true }
}, { timestamps: true })

const Task = module.exports = mongoose.model('Task', TaskSchema)

// Task table custom helper methods
module.exports.findBySettings = function(settings, callback) {
	const query = {}
	if (settings._id) 				query._id = settings._id
	if (settings.__v) 				query.__v = settings.__v
	if (settings.label) 				query.label = settings.label
	if (settings.gloss) 				query.gloss = settings.gloss
	if (settings.conceptId) 			query.conceptId = settings.conceptId
	if (settings.conceptGlobalId) 		query.conceptGlobalId = settings.conceptGlobalId
	if (settings.parentConceptId) 		query.parentConceptId = settings.parentConceptId
	if (settings.parentConceptGlobalId) 	query.parentConceptGlobalId = settings.parentConceptGlobalId
	if (settings.lemma) 				query.lemma = settings.lemma
	if (settings.domainId) 				query.domainId = settings.domainId
	if (settings.taskType) 				query.taskType = settings.taskType
	if (settings.wordnetId) 			query.wordnetId = settings.wordnetId
	Task.find(query, callback)
}