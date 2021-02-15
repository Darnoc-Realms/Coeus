/*

THIS WILL BECOME THE FUNCTIONS FILE CONTAINING FUNCTIONS TO BE USED BY MULTIPLE OTHER PARTS

*/

// Get client from index
const client = require('./index');

// Export functions
module.exports = { change_role };

// Changes role of users
async function change_role(member_id, role_id, should_have) {
	// Fetch a single role
	const role = await client.guilds.cache.get(guild_id).roles.fetch(role_id);
	// Fetch user
	const member = await client.guilds.cache.get(guild_id).members.fetch(member_id);

	if (should_have) {
		member.roles.add(role).catch(console.error);
	}
	else {
		member.roles.add(role).catch(console.error);
	}
}
