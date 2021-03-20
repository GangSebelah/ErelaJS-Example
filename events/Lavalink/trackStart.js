const { MessageEmbed } = require("discord.js");
const { convertTime } = require('../../utils/convert.js');

module.exports = async (client, player, track, payload) => {
    const channel = client.channels.cache.get(player.textChannel);
    const emojiplay = client.emoji.play;

    const thing = new MessageEmbed()
        .setDescription(`${emojiplay} **Started Playing**\n [${track.title}](${track.uri}) - \`[${convertTime(track.duration)}]\``)
        .setThumbnail(track.displayThumbnail("3"))
        .setColor(client.embedColor)
        .setTimestamp()
        .setFooter(`Request by: ${track.requester.tag}`, track.requester.displayAvatarURL());
    channel.send(thing);
    
}