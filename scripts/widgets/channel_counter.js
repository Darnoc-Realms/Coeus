const { client } = require(__dirname + '/../../index');

// axios for http requests
const axios = require('axios');

const {
	guild_id, channel_ids, roles, URLs,
} = require(__dirname + '/../../config.json'); // Load config into variables

// Updates a view-only channel to show the current number of members
function members() {
	client.guilds.cache.get(guild_id).members.fetch()
		.then(() => {
			const member_count = client.guilds.cache.get(guild_id).roles.cache.get(roles.member).members.size;
			client.channels.fetch(channel_ids.member_count)
				.then((channel) => {
					channel.setName(`Members: ${member_count}`);
				});
		});
}

// Updates a view-only channel to show the current number of ingame players
function ingame() {
	axios.get(URLs.dynmap_api)
		.then((data) => {
			const ingame_count = data.data.players.length;
			client.channels.fetch(channel_ids.ingame_count)
				.then((channel) => {
					channel.setName(`In-game: ${ingame_count}`);
				});
		});
}

module.exports = { members, ingame };