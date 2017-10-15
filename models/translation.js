const mongoose = require('mongoose');
const config = require('../config/database');

const TranslationSchema = mongoose.Schema({
      translator: {
            type: String
      },
      translation: [{lemma: String, rating: Number }],
      start_date: {
            type: Date
      },
      end_date: {
            type: Date
      }
});

const Translation = module.exports = mongoose.model('Translation', TranslationSchema);

module.exports.addTranslation = function(newTranslation, callback) {
      newTranslation.save(callback);
}
