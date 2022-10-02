/* eslint-disable no-unused-vars */
module.exports = {
	name: 'nodeDisconnect',
	async execute(client, node, reason) {
		client.logger.log(`Node "${node.options.identifier}" disconnect because ${reason}.`, "warn");
    }
}