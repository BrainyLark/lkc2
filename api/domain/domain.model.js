const mongoose = require('mongoose')

const DomainSchema = mongoose.Schema({
    conceptId:  { type: Number, required: true, unique: true },
    posTag:     { type: String, required: false },
    synset:     [{ languageCode: String, vocabularyId: Number, concept: String, gloss: String, lemma: String }],
    globalId:   { type: Number, unique: true },
    availableTrn: { type: Number, required: false },
    availableMod: { type: Number, required: false },
    availableVal: { type: Number, required: false }
}, {timestamps: true})

const Domain = module.exports = mongoose.model('Domain', DomainSchema)

module.exports.insert = function(batch, callback) {
    Domain.collection.insert(batch, callback)
}
