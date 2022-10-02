/* eslint-disable no-unused-vars */
module.exports = {
	name: 'playerDestroy',
	async execute(client, player) {
		client.logger.log(`Player has been destroyed in ${player.guild}`, "info");
    }
}