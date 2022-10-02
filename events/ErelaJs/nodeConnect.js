/* eslint-disable no-unused-vars */
module.exports = {
	name: 'nodeConnect',
	async execute(client, node) {
		client.logger.log(`Node "${node.options.identifier}" connected.`, "ready");
    }
}