const mongoose = require('mongoose')
const meta = require('../../meta')

const ValidationSchema = mongoose.Schema({
	taskId: 		{ type: String, required: true },
	domainId: 		{ type: Number, required: true },
	validatorId: 	{ type: String, required: true },
	validator: 		{ type: String, required: true },
	skip: 			{ type: Boolean, required: true, default: false },
	startDate: 		{ type: Date, required: true },
	endDate: 		{ type: Date, required: true },
	validationType:	{ type: String, required: true },
}, { discriminatorKey: 'validationType', timestamps: true })

const Validation = module.exports = mongoose.model('Validation', ValidationSchema)

const SynsetValidation = Validation.discriminator('SynsetValidation', new mongoose.Schema({
	validations: 	[{ word: String, rating: Number }],
	gap: 			{ type: Boolean, required: true, default: false },
	gapReason: 		{ type: String, default: null },
}))

const GlossValidation = Validation.discriminator('GlossValidation', new mongoose.Schema({
	validations:	[{ priority: Number, gloss: String, _id: Number }]
}))