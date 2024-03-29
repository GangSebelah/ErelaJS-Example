/* eslint-disable no-unused-vars */
const { readdirSync } = require('fs');
const { Manager } = require("erela.js");
const Facebook = require("erela.js-facebook");
const Spotify = require("better-erela.js-spotify").default;
const AppleMusic = require("better-erela.js-apple").default;
const { host, password, port } = require(`${process.cwd()}/config.json`);

module.exports = async (client) => {

    const nodes = [
        {
            identifier: "ASIA1_NODE", host, password, port,
            regions: ["hongkong", "singapore", "sydney", "automatically"],
        },
        {
            identifier: "ASIA2_NODE", host, password, port,
            regions: ["india", "japan", "south-korea"],
        },
        {
            identifier: "USA_NODE", host, password, port,
            regions: ["us-east", "us-central", "us-south", "us-west", "brazil"],
        },
        {
            identifier: "GERMANY_NODE", host, password, port,
            regions: ["rotterdam", "russia"],
        },
    ];

    // Create Manager
    client.musicManager = new Manager({
        defaultSearchPlatform: "ytsearch", // "ytmsearch" / "ytsearch" / "deezer" / "scsearch" / "spsearch"
        handleError: false, // if true, you have to handle what happens when an Error happens, if false it auto skips!
        handleStuck: false, // if true, you have to handle what happens when an track gets stucked happens, if false it auto skips!
        volumeDecrementer: 1, // instead of sending 100% it sends 75%
        position_update_interval: 100, // update the player.position every 100ms
        nodes: nodes,
        validUnresolvedUris: [
            "spotify.com",  // only if your lavalink has spotify plugin
            "music.apple.com", // only if your lavalink has apple music plugin
            "facebook.com", // only if your lavalink has facebook plugin
        ],
        plugins: [
            new Spotify(),
            new AppleMusic(),
            new Facebook()
        ],
        shards: client.ws.totalShards || 1,
        clientName: client.user?.username,
        clientId: client.user?.id || client.id,
        send(id, payload) {
            const guild = client.guilds.cache.get(id);
            if(!guild) return;
            guild.shard.send(payload);
        },
        forceLoadPlugin: true,
        autoPlay: true,
        allowedLinksRegexes: Object.values(Manager.regex),
    });
    
    // init the manager
    client.on("ready", () => {
        client.musicManager.init(client.user.id, {
            shards: client.ws.totalShards,
            clientName: client.user.username,
            clientId: client.user.id, 
        });
    })
    
    // send voicestate updates
    client.on("raw", (data) => {
        switch(data.t) {
            case "VOICE_SERVER_UPDATE":
            case "VOICE_STATE_UPDATE":
                client.musicManager.updateVoiceState(data.d)
            break;
        }
    });

    readdirSync(`${process.cwd()}/Events/ErelaJs/`).forEach(file => {
        const event = require(`${process.cwd()}/Events/ErelaJs/${file}`);
        client.musicManager.on(event.name, (...args) => event.execute(client, ...args));
        client.logger.log(`Loading ErelaJs Events ${event.name}`, "music");
    });
}