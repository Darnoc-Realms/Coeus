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
			'prefix': '!',
			'training': {
			    'waiting_period_milliseconds': 60000,
			},
			'guild_id': '',
			'bot_token': '',
			'channel_ids': {
				'member_count': '',
				'ingame_count': '',
				'user_log': '',
			},
			'roles': {
				'member': '',
			},
			'data_files': {
				'players': '',
			},
		};

		const data = JSON.stringify(example_config, null, 2);
		fs.appendFileSync(__dirname + '/../../config.json', data);
		console.log('I just created a new config.json file. Fill it out before starting again!');
	}
}

module.exports = { check_config };