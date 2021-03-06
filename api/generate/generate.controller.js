const DataStore		= require('../../service/DataAdapterPostgres')[0]
const Task 			= require('../task/task.model')
const TaskEventCount	= require('../taskEventCount/taskEventCount.model')
const handleError		= require('../../service/ErrorHandler')
const meta			= require('../../meta')

module.exports.index = function(req, res, next) {
	if (!req.query.hasOwnProperty('uk_id')) {
		res.status(400).json({message: "uk_id" + meta.msg.mn.generated.nodef})
	}
	let uk_id = req.query.uk_id
	let limit = parseInt(req.query.limit) || 10
	let initialLimit = limit
	DataStore.getConceptId(uk_id, function (conceptId) {
		DataStore.getAncestor(conceptId, function (ancestor) {
			if (ancestor.length == 0) ancestor.target = { id: conceptId, globalId: uk_id }
			generateTask({
				id: conceptId,
				globalId: uk_id
			}, {
				id: ancestor.target.id,
				globalId: ancestor.target.globalId,
			}, generateTaskEventCount)
		})
	})
	
	var generateTaskEventCount = function(data) {
		// console.log("generateTaskEventCount:")
		Task.find({ domainId: uk_id },(err, tasks) => {
			if (err) return handleError(res, err)
			var taskIdx = -1, n = tasks.length
			var generateTaskEventCountInterator = function(err, taskEventCount) {
				if (err) return handleError(res, err)
				taskIdx++
				if (taskIdx == n) return res.json(data)
				TaskEventCount.create({
					taskId: tasks[taskIdx]._id,
					taskType: 'SynsetTranslationTask',
					domainId: uk_id
				}, generateTaskEventCountInterator)
			}
			generateTaskEventCountInterator()
		})
	}
	var createTask = function(concept, parentConcept, createTaskIteratorCallback) {
		// console.log("createTask:", concept.target.id)
		Task.findOne({
			conceptId: concept.target.id,
			conceptGlobalId: concept.target.globalId,
			domainId: uk_id
		}, (err, task) => {
			if (task != null || err) return createTaskIteratorCallback(null, null)
			DataStore.getConcept(concept.target.id, function(err, child) {
				if (err) return createTaskIteratorCallback(null, null)
				// console.log("createTask:",child)
				Task.create({
					conceptId: child.conceptId,
					conceptGlobalId: child.globalId,
					posTag: child.posTag,
					synset: child.synset,
					parentConceptId: parentConcept.id,
					parentConceptGlobalId: parentConcept.globalId,
					domainId: uk_id,
					typeId: 1,
					taskType: 'SynsetTranslationTask',
					// wordnetId: child.wordnetId, // added during DataAdapterPostgres
				}, createTaskIteratorCallback)
			})
		})
	}
	var generateTask = function(
		concept, // {id: integer, globalId: integer}
		parentConcept, // { id: integer, globalId: integer, child: integer}
		generateTaskIteratorCallback) {
		// console.log("generateTask:",concept.id)
		DataStore.getDescendants(concept.id, function (descendants) {
			var childIdx = -1, n = descendants.length
			// console.log("concept\t",concept.id,"\tchilds\t",n,"\tcreated\t",initialLimit - limit)
			var generateTaskIterator = function(res) {
				childIdx++
				// console.log("generateTaskIterator:",childIdx)
				if (childIdx == n) return generateTaskIteratorCallback({ statusCode: 3, statusMsg: meta.msg.mn.generated.end + (initialLimit - limit) })
				if (res.statusCode == 1) return generateTaskIteratorCallback(res)
				generateTask({
					id: descendants[childIdx].target.id,
					globalId: descendants[childIdx].target.globalId
				}, {
					id: concept.id,
					globalId: concept.globalId
				}, generateTaskIterator)
			}
			var createTaskIterator = function(err, task) {				
				childIdx++
				
				if (err) handleError(res, err)
				if (task) {
					limit--
					if (limit <= 0) {
						// console.log("limit==0")
						return generateTaskIteratorCallback({ statusCode: 1, statusMsg: initialLimit + meta.msg.mn.generated.limit + (initialLimit - limit) })
					}
				}
				if (childIdx == n) {
					childIdx = -1
					return generateTaskIterator({ statusCode: 2, statusMsg: meta.msg.mn.generated.desc + (initialLimit - limit) })
				}
				createTask(descendants[childIdx], concept, createTaskIterator) 
			}
			createTaskIterator(null, null)
		})
	}
}
