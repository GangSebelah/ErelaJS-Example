/* eslint-disable no-unused-vars */
module.exports = {
	name: 'nodeReconnect',
	async execute(client, node) {
		client.logger.log(`Node "${node.options.identifier}" reconnected.`, "info");
    }
}