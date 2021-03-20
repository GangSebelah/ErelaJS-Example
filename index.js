/**
 * Module Imports
 */
const { Client, Collection, Intents } = require("discord.js");
const { readdirSync } = require("fs");
const { TOKEN, PREFIX, OWNERID, clientID, clientSecret, embedColor } = require("./config.json");
const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify")

const client = new Client({
    disableMentions: "everyone",
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    ws: { intents: Intents.ALL }
});

client.prefix = PREFIX;
client.owner = OWNERID;
client.embedColor = embedColor;
client.commands = new Collection();
client.categories = readdirSync("./commands/");
client.logger = require("./utils/logger.js");
client.emoji = require("./utils/emoji.json");
client.manager = new Manager({
    nodes: [{
        host: "",
        port: 2333,
        password: "",
        retryDelay: 5000,
    }],
    send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
    autoPlay: true,
    plugins: [new Spotify({
        clientID,
        clientSecret
    })]
});

client.on("raw", (d) => client.manager.updateVoiceState(d));

/**
 * Error Handler
 */
client.on("disconnect", () => console.log("Bot is disconnecting..."))
client.on("reconnecting", () => console.log("Bot reconnecting..."))
client.on('warn', error => console.log(error));
client.on('error', error => console.log(error));
process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));

/**
 * Client Events
 */
readdirSync("./events/Client/").forEach(file => {
    const event = require(`./events/Client/${file}`);
    let eventName = file.split(".")[0];
    client.logger.log(`Loading Events Client ${eventName}`, "event");
    client.on(eventName, event.bind(null, client));
});

/**
 * Erela Manager Events
 */
readdirSync("./events/Lavalink/").forEach(file => {
    const event = require(`./events/Lavalink/${file}`);
    let eventName = file.split(".")[0];
    client.logger.log(`Loading Events Lavalink ${eventName}`, "event");
    client.manager.on(eventName, event.bind(null, client));
});

/**
 * Import all commands
 */
readdirSync("./commands/").forEach(dir => {
    const commandFiles = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${dir}/${file}`);
        client.logger.log(`Loading ${command.category} commands ${command.name}`, "cmd");
        client.commands.set(command.name, command);
    }
});

client.login(TOKEN);