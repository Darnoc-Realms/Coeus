/*

THIS WILL BECOME THE FUNCTIONS FILE CONTAINING FUNCTIONS TO BE USED BY MULTIPLE OTHER PARTS

*/

// get client from index
const client = require('./index');

// export functions
module.exports = { change_role };

// changes role of user
async function change_role(member_id, role_id, should_have) {
	// fetch a single role
	const role = await client.guilds.cache.get(guild_id).roles.fetch(role_id);
	// fetch user
	const member = await client.guilds.cache.get(guild_id).members.fetch(member_id);

	if (should_have) {
		member.roles.add(role).catch(console.error);
	}
	else {
		member.roles.add(role).catch(console.error);
	}
}
