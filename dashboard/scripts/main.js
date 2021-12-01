function updateConfig() {
	let request = new XMLHttpRequest()
	request.open('GET', 'http://localhost:3000/api/config')
	request.send()

	request.onload = err => {
		if (err) console.error(err)

		let Config = JSON.parse(request.response)

		document.getElementById('Token').value = Config.Token
		document.getElementById('Guild').value = Config.Guild
		document.getElementById('MuteRole').value = Config.MuteRole
	}
}

updateConfig()

function changeConfig(setting) {
	let value = document.getElementById(setting).value

	let request = new XMLHttpRequest()
	request.open('POST', `http://localhost:3000/api/config/${setting}/${value}`)
	request.send()

	request.onload = err => {
		if (err) console.error(err)
	}
}
