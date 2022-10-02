/* eslint-disable no-unused-vars */
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "rate",
    category: "Filter",
    aliases: [],
    description: "Toggles filter rate on/off",
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

        const value = args[0];
        if (!value) {
            embedError.setDescription(`Please provide the number of rate`);
            return message.channel.send({ embeds:[embedError] });
        }
        if (isNaN(value)) {
            embedError.setDescription(`Please enter a valid number`);
            return message.channel.send({ embeds:[embedError] });
        }

        let rate = Number(value);
        if (rate < 0)  rate = 0;
        if (rate > 10)  rate = 10;

        const data = {
            op: 'filters',
            guildId: message.guild.id,
            timescale: { rate: rate },
        };

        const filter = player.get("filter");
        if (filter) {
            if (filter === "rate") {
                await resetFilter(player, message);
                player.set("filter", false);

                embed.setDescription(`Filter rate has been disabled`);
                return message.channel.send({ embeds:[embed] });
            } else {
                await resetFilter(player, message);
                await player.node.send(data);
                player.set("filter", "rate");

                embed.setDescription(`Filter rate has been enabled`);
                return message.channel.send({ embeds:[embed] });
            }
        } else {
            await player.node.send(data);
            player.set("filter", "rate");

            embed.setDescription(`Filter rate has been enabled`);
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