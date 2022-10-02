/* eslint-disable no-unused-vars */
const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'trackStuck',
	async execute(client, player, track, payload) {
		const channel = client.channels.cache.get(player.textChannel);

		const embedError = new EmbedBuilder()
            .setColor("#FF0000")
			.setDescription(`Error when loading song! Track is stuck`);
        channel.send({ embeds:[embedError] });
		client.logger.log(`Error when loading song! Track is stuck in [${player.guild}]`, "error");

		if (!player.voiceChannel) player.destroy();
    }
}