/* eslint-disable no-unused-vars */
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "autoplay",
    category: "Music",
    aliases: [ "ap" ],
    description: "Toggles Autoplay on/off",
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

        const identifier = player.queue.current.identifier;

        const autoplay = await player.get("autoplay");
        if (autoplay) {
            await player.set("autoplay", false);

            embed.setDescription(`Autoplay has been disabled`);
            message.channel.send({ embeds: [embed] });
        } else {
            await player.set("autoplay", true);
            await player.set("requester", message.author);
            await player.set("identifier", identifier);

            embed.setDescription(`Autoplay has been enabled`);
            message.channel.send({ embeds: [embed] });
        }
    }
}