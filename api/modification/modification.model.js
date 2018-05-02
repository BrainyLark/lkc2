const mongoose = require('mongoose')
const meta = require('../../meta')

const ModificationSchema = mongoose.Schema({
    taskId:             { type: String, required: true },
    domainId:           { type: Number, required: true },
    modifierId:         { type: String, required: true },
    modifier:           { type: String, required: true },
    skip:               { type: Boolean, required: true, default: false },
    startDate:          { type: Date, required: true },
    endDate:            { type: Date, required: true },
    modificationType:   { type: Number, required: true }
}, {discriminatorKey: 'modificationType', timestamps: true})

const Modification = module.exports = mongoose.model('Modification', ModificationSchema)

const SynsetModification = Modification.discriminator('SynsetModification', new mongoose.Schema({
    modification:      [{ preWord: String, postWord: String }],
    gap:                { type: Boolean, required: true, default: false },
    gapReason:          { type: String, default: null }
}))

const GlossModification = Modification.discriminator('GlossModification', new mongoose.Schema({
    modification:      { type: String }
}))