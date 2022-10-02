/* eslint-disable no-unused-vars */
const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'trackStart',
	async execute(client, player, track, payload) {
        player.set("identifier", track.identifier);

        const channel = client.channels.cache.get(player.textChannel);

        let embed = new EmbedBuilder()
            .setColor("#202225")
            .setDescription(`Started playing [${track.title}](${track.uri})`);
        channel.send({ embeds: [embed] });
    }
}