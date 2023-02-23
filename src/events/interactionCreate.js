const { InteractionType } = require("discord.js");
const config = require("../config");
const { log } = require("../util/utilfunctions");

module.exports = {
	name: 'interactionCreate',
	execute: async(interaction) => {
		
		const client = interaction.client;

		if (interaction.type == InteractionType.ApplicationCommand) {
			if(interaction.user.bot) return;
			
			try {
				
				const command = client.slashcommands.get(interaction.commandName);
				
				if(command.adminOnly == true && !config.developers.includes(interaction.user.id)) {
					log(`${interaction.user.tag} zkusil použít /${interaction.commandName} v channelu ${interaction.channel.name} na serveru ${interaction.guild.name}. Nemá ale perms ¯\­_(ツ)_/¯`, "warn");
					return interaction.reply({ content: `This command is only for bot developers.`, ephemeral: true});
				};
				
				command.run(client, interaction);
				log(`${interaction.user.tag} použil /${interaction.commandName} v channelu ${interaction.channel.name} na serveru ${interaction.guild.name}`, "announcement");
			} catch (err) {
				interaction.reply({ content: `A problem was encountered while executing the command! Please try again.`, ephemeral: true});
				log(`${interaction.user.tag} zkusil použít /${interaction.commandName} v channelu ${interaction.channel.name} na serveru ${interaction.guild.name}\	n`, "error");
				log(err, "error");
			}
		}
	}
}