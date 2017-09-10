const pgp = require('pg-promise')(/*options*/);
const db = pgp('postgres://postgres:1234@localhost:5432/lkc2');

const unique_beginners_uk_ids = [
      161, 119, 124, 129, 15355, 127, 145, 138, 131, 123, 40, 132, 83505, 121, 61558, 118, 120, 143, 139, 28162, 142, 133, 130, 122, 134
];


module.exports.getUniqueBeginners = function(callback){
      db.many('select c.label as label, c.uk_id as uk_id, s.gloss as gloss from concepts c, vocabulary_synsets s where vocabulary_id = 1 and c.uk_id in ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) and s.concept_id = c.id', unique_beginners_uk_ids)
      .then(function(data){
            callback(null, data);
      }).catch(function(err){
            callback(err, null);
            console.log(err);
      });
}
