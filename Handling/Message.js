const { Collection } = require('discord.js');
const { readdirSync } = require('fs');

module.exports = async (client) => {
    client.messageCommand = new Collection();
    client.categories = readdirSync("./Commands/Message/");

    readdirSync(`${process.cwd()}/Commands/Message/`).forEach(dir => {
        const messageCommandFiles = readdirSync(`${process.cwd()}/Commands/Message/${dir}/`).filter(f => f.endsWith('.js'));
        for (const file of messageCommandFiles) {
            const command = require(`${process.cwd()}/Commands/Message/${dir}/${file}`);
            client.logger.log(`Loading ${command.category} commands ${command.name}`, "cmd");
            client.messageCommand.set(command.name, command);
        }
    });
}