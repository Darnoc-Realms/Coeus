const {
	guild_id, channel_ids, roles, URLs, refresh_speed,
} = require(__dirname + '/../../config.json'); // Load config into variables

// update channel counts
const channel_counter = require(__dirname + '/../widgets/channel_counter');

client.setInterval(() => {
	// Update channel counters
	channel_counter.members();
	channel_counter.ingame();
}, refresh_speed.medium);