'use strict';

const pgp = require('pg-promise')(/*options*/)
const lkc2DataDump = pgp('postgres://postgres:1234@localhost:5432/lkc2')
const request = require('request')

function getConceptId(uk_id, callback) {
	var conceptRequest = "http://ui.disi.unitn.it:80/lkc/mongolian-api/concepts?knowledgeBase=1&globalId="+uk_id+"&considerTokens=false&excludeFirstToken=false&includeTimestamps=false&includeRelationsCount=false"
	request.get(conceptRequest, function(err, response, body) {
		if(!err && response.statusCode == 200) {
			callback(JSON.parse(body)[0].id)
		}
	})
}
function getAncestor(conceptId, callback) {
	var queryString = "http://ui.disi.unitn.it:80/lkc/mongolian-api/concepts/"+conceptId+"/ancestors?pageIndex=1&pageSize=50&maxDepth=1&includeTimestamps=false&includeRelationsCount=false"
	request.get(queryString, function(err, response, body) {
		if(!err && response.statusCode == 200) {
			callback(JSON.parse(body)[0])
		}
	})
}
function getDescendants(conceptId, callback) {
	var queryString = "http://ui.disi.unitn.it:80/lkc/mongolian-api/concepts/"+conceptId+"/descendants?pageIndex=1&pageSize=50&maxDepth=1&includeTimestamps=false&includeRelationsCount=false"
	request.get(queryString, function(err, response, body) {
		if(!err && response.statusCode == 200) {
			callback(JSON.parse(body))
		}
	})
}
function getChildCount(conceptId, callback) {
	var queryString = "http://ui.disi.unitn.it:80/lkc/mongolian-api/concepts/"+conceptId+"/descendants/count?maxDepth=1"
	request.get(queryString, function(err, response, body) {
		if(!err && response.statusCode == 200) {
			callback(body)
		}
	})
}
function getConcept(conceptId, callback) {
	var queryString = "https://lkc.disi.unitn.it/mongolian/lkcApp/concepts/byid/" + conceptId + "/en"
	request({url: queryString, headers: {
		'Cookie': 'connect.sid=s%3AjG4eVi_V7YNQMj_LFQMDz3Y5q0fuzTHJ.g6MT0zXceYI8izWNuXkhaFYdeI6frlo9SwlP1WMAhZY',
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'Connection': 'keep-alive',
		'Cache-Control': 'max-age=0'
	}}, function(err, response, body) {
		if(!err && response.statusCode == 200) {
			callback(err, JSON.parse(body))
		}
	})
}

function getUniqueBeginners(unique_beginners_uk_ids, callback) {
	lkc2DataDump.many('select c.label as label, c.uk_id as uk_id, s.gloss as gloss from concepts c, vocabulary_synsets s where vocabulary_id = 1 and c.uk_id in ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) and s.concept_id = c.id', unique_beginners_uk_ids)
	.then(function(data) {
		callback(null, data)
	}).catch(function(err) {
		callback(err, null)
		console.log(err)
	})
}


var dataSources = [{
	getConceptId: getConceptId,
	getDescendants: getDescendants,
	getAncestor: getAncestor,
	getChildCount: getChildCount,
	getConcept: getConcept,
	getUniqueBeginners: getUniqueBeginners
}]

module.exports = dataSources