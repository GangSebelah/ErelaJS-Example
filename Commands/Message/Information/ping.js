/* eslint-disable no-unused-vars */
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    category: "Information",
    aliases: [],
    description: "Check Ping Bot",
    args: false,
    usage: [],
    examples: [],
    memberPermissions: [],
    botPermissions: [ "SendMessages" ],
    owner: false,
    async execute(message, args) {
        message.channel.send({ content: "Pinging..." })
        .then(msg => {
            const botLatency = msg.createdTimestamp - message.createdTimestamp;
            const shardLatency = message.guild.shard.ping;
            const websocketLatency = message.client.ws.ping;

            const embed = new EmbedBuilder()
                .setAuthor({ name: message.client.user.tag, iconURL: message.client.user.displayAvatarURL() })
                .setColor("#202225")
                .setDescription(`✉️ Message Latency: ${botLatency} ms\n⏱️ Shard Latency: ${shardLatency} ms\n💗 Websocket ping: ${websocketLatency} ms`)
                .setFooter({ text: `Shard ${message.guild.shard.id}/${message.client.shard || 0}` });;
            message.channel.send({ embeds: [embed] })
            .then(m => {
                msg.delete();
            });
        });
    }
}