const mongoose = require('mongoose')

const ModificationScheme = mongoose.Schema({
    taskId:         { type: String, required: true },
    domainId:       { type: Number, required: true },
    modifierId:     { type: String, required: true },
    modifier:       { type: String, required: true },
    modifiedWords:  [{ preWord: String, postWord: String }],
    gap:			{ type: Boolean, required: true, default: false },
    skip:			{ type: Boolean, required: true, default: false },
    startDate:		{ type: Date, required: true },
    endDate:		{ type: Date, required: true }
}, {timestamps: true})

const Modification = module.exports = mongoose.model('Modification', ModificationScheme)
