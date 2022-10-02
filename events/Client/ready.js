const { ActivityType } = require("discord.js");

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		await client.guilds.cache.each(async guild => {
            await guild.members.fetch({ withPresences: true, force: true });
        });
    
        client.logger.log(`${client.user.username} Sudah online!`, "ready");
        client.logger.log(`Ready on ${client.guilds.cache.size} servers, for a total of ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} users`, "ready");
    
        // Set Activity
        let statuses = [ `Prefix : ${client.prefix}` ];
        setInterval(function() {
            let status = statuses[Math.floor(Math.random()*statuses.length)];
            client.user.setActivity(status, { type: ActivityType.Playing });
        }, 10000);
	}
};
