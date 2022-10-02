/* eslint-disable no-unused-vars */
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "join",
    category: "Music",
    aliases: [ "j" ],
    description: "Summons the Bot in your Channel",
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
        if (clientVC && clientVC === memberVC) {
            embedError.setDescription(`I'm already on your voice channel`);
            return message.channel.send({ embeds:[embedError] });
        }
        if (clientVC && clientVC !== memberVC) {
            embedError.setDescription(`You must be in the same channel as ${message.client.user}`);
            return message.channel.send({ embeds:[embedError] });
        }

        const player = await message.client.musicManager.create({
            region: memberVC.rtcRegion || "automatically",
            guild: message.guildId,
            voiceChannel: memberVC.id,
            textChannel: message.channelId,
            selfDeafen: true,
            volume: 50,
            instaUpdateFiltersFix: false, // to disable it (and save resources) set it to false
        });

        await player.connect();

        embed.setDescription(`I have been summoned`);
        message.channel.send({ embeds: [embed] });

    }
}