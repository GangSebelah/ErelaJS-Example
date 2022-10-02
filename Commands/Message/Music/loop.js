/* eslint-disable no-unused-vars */
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "loop",
    category: "Music",
    aliases: [ "repeat" ],
    description: "Repeats the current song",
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

        if (!args[0]) {
            if (player.queue.length === 0) {
                await trackRepeat(message, player, embed);
            } else {
                await queueRepeat(message, player, embed);
            }
        } else {
            if (["song", "track", "s", "t"].includes(args[0].toLowerCase())) {
                await trackRepeat(message, player, embed);
            } else if (["queue", "q"].includes(args[0].toLowerCase())) {
                await queueRepeat(message, player, embed);
            }
        }
    }
}

async function trackRepeat(message, player, embed) {
    if (player.queueRepeat) {
        await player.setQueueRepeat(false);
    }

    await player.setTrackRepeat(!player.trackRepeat);

    if (player.trackRepeat) {
        embed.setDescription(`I will now repeat the current track 🔂`);
        message.channel.send({ embeds: [embed] });
    } else {
        embed.setDescription(`I will no longer repeat the current track`);
        message.channel.send({ embeds: [embed] });
    }
}

async function queueRepeat(message, player, embed) {
    if (player.trackRepeat) {
        await player.setTrackRepeat(false);
    }

    await player.setQueueRepeat(!player.queueRepeat);

    if (player.queueRepeat) {
        embed.setDescription(`I will now repeat the queue 🔁`);
        message.channel.send({ embeds: [embed] });
    } else {
        embed.setDescription(`I will no longer repeat the queue`);
        message.channel.send({ embeds: [embed] });
    }
}