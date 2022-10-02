/* eslint-disable no-unused-vars */
module.exports = {
	name: 'nodeDestroy',
	async execute(client, node) {
		client.logger.log(`Node "${node.options.identifier}" destroyed.`, "info");
    }
}