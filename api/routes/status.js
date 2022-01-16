module.exports = app =>
	app.get('/api/status', (req, res) => {
		res.send(true)
	})
