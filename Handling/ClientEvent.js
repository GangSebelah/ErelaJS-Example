const { readdirSync } = require('fs');

module.exports = async (client) => {
    readdirSync(`${process.cwd()}/Events/Client/`).forEach(file => {
        const event = require(`${process.cwd()}/Events/Client/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
        client.logger.log(`Loading Client Events ${event.name}`, "event");
    });
}