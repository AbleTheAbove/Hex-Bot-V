async function updateConfig() {
	const Config = await (
		await fetch('http://localhost:2744/api/config', {
			method: 'GET'
		})
	).json()

	// General
	document.getElementById('token').value = Config.Token
	document.getElementById('guild').value = Config.Guild
	document.getElementById('tickets').value = Config.Ticket_Category
	document.getElementById('mongo').value = Config.MongoDB.Connect
	document.getElementById('blacklist').value = Config.Blacklist

	// Roles
	document.getElementById('mute').value = Config.MuteRole
	document.getElementById('staff').value = Config.Staff

	document.getElementById('gm').value = Config.Roles.Guild_Member
	document.getElementById('ally').value = Config.Roles.Ally

	document.getElementById('seperator').value = Config.Points.Seperator

	// Tryout Roles
	document.getElementById('ingame').value = Config.Roles.In_Game
	document.getElementById('interview').value = Config.Roles.Interview

	// In Game Roles

	document.getElementById('captain-role').value = Config.Points.Captain.role
	document.getElementById('elite-role').value = Config.Points.Elite.role
	document.getElementById('soldier-role').value = Config.Points.Soldier.role
	document.getElementById('recruit-role').value = Config.Points.Recruit.role

	document.getElementById('captain-req').value = Config.Points.Captain.req
	document.getElementById('elite-req').value = Config.Points.Elite.req
	document.getElementById('soldier-req').value = Config.Points.Soldier.req
	document.getElementById('recruit-req').value = Config.Points.Recruit.req
}

updateConfig()

async function saveConfig() {
	let getSetting = setting => document.getElementById(setting).value

	let newConfig = {
		MuteRole: getSetting('mute'),
		Token: getSetting('token'),
		Guild: getSetting('guild'),

		MongoDB: {
			Connect: getSetting('mongo')
		},

		Points: {
			Recruit: {
				req: getSetting('recruit-req'),
				role: getSetting('recruit-role')
			},
			Soldier: {
				req: getSetting('soldier-req'),
				role: getSetting('soldier-role')
			},
			Elite: {
				req: getSetting('elite-req'),
				role: getSetting('elite-role')
			},
			Captain: {
				req: getSetting('captain-req'),
				role: getSetting('captain-role')
			},
			Seperator: getSetting('seperator')
		},

		Roles: {
			Guild_Member: getSetting('gm'),
			Ally: getSetting('ally'),
			In_Game: getSetting('ingame'),
			Interview: getSetting('interview')
		},

		Blacklist: getSetting('blacklist').split(',')
	}

	await fetch('http://localhost:2744/api/config', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newConfig)
	})
}
