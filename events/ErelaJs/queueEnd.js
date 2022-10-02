/* eslint-disable no-unused-vars */
const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: 'queueEnd',
	async execute(client, player) {
        const autoplay = player.get("autoplay");
        if (autoplay) {
            const requester = player.get("requester");
            const identifier = player.get("identifier") || player.queue.current.identifier;
            if (!identifier) console.log("No curent track");

            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            let res = await player.search(search, requester);

            player.queue.add(res.tracks[Math.floor(Math.random() * res.tracks.length) ?? 2]);
            if (!player.playing && !player.paused && !player.queue.size) player.play();
        } else {
            const channel = client.channels.cache.get(player.textChannel);
            let embed = new EmbedBuilder()
                .setColor("#FF0000")
                .setDescription(`There are no more tracks`);
            channel.send({ embeds: [embed] });
        }
    }
}