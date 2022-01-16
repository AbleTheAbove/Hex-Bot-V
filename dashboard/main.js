async function checkStatus() {
	const state = await fetch(
		'http://dbhb-gbn-01.chaoticdestiny.host:2744/api/status'
	)

	const indicator = document.getElementById('status')

	if (state.ok) indicator.style.backgroundColor = 'lime'
	else indicator.style.backgroundColor = 'red'
}

setInterval(checkStatus(), 5000)

async function updateConfig(section) {
	const Config = await (
		await fetch('http://dbhb-gbn-01.chaoticdestiny.host:2744/api/config', {
			method: 'GET'
		})
	).json()

	switch (section) {
		case 'tryoutroles':
			document.getElementById('ingame').value = Config.Roles.In_Game
			document.getElementById('interview').value = Config.Roles.Interview
			break
		case 'general':
			document.getElementById('token').value = Config.Token
			document.getElementById('guild').value = Config.Guild
			document.getElementById('tickets').value = Config.Ticket_Category
			document.getElementById('mongo').value = Config.MongoDB.Connect
			document.getElementById('blacklist').value = Config.Blacklist
			break
		case 'ingame':
			document.getElementById('captain-role').value =
				Config.Points.Captain.role
			document.getElementById('elite-role').value =
				Config.Points.Elite.role
			document.getElementById('soldier-role').value =
				Config.Points.Soldier.role
			document.getElementById('recruit-role').value =
				Config.Points.Recruit.role

			document.getElementById('captain-req').value =
				Config.Points.Captain.req
			document.getElementById('elite-req').value = Config.Points.Elite.req
			document.getElementById('soldier-req').value =
				Config.Points.Soldier.req
			document.getElementById('recruit-req').value =
				Config.Points.Recruit.req
			break
		case 'discordroles':
			document.getElementById('mute').value = Config.MuteRole
			document.getElementById('staff').value = Config.Staff

			document.getElementById('gm').value = Config.Roles.Guild_Member
			document.getElementById('ally').value = Config.Roles.Ally

			document.getElementById('seperator').value = Config.Points.Seperator
			break
	}
}

async function saveConfig(section) {
	let getSetting = setting => document.getElementById(setting).value

	let newConfig = await (
		await fetch('http://dbhb-gbn-01.chaoticdestiny.host:2744/api/config', {
			method: 'GET'
		})
	).json()

	switch (section) {
		case 'general':
			newConfig.Token = getSetting('token')
			newConfig.Guild = getSetting('guild')
			newConfig.Ticket_Category = getSetting('tickets')
			newConfig.MongoDB.Connect = getSetting('mongo')
			newConfig.Blacklist = getSetting('blacklist').split(',')
			break
		case 'ingame':
			newConfig.Points.Captain.role = getSetting('captain-role')
			newConfig.Points.Captain.req = getSetting('captain-req')

			newConfig.Points.Elite.role = getSetting('elite-role')
			newConfig.Points.Elite.req = getSetting('elite-req')

			newConfig.Points.Soldier.role = getSetting('soldier-role')
			newConfig.Points.Soldier.req = getSetting('soldier-role')

			newConfig.Points.Recruit.role = getSetting('recruit-role')
			newConfig.Points.Recruit.req = getSetting('recruit-req')
			break
		case 'discordroles':
			newConfig.MuteRole = getSetting('mute')
			newConfig.Staff = getSetting('staff')

			newConfig.Roles.Guild_Member = getSetting('gm')
			newConfig.Roles.Ally = getSetting('ally')

			newConfig.Roles.Points.Seperator = getSetting('seperator')
			break
		case 'tryoutroles':
			newConfig.Roles.In_Game = getSetting('ingame')
			newConfig.Roles.Interview = getSetting('interview')
			break
	}

	await fetch('http://dbhb-gbn-01.chaoticdestiny.host:2744/api/config', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newConfig)
	})

	let title = document.getElementById('title')

	title.classList.add('lime')
	setTimeout(() => title.classList.remove('lime'), 1000)
}
