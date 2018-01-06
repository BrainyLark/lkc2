const DataStore			= require('../../service/DataAdapter')[0]
const Task 				= require('../task/task.model')
const TaskEventCount	= require('../taskEventCount/taskEventCount.model')
const handleError		= require('../../service/ErrorHandler')

module.exports.index = function(req, res, next) {
	if (!req.query.hasOwnProperty('uk_id')) {
		res.status(400).json({message: 'uk_id should be defined'})
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
		Task.find({},(err, tasks) => {
			if (err) return handleError(res, err)
			var taskIdx = -1, n = tasks.length
			var generateTaskEventCountInterator = function(err, taskEventCount) {
				if (err) return handleError(res, err)
				taskIdx++
				if (taskIdx == n) return res.json(data)
				TaskEventCount.create({
					taskId: tasks[taskIdx]._id,
					taskType: 1,
					domainId: uk_id
				}, generateTaskEventCountInterator)
			}
			generateTaskEventCountInterator()
		})
	}
	var createTask = function(concept, parentConcept, createTaskIteratorCallback) {
		Task.findOne({
			conceptId: concept.target.id,
			conceptGlobalId: concept.target.globalId,
			domainId: uk_id
		}, (err, task) => {
			if (task != null || err) return createTaskIteratorCallback(null, null)
			DataStore.getConcept(concept.target.id, function(err, child) {
				if (err) return createTaskIteratorCallback(null, null)
				let lemma = ""
				for (let i = 0; i < child.synset.length; i++) {
					if (i) lemma += ", "
					lemma += child.synset[i].word.lemma
				}
				Task.create({
					label: child.concept,
					gloss: child.gloss,
					conceptId: child.conceptId,
					conceptGlobalId: child.globalId,
					parentConceptId: parentConcept.id,
					parentConceptGlobalId: parentConcept.globalId,
					lemma: lemma,
					domainId: uk_id,
					typeId: 1,
					taskType: 1,
					wordnetId: -1
				}, createTaskIteratorCallback)
			})
		})
	}
	var generateTask = function(
		concept, // {id: integer, globalId: integer}
		parentConcept, // { id: integer, globalId: integer, child: integer}
		generateTaskIteratorCallback) {
		DataStore.getDescendants(concept.id, function (descendants) {
			var childIdx = -1, n = descendants.length
			var generateTaskIterator = function(res) {
				childIdx++
				if (childIdx == n) return generateTaskIteratorCallback({ statusCode: 3, statusMsg: 'This domain has been fully exhausted. Created: ' + (initialLimit - limit) + ' tasks.' })
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
					if (limit == 0) {
						return generateTaskIteratorCallback({ statusCode: 1, statusMsg: initialLimit + ' limit reached. Created: ' + (initialLimit - limit) })
					}
				}
				if (childIdx == n) {
					childIdx = -1
					return generateTaskIterator({ statusCode: 2, statusMsg: 'all descendant\'s created. Move on to the next child. Created: ' + (initialLimit - limit) })
				}
				createTask(descendants[childIdx], concept, createTaskIterator)
			}
			createTaskIterator(null, null)
		})
	}
}
