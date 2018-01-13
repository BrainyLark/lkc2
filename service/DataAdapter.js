'use strict'

const request = require('request')
const cookie = require('../config').cookie
const languageCodes = require('../meta').languageCodes

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
	const apiHeader = {
		'Cookie': cookie,
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'Connection': 'keep-alive',
		'Cache-Control': 'max-age=0'
	}
	var synset = []
	var counter = 0
	languageCodes.forEach(code => {
		let urlString = "https://lkc.disi.unitn.it/mongolian/lkcApp/concepts/byid/" + conceptId + "/" + code
		var cb = (err, response, body) => {
			if (!err && response.statusCode == 200) {
				let doc = JSON.parse(body)
				if (doc.synset) {
					let lemma = ''
					for (let w = 0; w < doc.synset.length; w++) {
						if (w > 0) lemma += ', '
						lemma += doc.synset[w].word.lemma
					}
					synset.push({
						languageCode: code,
						vocabularyId: doc.synset[0].vocabularyId,
						concept: doc.concept,
						gloss: doc.gloss,
						lemma: lemma
					})
				}
				counter++
				if (counter >= languageCodes.length) {
					let responseData = {
						conceptId: doc.conceptId,
						posTag: doc.posTag,
						globalId: doc.globalId,
						synset: synset
					}
					callback(null, responseData)
				}
			}
		}
		request({ url: urlString, headers: apiHeader }, cb)
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
						posTag: data.posTag,
						synset: data.synset,
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
