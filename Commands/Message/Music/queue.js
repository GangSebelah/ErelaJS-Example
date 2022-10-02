/* eslint-disable no-unused-vars */
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "queue",
    category: "Music",
    aliases: [ "q" ],
    description: "Shows the Queue",
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

        const player = await message.client.musicManager.get(message.guild.id);
        if (!player) {
            embedError.setDescription(`There is no player for this guild`);
            return message.channel.send({ embeds:[embedError] });
        }
        if (!player.queue.current) {
            embedError.setDescription(`There is no music playing`);
            return message.channel.send({ embeds:[embedError] });
        }

        const queue = player.queue;
        const currentSong = queue.current;
        const arrays = queue.map((track, id) => `**${id + 1}**. \`${message.client.convert.convertTime(track.duration)}\` [${track.title}](${track.uri})`);

        const embedQueue = new EmbedBuilder()
            .setColor("#202225")
            .setAuthor({ name: "Queue ♫", iconURL: message.client.user.displayAvatarURL() })
            .setTimestamp()
            .setFooter({ text: `Request by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

        if (arrays.length === 0) {
            embedQueue.setDescription(`\`No song in queue\``);
            embedQueue.addFields({ name: `Now Playing`, value: `[${currentSong.title}](${currentSong.uri})`, inline: false  })
            message.channel.send({ embeds: [embedQueue] });
        } else {
            embedQueue.addFields(
                { name: `Now Playing`, value: `[${currentSong.title}](${currentSong.uri})`, inline: false },
                { name: "Total Song", value: `${arrays.length} Songs`, inline: true },
                { name: "Total Duration", value: `${message.client.convert.convertTime(queue.duration)}`, inline: true },
                { name: '\u200b', value: '\u200b', inline: true }
            );
            await message.client.pagination.button(message, arrays, embedQueue);
        }
    }
}