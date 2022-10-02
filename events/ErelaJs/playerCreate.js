/* eslint-disable no-unused-vars */
module.exports = {
	name: 'playerCreate',
	async execute(client, player) {
		client.logger.log(`Player has been created in ${player.guild}`, "info");
    }
}