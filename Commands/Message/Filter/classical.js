/* eslint-disable no-unused-vars */
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "classical",
    category: "Filter",
    aliases: [],
    description: "Toggles filter classical on/off",
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

        const data = {
            op: 'filters',
            guildId: message.guild.id,
            equalizer: [
                { band: 0, gain: 0.375 },
                { band: 1, gain: 0.350 },
                { band: 2, gain: 0.125 },
                { band: 3, gain: 0 },
                { band: 4, gain: 0 },
                { band: 5, gain: 0.125 },
                { band: 6, gain: 0.550 },
                { band: 7, gain: 0.050 },
                { band: 8, gain: 0.125 },
                { band: 9, gain: 0.250 },
                { band: 10, gain: 0.200 },
                { band: 11, gain: 0.250 },
                { band: 12, gain: 0.300 },
                { band: 13, gain: 0.250 },
                { band: 14, gain: 0.300 }
            ]
        };

        const filter = player.get("filter");
        if (filter) {
            if (filter === "classical") {
                await resetFilter(player, message);
                player.set("filter", false);

                embed.setDescription(`Filter classical has been disabled`);
                return message.channel.send({ embeds:[embed] });
            } else {
                await resetFilter(player, message);
                await player.node.send(data);
                player.set("filter", "classical");

                embed.setDescription(`Filter classical has been enabled`);
                return message.channel.send({ embeds:[embed] });
            }
        } else {
            await player.node.send(data);
            player.set("filter", "classical");

            embed.setDescription(`Filter classical has been enabled`);
            return message.channel.send({ embeds:[embed] });
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