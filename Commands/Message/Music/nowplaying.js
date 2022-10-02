/* eslint-disable no-unused-vars */
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "nowplaying",
    category: "Music",
    aliases: [ "np" ],
    description: "Shows detailled information about the current Song",
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

        const currentSong = player.queue.current;

        // Progress Bar
        var total = currentSong.duration;
        var current = player.position;
        var size = 15;
        var line = '▬';
        var slider = '🔘';

        const embedNP = new EmbedBuilder()
            .setAuthor({ name: "Now Playing ♪", iconURL: message.client.user.displayAvatarURL() })
            .setThumbnail(currentSong.thumbnail)
            .setColor("#202225")
            .setTimestamp()
            .addFields(
                { name: "Playing", value: `[${currentSong.title}](${currentSong.uri})`, inline: false },
                { name: "Position", value: `\`${message.client.progressbar.progressbar(total, current, size, line, slider)}\``, inline: true },
                { name: "Position in queue", value: "Now Playing", inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
                { name: "Position", value: `${message.client.convert.convertTime(current)}`, inline: true },
                { name: "Length", value: `${message.client.convert.convertTime(total)}`, inline: true },
                { name: '\u200b', value: '\u200b', inline: true }
            )
            .setFooter({ text: `Request by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
        message.channel.send({ embeds: [embedNP] });
    }
}