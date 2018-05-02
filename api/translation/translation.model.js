const mongoose 	= require('mongoose')
const meta = require('../../meta')

const TranslationSchema = mongoose.Schema({
      taskId:		{ type: String, required: true },
      domainId:		{ type: Number, required: true },
      translator:		{ type: String, required: true },
      translatorId:	{ type: String, required: true },
      skip:			{ type: Boolean, required: true, default: false },
      startDate:		{ type: Date, required: true },
      endDate:		{ type: Date, required: true },
      translationType: 	{ type: Number, required: true }
}, { discriminatorKey: 'translationType', timestamps: true })

const Translation = module.exports = mongoose.model('Translation', TranslationSchema)

const SynsetTranslation = Translation.discriminator(meta.runType.synset, new mongoose.Schema({
	translation:	[{ lemma: String, rating: Number }],
	gap:			{ type: Boolean, required: true, default: false },
    gapReason: 		{ type: String, default: null },
}))

const GlossTranslation = Translation.discriminator(meta.runType.gloss, new mongoose.Schema({
	translation: 	{ gloss: String, required: true }
}))

module.exports.findBySettings = function(settings, callback) {
	const query = {}
	if (settings._id) 				query._id = settings._id
	if (settings.__v) 				query.__v = settings.__v
	if (settings.taskId) 				query.taskId = settings.taskId
	if (settings.domainId) 				query.domainId = settings.domainId
	if (settings.translator) 			query.translator = settings.translator
	if (settings.translatorId) 			query.translatorId = settings.translatorId
	if (settings.gap) 				query.gap = settings.gap
	if (settings.skip) 				query.skip = settings.skip
	if (settings.startDate) 			query.startDate = settings.startDate
	if (settings.endDate) 				query.endDate = settings.endDate
	Translation.find(query, callback)
}
