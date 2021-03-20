const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
	name: "lyrics",
    aliases: ["ly"],
    category: "Music",
    description: "Get lyrics for the currently playing song",
    args: false,
    usage: "",
    permission: [],
    owner: false,
	async execute(message, args) {

        const player = message.client.manager.get(message.guild.id);

        let song = args.join(" ");

        if (!song && !player || !song && !player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return message.channel.send(thing);
        }

        if (!song && player.queue.current) song = player.queue.current.title;

        let lyrics = null;

        try {
            lyrics = await lyricsFinder(song, "");
            if (!lyrics) lyrics = `No lyrics found.`;
        } catch (error) {
            console.error(error)
            lyrics = `Usage: ${message.client.prefix}ly <Song Name>`;
        }

        let lyricsEmbed = new MessageEmbed()
            .setColor(message.client.embedColor)
            .setDescription(`**Lyrics** of **${song}**\n${lyrics}`)
            .setFooter(`Request by: ${message.author.tag}`, message.author.displayAvatarURL());

        if (lyricsEmbed.description.length >= 2048)
        lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
        return message.channel.send(lyricsEmbed);
	
    }
};
