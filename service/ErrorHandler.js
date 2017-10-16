module.exports = function(res, err) {
	res.status(500).json(err)
}

module.exports.notFound = function(res) {
	res.status(404).json({ statusCode: 404, statusMsg: 'Not found dude' })
}