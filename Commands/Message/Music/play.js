/* eslint-disable no-unused-vars */
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "play",
    category: "Music",
    aliases: [ "p" ],
    description: "Plays a song",
    args: false,
    usage: [],
    examples: [],
    memberPermissions: [],
    botPermissions: [ "SendMessages" ],
    owner: false,
    async execute(message, args) {
        const memberVC = message.member.voice.channel;
        const clientVC = message.guild.members.me.voice.channel;

        const embed = new EmbedBuilder()
            .setColor("#00FF00");
        const embedError = new EmbedBuilder()
            .setColor("#FF0000");

        if (!memberVC) {
            embedError.setDescription(`You must be in a voice channel`);
            return message.channel.send({ embeds:[embedError] });
        }
        if (clientVC && clientVC !== memberVC) {
            embedError.setDescription(`You must be in the same channel as ${message.client.user}`);
            return message.channel.send({ embeds:[embedError] });
        }

        let player = await message.client.musicManager.get(message.guild.id);
        if (!player) {
            player = await message.client.musicManager.create({
                region: memberVC.rtcRegion || "automatically",
                guild: message.guildId,
                voiceChannel: memberVC.id,
                textChannel: message.channelId,
                selfDeafen: true,
                volume: 50,
                instaUpdateFiltersFix: false, // to disable it (and save resources) set it to false
            });
        }

        if (player.state !== "CONNECTED") {
            await player.connect();
        }

        const query = args.join(' ');
        let res;

        try {
            //const source = "yt"; // "yt" / "ap" / "sp" / "sc" / "ytm" / "..."
            //res = message.client.musicManager.search({query, source}, message.author, player.node);
            res = await player.search(query, message.author);
            if (res.loadType === 'LOAD_FAILED') {
                throw res.exception;
            }
        } catch (err) {
            embedError.setDescription(`There was an error while searching: ${err.message}`);
            return message.channel.send({ embeds:[embedError] });
        }

        switch (res.loadType) {
            case 'NO_MATCHES':
                embedError.setDescription(`There were no results found`);
                message.channel.send({ embeds:[embedError] });
                break;
            case 'TRACK_LOADED':
                await trackLoaded(message, player, res);
                break;
            case 'PLAYLIST_LOADED':
                await playlistLoaded(message, player, res);
                break;
            case 'SEARCH_RESULT':
                await trackLoaded(message, player, res);
                break;
            default:
                break;
        }
    }
}

async function trackLoaded(message, player, res) {
    const track = res.tracks[0];

    await player.queue.add(track);
    if (!player.playing && !player.paused && !player.queue.size) {
        await player.play();
    } else {
        let total = player.queue.current.duration;
        let current = player.position;
        let timePlayed = message.client.convert.convertTime(total - current);

        let positionUpComing = player.queue.size - 1;
        if (positionUpComing === 0) positionUpComing = "Next";

        const embed = new EmbedBuilder()
            .setAuthor({ name: "Added Track" })
            .setThumbnail(track.thumbnail)
            .setColor("#202225")
            .addFields(
                { name: "Track", value: `[${track.title}](${track.uri})`, inline: false },
                { name: "Estimated time until played", value: `${timePlayed}`, inline: true },
                { name: "Track Length", value: `${message.client.convert.convertTime(track.duration)}`, inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
                { name: "Position in upcoming", value: `${positionUpComing}`, inline: true },
                { name: "Position in queue", value: `${player.queue.size}`, inline: true },
                { name: '\u200b', value: '\u200b', inline: true }
            );
        message.channel.send({ embeds: [embed] });
    }
}

async function playlistLoaded(message, player, res) {
    const playlist = res.playlist;
    const tracks = res.tracks;
    const track = res.tracks[0];

    await player.queue.add(tracks);

    const embed = new EmbedBuilder()
        .setAuthor({ name: "Added Playlist" })
        .setThumbnail(playlist.thumbnail || track.thumbnail)
        .setColor("#202225")
        .addFields(
            { name: "Playlist", value: `[${playlist.name}](${playlist.uri})`, inline: false },
            { name: "Playlist Length", value: `${message.client.convert.convertTime(playlist.duration)}`, inline: true },
            { name: "Tracks", value: `${tracks.length}`, inline: true },
            { name: '\u200b', value: '\u200b', inline: true }
        );
    message.channel.send({ embeds: [embed] });

    if (!player.playing && !player.paused && player.queue.totalSize === tracks.length) {
        await player.play();
    }
}

