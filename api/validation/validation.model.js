const mongoose = require('mongoose')

const ValidationSchema = mongoose.Schema({
	taskId: 		{ type: String, required: true },
	domainId: 		{ type: Number, required: true },
	validatorId: 	{ type: String, required: true },
	validator: 		{ type: String, required: true },
	validations: 	[{ word: String, rating: Number }]
	gap: 			{ type: Boolean, required: true },
	skip: 			{ type: Boolean, required: true },
	startDate: 		{ type: Date, required: true },
	endDate: 		{ type: Date, required: true }
}, { timestamps: true })

const Validation = module.exports = mongoose.model('Validation', ValidationSchema)