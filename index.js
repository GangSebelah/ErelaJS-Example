const { Client, Partials, IntentsBitField } = require('discord.js');
const config = require(`${process.cwd()}/config.json`);
const { readdirSync } = require('fs');

const client = new Client({
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
    partials: [ Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction, Partials.GuildScheduledEvent, Partials.ThreadMember ],
    intents: new IntentsBitField(131071),
    shards: 'auto'
});

client.prefix = config.Prefix;
client.owner = config.OwnerId;
client.color = config.EmbedColor;
client.logger = require(`${process.cwd()}/Utils/logger`);

// Utils Handling
client.logger.log(`Loading Handling Utils`, "handling");
readdirSync(`${process.cwd()}/Utils/`).filter(path => path.split(".")[0] !== "logger").forEach(file => {
	let Name = file.split(".")[0];
    let Req = require(`${process.cwd()}/Utils/${file}`);
    client.logger.log(`Loading Utils ${Name}`, "util");
	client[Name] = Req;
});

// Handling
readdirSync(`${process.cwd()}/Handling/`).forEach(file => {
    let Name = file.split(".")[0]
    client.logger.log(`Loading Handling ${Name}`, "handling");
    require(`${process.cwd()}/Handling/${file}`)(client);
});

// Error Handling
client.on('warn', info => console.error(info));
client.on('error', error => console.error(error));
process.on('unhandledRejection', error => console.error(error));
process.on('uncaughtException', error => console.error(error));

client.login(config.Token);