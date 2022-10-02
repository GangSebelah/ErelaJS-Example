/* eslint-disable no-unused-vars */
module.exports = {
	name: 'playerMove',
	async execute(client, player, oldChannel, newChannel) {
		if (!newChannel) {
			await player.destroy();
		} else {
			player.setVoiceChannel(newChannel);
		}
    }
}