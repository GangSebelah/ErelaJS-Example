/* eslint-disable no-unused-vars */
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "volume",
    category: "Music",
    aliases: [ "v" ],
    description: "Changes the Volume",
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

        let value = args[0];
        if (!value) {
            embed.setDescription(`The current volume is **${player.volume}**`);
            return message.channel.send({ embeds: [embed] });
        }
        if (isNaN(value)) {
            embedError.setDescription(`Please enter a valid number`);
            return message.channel.send({ embeds:[embedError] });
        }

        let volume = Number(value);
        if (volume < 0)  volume = 0;

        await player.setVolume(volume);

        embed.setDescription(`Volume has been set to **${player.volume}**`);
        message.channel.send({ embeds: [embed] });
    }
}