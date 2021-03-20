const { PREFIX } = require("../../config.json");

module.exports = async (client) => {

    //If the bot is ready it sends a message in the console
    client.manager.init(client.user.id);
    client.logger.log(`${client.user.username} Sudah online!`, "ready");
    client.logger.log(`Ready on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users`, "ready");

    //Game
    let statuses = ['GANG SEBELAH', 'https://discord.gg/gangsebelah', `Prefix : ${PREFIX}`];
    setInterval(function() {
  		let status = statuses[Math.floor(Math.random()*statuses.length)];
  		client.user.setActivity(status, {type: "PLAYING"});
  	}, 10000)

}