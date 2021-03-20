module.exports = async (client, guild) => {
	client.users.fetch("527452562857656352").then(user => {
        user.send(`🔔 Joined: ${guild.name} (${guild.id}) - ${guild.members.cache.size} members`);
	})
}