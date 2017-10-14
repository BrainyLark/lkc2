'use strict';

var DataStore 	= require('../adapter/DataAdapter')[0]
var Task 		= require('../models/task')
var Promise		= require('bluebird')

const unique_beginners_uk_ids = [
161, 119, 124, 129, 15355, 127, 145, 138, 131, 123, 40, 132, 83505, 121, 61558, 118, 120, 143, 139, 28162, 142, 133, 130, 122, 134
];

module.exports.getUniqueBeginners = function (callback) {
	DataStore.getUniqueBeginners(unique_beginners_uk_ids, function (err, data) {
		if (err) throw err;
		callback(err, data)
	})
}

module.exports.getTask = function (taskId, callback) {
	Task.find(taskId, callback)
}


module.exports.generate = function(uk_id, offset, limit, callback) {
	var returnValue = { created: -1 }; // returns the specific location where the script ended {last processed uk_id, which child}
	Task.create(); //creates the tasks table; but won't create a new table if the table is already created
	DataStore.getConceptId(uk_id, function (conceptId) {
		DataStore.getAncestor(conceptId, function (ancestor) {
			if (ancestor.length == 0) ancestor.target = { id: conceptId, globalId: uk_id };
			generateTask({
				id: conceptId,
				globalId: uk_id
			}, {
				id: ancestor.target.id,
				globalId: ancestor.target.globalId,
			});
		})
	});
	let initialLimit = limit;
	function _return(err, concept, parentConcept) {
		if (returnValue.created == -1) {
			returnValue.created = initialLimit - limit;
			callback(null, returnValue);
		}
	}
	function generateTask(
		concept, // {id: integer, globalId: integer}
		parentConcept // { id: integer, globalId: integer, child: integer}
		) {
		if (limit <= 0 || !(returnValue.created == -1)) {
			return _return(null, concept, parentConcept);
		}
		DataStore.getDescendants(concept.id, function (descendants) {
			let childCount = descendants.length;
			let promises = []
			for (let i = 0; i < childCount; i++) {
				if (limit == 0 || !(returnValue.created == -1))
					return _return(null, concept, { child: i });
				offset--;
				if (offset < 0) {
					limit--;
					promises.push(DataStore.getConcept(descendants[i].target.id, function(err, child) {
						if (err) return _return(err, concept, parentConcept);
						createTask(child, concept)
					}))
				}
			}
			Promise.all(promises).then(function() {
				for (let i = 0; i < childCount; i++)
					generateTask({
						id: descendants[i].target.id,
						globalId: descendants[i].target.globalId
					}, {
						id: concept.id,
						globalId: concept.globalId
					})
			})
		});
	}
	function createTask (concept, parentConcept) {
		let lemma = "";
		for (let i = 0; i < concept.synset.length; i++) {
			if (i) lemma += ", ";
			lemma += concept.synset[i].word.lemma;
		}
		Task.add({
			label: concept.concept,
			gloss: concept.gloss,
			conceptId: concept.conceptId,
			conceptGlobalId: concept.globalId,
			parentConceptId: parentConcept.id,
			parentConceptGlobalId: parentConcept.globalId,
			lemma: lemma,
			domainId: uk_id,
			typeId: 1,
			wordnetId: -1
		})
	}
}