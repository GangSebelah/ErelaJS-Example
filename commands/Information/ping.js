const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    category: "Information",
    description: "Check Ping Bot",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    execute(message, args) {
        const embed = new MessageEmbed()
            .setColor(message.client.embedColor)
            .setDescription(`Ping : ${message.client.ws.ping} ms`)
            .setFooter(`Request by: ${message.author.tag}`, message.author.displayAvatarURL());
        message.channel.send(embed);
    }
}