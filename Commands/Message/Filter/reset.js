/* eslint-disable no-unused-vars */
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "reset",
    category: "Filter",
    aliases: [ "resetfilter", "clearfilter" ],
    description: "Reset filter",
    args: false,
    usage: [],
    examples: [],
    memberPermissions: [],
    botPermissions: [ "SendMessages" ],
    owner: false,
    async execute(message, args) {
        const memberVC = message.member.voice.channel;
        const clientVC = message.guild.members.me.voice.channel;

        const embed = new EmbedBuilder()
            .setColor("#00FF00");
        const embedError = new EmbedBuilder()
            .setColor("#FF0000");

        if (!memberVC) {
            embedError.setDescription(`You must be in a voice channel`);
            return message.channel.send({ embeds:[embedError] });
        }
        if (clientVC && clientVC !== memberVC) {
            embedError.setDescription(`You must be in the same channel as ${message.client.user}`);
            return message.channel.send({ embeds:[embedError] });
        }

        const player = message.client.musicManager.get(message.guild.id);
        if (!player) {
            embedError.setDescription(`There is no player for this guild`);
            return message.channel.send({ embeds:[embedError] });
        }
        if (!player.queue.current) {
            embedError.setDescription(`There is no music playing`);
            return message.channel.send({ embeds:[embedError] });
        }

        const filter = player.get("filter");
        if (filter) {
            const data = { op: 'filters', guildId: message.guild.id };

            await player.node.send(data);
            await player.setVolume(50);
            player.set("filter", false);

            embed.setDescription(`Filter has been reset`);
            return message.channel.send({ embeds:[embed] });
        } else {
            embedError.setDescription(`There is no music filter`);
            return message.channel.send({ embeds: [embedError] });
        }
    }
}

async function resetFilter(player, message) {
    const data = {
        op: 'filters',
        guildId: message.guild.id,
    };

    await player.node.send(data);
    await player.setVolume(50);
}