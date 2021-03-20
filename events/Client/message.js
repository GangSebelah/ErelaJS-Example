const { MessageEmbed } = require("discord.js");
module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const PREFIX = client.prefix;
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [ matchedPrefix ] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    const embed = new MessageEmbed()
        .setColor("RED");

    // args: true,
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
        
        // usage: '',
        if (command.usage) {
        	reply += `\nUsage: \`${PREFIX}${command.name} ${command.usage}\``;
        }
        
        embed.setDescription(reply);
        return message.channel.send(embed);
    }

    if (command.permission && !message.member.permissions.has(command.permission)) {
        embed.setDescription("You can't use this command.");
        return message.channel.send(embed);
    }

    if (command.owner && message.author.id !== `${client.owner}`) {
        embed.setDescription("Only <@527452562857656352> can use this command!");
        return message.channel.send(embed);
    }

    const player = message.client.manager.get(message.guild.id);

    if (command.player && !player) {
        embed.setDescription("There is no player for this guild.");
        return message.channel.send(embed);
    }

    if (command.inVoiceChannel && !message.member.voice.channel) {
        embed.setDescription("You must be in a voice channel!");
        return message.channel.send(embed);
    }

    if (command.sameVoiceChannel && message.member.voice.channel !== message.guild.me.voice.channel) {
        embed.setDescription(`You must be in the same channel as ${message.client.user}!`);
        return message.channel.send(embed);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.log(error);
        embed.setDescription("There was an error executing that command.\nI have contacted the owner of the bot to fix it immediately.");
        return message.channel.send(embed);
    }
};