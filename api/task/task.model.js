const mongoose 	= require('mongoose')
const meta		= require('../../meta')

// Necessary english resources for any type of task
const TaskSchema = new mongoose.Schema({
	label:			{ type: String, required: false },
	gloss: 			{ type: String, required: true },
	conceptId: 			{ type: Number, required: true },
	conceptGlobalId: 		{ type: Number, required: false },
	parentConceptId: 		{ type: Number, required: false },
	parentConceptGlobalId: 	{ type: Number, required: false },
	lemma: 			{ type: String, required: true },
	domainId: 			{ type: Number, required: true },
	taskType: 			{ type: Number, min: 1, max: 10, required: true },
	wordnetId: 			{ type: Number, required: false }
}, { discriminatorKey: 'taskType', timestamps: true })

const Task = module.exports = mongoose.model('Task', TaskSchema)

const TranslationTask = Task.discriminator(meta.tasktype.translation, new mongoose.Schema({}))

const ModificationTask = Task.discriminator(meta.tasktype.modification,
	new mongoose.Schema({
		translatedWords: 		[{ word: String }],
		_translationTaskId:	{ type: String }
	}))

const VerificationTask = Task.discriminator(meta.tasktype.validation,
	new mongoose.Schema({
		modifiedWords: 		[{ word: String }],
		_modificationTaskId:	{ type: String }
	}))

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
