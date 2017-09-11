const pgp = require('pg-promise')(/*options*/);
const db = pgp('postgres://postgres:1234@localhost:5432/lkc2');
const request = require('request');

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

function getConceptId(uk_id, callback){
      var conceptRequest = "http://ui.disi.unitn.it:80/lkc/mongolian-api/concepts?knowledgeBase=1&globalId="+uk_id+"&considerTokens=false&excludeFirstToken=false&includeTimestamps=false&includeRelationsCount=false";
      request.get(conceptRequest, function(err, response, body){
            if(!err && response.statusCode == 200){
                  callback(JSON.parse(body)[0].id);
            }
      });
}

function getCount(conceptId, callback){
      var queryString = "http://ui.disi.unitn.it:80/lkc/mongolian-api/concepts/"+conceptId+"/descendants/count?maxDepth=1";
      request.get(queryString, function(err, response, body){
            if(!err && response.statusCode == 200){
                  callback(body);
            }
      });
}

function getChildrenCount(uk_id, callback){
      getConceptId(uk_id, function(conceptId){
            getCount(conceptId, function(count){
                  count = parseInt(count, 10);
                  callback(conceptId, count);
            });
      });
}

function getDescendants(conceptId, callback){
      var queryString = "http://ui.disi.unitn.it:80/lkc/mongolian-api/concepts/"+conceptId+"/descendants?pageIndex=1&pageSize=50&maxDepth=1&includeTimestamps=false&includeRelationsCount=false";
      request.get(queryString, function(err, response, body){
            if(!err && response.statusCode == 200){
                  callback(JSON.parse(body));
            }
      });
}

module.exports.allocateTask = function(username, globalId, callback){
      getChildrenCount(globalId, function(conceptId, childCount){
            getDescendants(conceptId, function(descendants){
                  for(var i = 0; i<childCount; i++){
                        console.log(descendants[i].target.id);
                  }
            });
      });
}
