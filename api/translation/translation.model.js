const mongoose 	= require('mongoose')
const meta = require('../../meta')

var TranslationSchema = new mongoose.Schema({
      taskId:		{ type: String, required: true },
      domainId:		{ type: Number, required: true },
      translator:		{ type: String, required: true },
      translatorId:	{ type: String, required: true },
      skip:			{ type: Boolean, required: true, default: false },
      startDate:		{ type: Date, required: true },
      endDate:		{ type: Date, required: true },
}, { discriminatorKey: 'translationType', timestamps: true })

var Translation = module.exports = mongoose.model('Translation', TranslationSchema)

var SynsetTranslation = Translation.discriminator('SynsetTranslation', 
	new mongoose.Schema({
		translation:	[{ lemma: String, rating: Number }],
		gap:			{ type: Boolean, required: true, default: false },
    	gapReason: 		{ type: String, default: null }
	}))

var GlossTranslation = Translation.discriminator('GlossTranslation', 
	new mongoose.Schema({
		translation: 	{ type: String }
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
