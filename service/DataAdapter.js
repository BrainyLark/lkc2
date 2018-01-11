'use strict'

const request = require('request')
const cookie = require('../config').cookie

function getConceptId(uk_id, callback) {
	var conceptRequest = "http://ui.disi.unitn.it:80/lkc/mongolian-api/concepts?knowledgeBase=1&globalId="+uk_id+"&considerTokens=false&excludeFirstToken=false&includeTimestamps=false&includeRelationsCount=false"
	request.get(conceptRequest, function(err, response, body) {
		if(!err && response.statusCode == 200) {
			try {
				var id = JSON.parse(body)[0].id
				callback(id)
			}
			catch (e) {
				console.log('Couldn\'t find concept with globalId = ' + uk_id + ' from API. Returning negative code!')
				callback(-1)
			}
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
			var data = []
			try { data = JSON.parse(body) }
			catch(e) {
				console.log('Getting descendants of  ' + conceptId + ' has failed. The API didn\'t return a json object. Assuming it has no descendants')
				callback([])
				return
			}
			callback(data)
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
		'Cookie': cookie,
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'Connection': 'keep-alive',
		'Cache-Control': 'max-age=0'
	}}, function(err, response, body) {
		if(!err && response.statusCode == 200) {
			callback(err, JSON.parse(body))
		}
	})
}

function getUniqueBeginners(uids, callback) {
	var ubconcepts = []
	let cnt = 0, n = uids.length
	uids.forEach(uid => {
		getConceptId(uid, function(id) {
			if (id != -1) {
				getConcept(id, function(err, data) {
					if (err) throw err
					let filtered = {
						conceptId: data.conceptId,
						concept: data.concept,
						gloss: data.gloss,
						globalId: data.globalId
					}
					ubconcepts.push(filtered)
					cnt ++
					if (cnt >= n) callback(null, ubconcepts)
				})
			}
		})
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
