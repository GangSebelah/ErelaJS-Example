/* eslint-disable no-unused-vars */
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "restart",
    category: "Owner",
    aliases: [],
    description: "Restart Bot.",
    args: false,
    usage: [],
    examples: [],
    memberPermissions: [],
    botPermissions: [ "SendMessages" ],
    owner: true,
    async execute(message, args) {
        const embed = new EmbedBuilder()
            .setColor(message.client.color)
            .setDescription(`Restarting bot.`);
        message.channel.send({ embeds: [embed] }).then(message => {
            process.exit(1);
        });
		
    }
}