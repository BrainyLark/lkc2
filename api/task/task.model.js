const mongoose 	= require('mongoose')
const meta		= require('../../meta')

// Necessary english resources for any type of task
const TaskSchema = new mongoose.Schema({
	conceptId: 			{ type: Number, required: true },
	conceptGlobalId: 		{ type: Number, required: false },
	parentConceptId: 		{ type: Number, required: false },
	parentConceptGlobalId: 	{ type: Number, required: false },
	posTag:				{ type: String, required: false },
	synset: 			[{ languageCode: String, vocabularyId: Number, concept: String, gloss: String, lemma: String }],
	domainId: 			{ type: Number, required: true },
	taskType: 			{ type: Number, min: 1, max: 10, required: true },
	wordnetId: 			{ type: Number, required: false }
}, { discriminatorKey: 'taskType', timestamps: true })

const Task = module.exports = mongoose.model('Task', TaskSchema)

const SynsetTranslationTask = Task.discriminator('SynsetTranslationTask', new mongoose.Schema({}))

const SynsetModificationTask = Task.discriminator('SynsetModificationTask',
	new mongoose.Schema({
		translatedWords: 	[{ word: String }],
		_translationTaskId:	{ type: String }
	}))

const SynsetValidationTask = Task.discriminator('SynsetValidationTask',
	new mongoose.Schema({
		modifiedWords: 			[{ word: String }],
		_modificationTaskId:	{ type: String }
	}))

const GlossTranslationTask = Task.discriminator('GlossTranslationTask', 
	new mongoose.Schema({
		targetWords:	{ type: String, required: true },
		synsetAlpha: 	{ type: Number, required: true },
		_validationTaskId: 	{ type: String }
	}))

const GlossModificationTask = Task.discriminator('GlossModificationTask',
	new mongoose.Schema({
		targetWords: 	{ type: String, required: true },
		translatedGlosses: 	[{ gloss: String }],
		_translationTaskId: 	{ type: String }
	}))

const GlossValidationTask = Task.discriminator('GlossValidationTask', 
	new mongoose.Schema({
		targetWords: 		{ type: String, required: true },
		modifiedGlosses: 		[{ gloss: String }],
		_modificationTaskId: 	{ type: String }
	}))

// Task table custom helper methods
module.exports.findBySettings = function(settings, callback) {
	const query = {}
	if (settings._id) 				query._id = settings._id
	if (settings.__v) 				query.__v = settings.__v
	if (settings.conceptId) 			query.conceptId = settings.conceptId
	if (settings.conceptGlobalId) 		query.conceptGlobalId = settings.conceptGlobalId
	if (settings.parentConceptId) 		query.parentConceptId = settings.parentConceptId
	if (settings.parentConceptGlobalId) 	query.parentConceptGlobalId = settings.parentConceptGlobalId
	if (settings.domainId) 				query.domainId = settings.domainId
	if (settings.taskType) 				query.taskType = settings.taskType
	if (settings.wordnetId) 			query.wordnetId = settings.wordnetId
	Task.find(query, callback)
}
