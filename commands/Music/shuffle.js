const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "shuffle",
    category: "Music",
    description: "Shuffle queue",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
	execute(message, args) {
    
		const player = message.client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("There is no music playing.");
            return message.channel.send(thing);
        }


        player.queue.shuffle();
        
        const emojishuffle = message.client.emoji.shuffle;

        let thing = new MessageEmbed()
            .setDescription(`${emojishuffle} Shuffled the queue`)
            .setColor(message.client.embedColor)
            .setTimestamp()
            .setFooter(`Request by: ${message.author.tag}`, message.author.displayAvatarURL());
        return message.channel.send(thing).catch(error => message.client.logger.log(error, "error"));
	
    }
};