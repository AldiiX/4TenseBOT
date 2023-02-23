const config = require("../config.js");
const { Collection } = require("discord.js");
const ms = require("ms");
const cooldown = new Collection();
const { log } = require("../util/utilfunctions");

module.exports = {
	name: 'messageCreate',
	execute: async(message) => {
        let client = message.client;
        let prefix = config.prefix;
        const args = message.content.slice(prefix.length).trim().split(/ +/g); 
        const cmd = args.shift().toLowerCase();
        let command = client.prefixcommands.get(cmd);


        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;
        if(!message.content.startsWith(prefix)) return;
        
        if(cmd.length == 0 ) return;
        if(!command) command = client.prefixcommands.get(client.commandaliases.get(cmd));
        if(!command) return;

        if(command.adminOnly == true && !config.developers.includes(message.author.id)) {
            log(`${message.author.tag} zkusil použít ${prefix}${command.name} v channelu ${message.channel.name} na serveru ${message.guild.name}. Nemá ale perms ¯\­_(ツ)_/¯`, "warn");
            return message.reply({ content: `This command is only for bot developers.` });
        };
        
        log(`${message.author.tag} použil ${prefix}${command.name} v channelu ${message.channel.name} na serveru ${message.guild.name}`, "announcement");
        command.run(client, message, args);
    }
}