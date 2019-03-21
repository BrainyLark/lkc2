'use strict'
/*
This data adapter retrieves concepts and synsets from UKC database dump in PostgreSQL 
*/
const request = require('request')
const cookie = require('../config').cookie
const pgDatabase = require('../config').pgDatabase
const languageCodes = require('../meta').languageCodes

const {Client} = require('pg')

var client = new Client({
	user: pgDatabase.PGUSER,
	host: pgDatabase.PGHOST,
	database: pgDatabase.PGDATABASE,
	password: pgDatabase.PGPASSWORD,
	port: pgDatabase.PGPORT,
  })

// make connection for all subsequent queries
client.connect((err) => {
	if (err) {
		console.error('connection error', err.stack)
	}
})

function getConceptId(uk_id, callback) {
	// console.log("getConceptId:",uk_id)
	let query = "select * from concepts	where uk_id = $1"
	client.query(query, [uk_id], (err, res) => {
		if (err) {
			console.error('Error executing query', err.stack)
			callback(-1)
		}
		var id = res.rows[0].id
		//client.end()
		callback(id)
	})

}
function getAncestor(conceptId, callback) {
	var ancestor = {length: 0}
	callback(ancestor);
}
function getDescendants(conceptId, callback) {
	var data = []
	// console.log("conceptId:",conceptId)
	let query = "select * from descendant where parent_con_id = $1 and relation_type=20" //only hyponyms
	client.query(query, [conceptId], (err, res) => {
		if (err) {
			callback([])
			return console.error('Error executing query', err.stack)
		}
		res.rows.forEach(row => {
			data.push({target:{id:row.child_con_id, globalId:row.child_uk_id}})
			// console.log(row.child_con_id, row.parent_label, row.child_uk_id, row.child_label)
		})
		// console.log("length:", data.length) 
		callback(data)
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
async function getConceptResult(conceptId){
	let synsets = [];
	let langs = "'"+languageCodes.join().replace(/,/g, "','")+"'"
	let query = "select * from synsets_view where con_id = $1 and language_code in ("+langs+")"
	let res = await client.query(query, [conceptId])
	// building synsets
	res.rows.forEach(row => {
		synsets.push({
			languageCode: row.language_code,
			vocabularyId: row.voc_id,
			concept: row.con_id,
			gloss: row.gloss,
			lemma: row.lemmas,
			examples: []
		})
	});
	// getting synset examples
	query = "select * from synset_examples where con_id = $1 and language_code in ("+langs+")"
	let examples = await client.query(query, [conceptId])
	examples.rows.forEach(row => {
		// pushing example sentences into synsets
		var idx = synsets.findIndex(syn => syn.languageCode == row.language_code)
		synsets[idx].examples.push(row.sentence)
	});
	// setting up concept
	let conceptData = {
		conceptId: res.rows[0].con_id,
		posTag: res.rows[0].pos,
		globalId: res.rows[0].uk_id,
		// wordnetId: res.rows[0].wn_id,
		synset: synsets
	}
	return conceptData;
}
function getConcept(conceptId, callback) {
	getConceptResult(conceptId).then(conceptData => {
		// console.log(conceptData);
		callback(null, conceptData);
	}).catch(err => {
		console.error(err);
		callback(-1, null)
	});
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
