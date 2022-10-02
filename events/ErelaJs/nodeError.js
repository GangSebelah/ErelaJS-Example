/* eslint-disable no-unused-vars */
module.exports = {
	name: 'nodeError',
	async execute(client, node, error) {
		client.logger.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`, "error");
    }
}