const {
	guild_id, channel_ids, roles, URLs, refresh_speed,
} = require(__dirname + '/../../config.json'); // Load config into variables

// axios for http requests
const axios = require('axios');


// check for mc username changes and change nicknames
client.setInterval(() => {
	console.log('Would be checking mojang api');
}, refresh_speed.slow);