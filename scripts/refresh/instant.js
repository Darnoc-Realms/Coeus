// become member switch
const { client } = require(__dirname + '/../../index');

/*

// check for players that have become members after waiting every 1 minute
client.setInterval(() => {
	fs.readFile(data_files.players, (err, data) => {
		data = JSON.parse(data);
		// const pos = data.map(function(e) { return e.discord_id; }).indexOf(message.author.id);
		// loop through each player
		data.forEach(function(player, index) {
			// check is player is not a member already, on the last step of flow, is not banned, and has waited long enough
			if (player.member_date == '' && player.tutorial_progress == flow.length - 1 && player.banned == null && waiting_period_milliseconds - (Date.now() - player.join_date < 0)) {
				// add member role
				change_role(player.discord_id, roles.member, true);

				// assign timestamp to when became member
				data[index].member_date = Date.now();

				// fetch member so it can use their picture
				client.guilds.cache.get(guild_id).members.fetch(player.discord_id)
					.then(member => {
						// send annoucement
						const message_embed = new Discord.MessageEmbed()
							.setColor('#363fed')
							.setAuthor(`Congrats ${member.displayName}`, member.user.displayAvatarURL())
							.setFooter(`You are now a member after waiting ${timeConversion(waiting_period_milliseconds)}`)
							.setTimestamp();

						client.guilds.cache.get(guild_id).channels.cache.get(channel_ids.user_log).send(message_embed);
					});

				// write changes to players database
				fs.writeFile(data_files.players, JSON.stringify(data, null, 2), function writeJSON(err) { if (err) return console.log(err); });
			}
		});
	});
}, 10000);

*/