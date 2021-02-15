/*

THIS WILL BECOME THE NEW USER DM PARSING AND RESPONSE FILE

*/


// Require the discord.js module
const Discord = require('discord.js');

// fs & path
const fs = require('fs');

// axios for HTTP requests
const axios = require('axios');

// Create a new Discord client
const client = new Discord.Client();

// Import config.json
const
	prefix, guild_id, channel_ids, roles, data_files, waiting_period_milliseconds, bot_token,
} = require('./config.json');

// Import external functions
const { change_role } = require('./functions');

// Import flow (direct messages) data
const flow = require(data_files.flow);

// Get token from .env and login
const dotenv = require('dotenv');
dotenv.config();
client.login(bot_token);

// Make sure player's file isn't empty because weird errors will happen
fs.readFile(data_files.players, (err, data) => {
	if (data == '[]' || data == '' || data == '{}') {
		data = [
			{ blank:0 },
		];
		fs.writeFile(data_files.players, JSON.stringify(data, null, 2), function writeJSON(err) { if (err) return console.log(err); });
	}
});

// Executes when the client is ready
client.once('ready', () => {
	console.log('Ready to start welcoming members!');

	update_member_count();

	client.user.setActivity('for new members', { type: 'WATCHING' });
	client.user.setStatus('online');
});

// Executes when a message has been send
client.on('message', message => {
	// Make sure the message is in a DM
	if (message.channel.type == 'dm') {
		fs.readFile(data_files.players, (err, data) => {
			data = JSON.parse(data);
			const pos = data.map(function(e) { return e.discord_id; }).indexOf(message.author.id);
			// Make sure player is in the database
			if (data[pos]) {
				// Check if not on step 5 and message has next step trigger (? what)
				// Please explain these commands more I don't understand any of this magic
				if (data[pos].tutorial_progress != 5 && data[pos].tutorial_progress != flow.length - 1 && message.content == flow[data[pos].tutorial_progress + 1].trigger) {
					// Progress flow by one
					data[pos].tutorial_progress++;
					fs.writeFile(data_files.players, JSON.stringify(data, null, 2), function writeJSON(err) { if (err) return console.log(err); });
					// Send of now current step
					message.channel.send(flow[data[pos].tutorial_progress].message.content);
					// Send any embeds if present
					if (flow[data[pos].tutorial_progress].message.embeds) {
						// Loop through embeds, adding eact attribute of present, and send
						flow[data[pos].tutorial_progress].message.embeds.forEach(function(embed) {

							const message_embed = new Discord.MessageEmbed();
							if (embed.color) { message_embed.setColor(embed.color); }
							if (embed.title) { message_embed.setTitle(embed.title); }
							if (embed.url) { message_embed.setURL(embed.url); }
							if (embed.description) { message_embed.setDescription(embed.description); }
							if (embed.thumbnail) { message_embed.setThumbnail(embed.thumbnail); }
							if (embed.image) { message_embed.setImage(embed.image); }
							if (embed.footer) { message_embed.setFooter(embed.footer.text, embed.footer.icon_url); }

							message.channel.send(message_embed);
						});
					}
				}
				// Check if step is 5 (the crucial minecraft username step)
				else if (data[pos].tutorial_progress == 5) {
					// Check if varifying message
					if (message.content == 'yes') {
						message.channel.messages.fetch({ limit: 4 })
						  .then(messages => {
								// Make sure user didn't respond "yes" to an error or initial message
								if (messages.last().content != '' && messages.last().content != 'yes' && messages.last().content != 'okay' && messages.last().content.startsWith('Uh oh! "') == false && messages.last().content.startsWith('Is this you? ') == false) {
									const mc_username_lookup = messages.last().content;
									axios.get('https://api.mojang.com/users/profiles/minecraft/' + mc_username_lookup)
										.then(response => {
											if (mc_username_lookup == response.data.name) {
												data[pos].mc_uuid = response.data.id;
												data[pos].name = response.data.name;
												data[pos].tutorial_progress++;
												fs.writeFile(data_files.players, JSON.stringify(data, null, 2), function writeJSON(err) { if (err) return console.log(err); });
												message.channel.send(flow[data[pos].tutorial_progress].message);
											}
											else {
									    throw 'API error';
											}
										})
										.catch(error => {
											message.channel.send(`Uh oh! "${mc_username_lookup}" doesn't seem to be a valid username. Try typing **just** your username again with no spaces. Capitalization does matter.`);
										});
								}
							})
						  .catch(console.error);
					}
					else {
						message.channel.send('Is this you? Type `yes` to continue or type another username to try again.');

						// Embed fetched user
						const minecraft_user_embed = new Discord.MessageEmbed()
							.setColor('#10a300')
							.setTitle(message.content)
							.setURL('https://namemc.com/profile/' + message.content)
							.setImage('https://mc-heads.net/body/' + message.content);

						message.channel.send(minecraft_user_embed);
					}
				}
				// Check if on last step
				else if (data[pos].tutorial_progress == flow.length - 1) {
					// Send a message with the user's remaining time
					const time_left = timeConversion(waiting_period_milliseconds - (Date.now() - data[pos].join_date));
					const message_embed = new Discord.MessageEmbed()
						.setColor('#d6914d')
						.setAuthor(`⏳ You have ${time_left} left`);

					message.channel.send(message_embed);
				}
			}
		});
	}
});

// Check for players that have become members after waiting every 1 minute
client.setInterval(() => {
	fs.readFile(data_files.players, (err, data) => {
		data = JSON.parse(data);
		// Commented out code. Please fix.
		// const pos = data.map(function(e) { return e.discord_id; }).indexOf(message.author.id);
		// Loop through each player
		data.forEach(function(player, index) {
			// Check is player is not a member already, on the last step of flow, is not banned, and has waited long enough
			if (player.member_date == '' && player.tutorial_progress == flow.length - 1 && player.banned == null && waiting_period_milliseconds - (Date.now() - player.join_date < 0)) {
				// Add member role
				change_role(player.discord_id, roles.member, true);

				// Assign timestamp to when became member
				data[index].member_date = Date.now();

				// Fetch member so it can use their picture
				client.guilds.cache.get(guild_id).members.fetch(player.discord_id)
					.then(member => {
						// Send annoucement
						const message_embed = new Discord.MessageEmbed()
							.setColor('#363fed')
							.setAuthor(`Congrats ${member.displayName}`, member.user.displayAvatarURL())
							.setFooter(`You are now a member after waiting ${timeConversion(waiting_period_milliseconds)}`)
							.setTimestamp();

						client.guilds.cache.get(guild_id).channels.cache.get(channel_ids.user_log).send(message_embed);
					});

				// Write changes to players database
				fs.writeFile(data_files.players, JSON.stringify(data, null, 2), function writeJSON(err) { if (err) return console.log(err); });
			}
		});
	});
}, 10000);

// Update member count every 6 minutes
client.setInterval(() => {
	update_member_count();
}, 360000);

// Gets members of guild and updates member count channel name
async function update_member_count() {
	await client.guilds.cache.get(guild_id).members.fetch();
	const member_count = client.guilds.cache.get(guild_id).roles.cache.get(roles.member).members.size;
	client.channels.fetch(channel_ids.member_count)
		.then(channel => channel.setName(`Members: ${member_count}`));
}

// Check for Minecraft username changes and change nicknames
client.setInterval(() => {
	console.log('Would be checking mojang api');
}, waiting_period_milliseconds);

// Please add more comments in here.
client.on('guildMemberAdd', member => {
	fs.readFile(data_files.players, (err, data) => {
		data = JSON.parse(data);
		const pos = data.map(function(e) { return e.discord_id; }).indexOf(member.id);

		let title;
		let body;
		let embed_color;
		let should_ping;

		if (data[pos]) {
			title = `Welcome back ${member.displayName}`;
			body = 'You are already a member';
			embed_color = '#363fed';

			const message_embed = new Discord.MessageEmbed()
				.setColor(embed_color)
				.setAuthor(title, member.user.displayAvatarURL())
				.setFooter(body)
				.setTimestamp();

			member.guild.channels.cache.get(channel_ids.user_log).send(message_embed);

		}
		else {
			member.send(`Hey ${member.displayName}, let me get you set up to play on Darnoc Realms! I'll ask you a few questions and give you some information about the server. A fair warning though, you won't be able to play in-game until 24 hours from now. That limit is to prevent brigading and deter griefers & unkind players in general. The first thing you'll need to do is accept the server rules.\nType \`okay\`, once you are ready.`)
				.then(() => {
					title = `Welcome ${member.displayName}`;
					body = 'I just DMed you details on how to join the server';
					embed_color = '#62d169';
					should_ping = false;
					create_player(member.displayName, member.id, Date.now(), 0, false);
				})
				.catch(() => {
					title = `Hello ${member.displayName}`;
					body = 'See error below';
					embed_color = '#ffab1c';
					should_ping = true;
				})
				.finally(() => {
					const message_embed = new Discord.MessageEmbed()
						.setColor(embed_color)
						.setAuthor(title, member.user.displayAvatarURL())
						.setFooter(body)
						.setTimestamp();

					member.guild.channels.cache.get(channel_ids.user_log).send(message_embed);

					if (should_ping) {
						member.guild.channels.cache.get(channel_ids.user_log).send(`Uh oh ${member}! In order to become a member, you\'ll need to allow me to direct message you. Go to your discord settings, the "Privacy & Safety" tab, and turn on "Allow direct messages from server members". Then rejoin this server!`);
					}
				});
		}
	});
});

// In here, too!
client.on('guildMemberRemove', member => {
	let title;
	let body;

	fs.readFile(data_files.players, (err, data) => {
		data = JSON.parse(data);
		const pos = data.map(function(e) { return e.discord_id; }).indexOf(member.id);
		if (data[pos]) {
			if (data[pos].member_date) {
				title = `Farewell ${member.displayName}`;
				body = `You were a member for ${timeConversion(Date.now() - data[pos].member_date)}`;
				data[pos].left_date = Date.now();
			}
			else {
				title = `Goodbye ${member.displayName}`;
				body = `You were here for ${timeConversion(Date.now() - data[pos].join_date)}`;
				data.splice(pos, 1);
			}
			fs.writeFile(data_files.players, JSON.stringify(data, null, 2), function writeJSON(err) { if (err) return console.log(err); });
		}
		else {
			title = `See you later ${member.displayName}`;
			body = '';
		}

		const message_embed = new Discord.MessageEmbed()
			.setColor('#b2152c')
			.setAuthor(title, member.user.displayAvatarURL())
			.setFooter(body)
			.setTimestamp();

		member.guild.channels.cache.get(channel_ids.user_log).send(message_embed);
	});
});

// Adds player to the JSON file
function create_player(name, discord_id, join_date, tutorial_progress, is_admin) {
	fs.readFile(data_files.players, (err, data) => {
		if (err) throw err;

		data = JSON.parse(data);

		const new_player = {
			name: name,
			mc_uuid: '',
			discord_id: discord_id,
			join_date: join_date,
			member_date: '',
			left_date: '',
			tutorial_progress: tutorial_progress,
			banned: null,
			muted: null,
			is_admin: is_admin,
		};

		data.push(new_player);
		fs.writeFile(data_files.players, JSON.stringify(data, null, 2), function writeJSON(err) {
			if (err) return console.log(err);
		});
	});
}

function timeConversion(millisec) {
	const seconds = (millisec / 1000).toFixed(1);
	const minutes = (millisec / (1000 * 60)).toFixed(1);
	const hours = (millisec / (1000 * 60 * 60)).toFixed(1);
	const days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
	if (seconds < 60) {
		return (seconds + ' seconds').replace(/\.0/, '');
	}
	else if (minutes < 60) {
		return (minutes + ' minutes').replace(/\.0/, '');
	}
	else if (hours < 24) {
		return (hours + ' hours').replace(/\.0/, '');
	}
	else {
		return (days + ' days').replace(/\.0/, '');
	}
}
