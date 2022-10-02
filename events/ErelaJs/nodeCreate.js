/* eslint-disable no-unused-vars */
module.exports = {
	name: 'nodeCreate',
	async execute(client, node) {
		client.logger.log(`Node "${node.options.identifier}" created.`, "info");
    }
}