const mongoose = require('mongoose')

const DomainSchema = mongoose.Schema({
    conceptId:     {type: Number, required: true, unique: true},
    concept:  {type: String, required: true},
    gloss:  {type: String, required: true},
    globalId:  {type: Number, unique: true}
}, {timestamps: true})

const Domain = module.exports = mongoose.model('Domain', DomainSchema)

module.exports.insert = function(batch, callback) {
    Domain.collection.insert(batch, callback)
}
