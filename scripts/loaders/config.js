// File system module
const fs = require('fs');

function check_config() {
	if (fs.existsSync(__dirname + '/../../config.json')) {

		// Config file exists, proceed
		console.log('Config file exists!');
		return true;

	}
	else {

		// Config file is missing, create a new one and stop
		const example_config = {
			prefix: '!',
			guild_id: '',
			bot_token: '',
			channel_ids: {
				member_count: '',
				ingame_count: '',
				user_log: '',
			},
			roles: {
				member: '',
			},
			data_files: {
				players: '',
			},
			URLs: {
				dynmap_api: '',
			},
			training: {
			    waiting_period: 60000,
			},
			refresh_speed: {
				instant: 60000,
				medium: 360000,
				slow: 86400000,
			},
		};

		const data = JSON.stringify(example_config, null, 2);
		fs.appendFileSync(__dirname + '/../../config.json', data);
		console.log('I just created a new config.json file. Fill it out before starting again!');
	}
}

module.exports = { check_config };