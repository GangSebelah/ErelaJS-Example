/* eslint-disable no-unused-vars */
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "remove",
    category: "Music",
    aliases: [],
    description: "Removes a track from the Queue",
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

        const player = await message.client.musicManager.get(message.guild.id);
        if (!player) {
            embedError.setDescription(`There is no player for this guild`);
            return message.channel.send({ embeds:[embedError] });
        }
        if (!player.queue.current) {
            embedError.setDescription(`There is no music playing`);
            return message.channel.send({ embeds:[embedError] });
        }

        const position = Number(args[0]);
        if (!position || position < 0) {
            embedError.setDescription(`Please enter a valid position of song`);
            return message.channel.send({ embeds:[embedError] });
        }
        if (position > player.queue.size) {
            embedError.setDescription(`There are only ${player.queue.size} songs in the queue`);
            return message.channel.send({ embeds:[embedError] });
        }

        const song = await player.queue.remove(position);

        embed.setDescription(`Removed track [${song.track.title}](${song.track.uri})`);
        message.channel.send({ embeds: [embed] });
    }
}