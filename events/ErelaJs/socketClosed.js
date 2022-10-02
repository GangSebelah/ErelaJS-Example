/* eslint-disable no-unused-vars */
module.exports = {
	name: 'socketClosed',
	async execute(client, player, payload) {
		if (payload.byRemote == true) {
			player.destroy();
		}
	
		client.logger.log(`Socket has been closed because ${payload.reason} in [${player.guild}]`, "info");
    }
}