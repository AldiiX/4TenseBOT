const { InteractionType } = require("discord.js");
const config = require("../config");

module.exports = {
	name: 'interactionCreate',
	execute: async(interaction) => {
		
		let client = interaction.client;

		if (interaction.type == InteractionType.ApplicationCommand) {
			if(interaction.user.bot) return;
			
			try {
				const command = client.slashcommands.get(interaction.commandName)
				if(command.adminOnly == true && !config.developers.includes(interaction.user.id)) return interaction.reply({ content: `This command is only for bot developers.`, ephemeral: true});
				
				command.run(client, interaction);
			} catch (err) {
				interaction.reply({ content: `A problem was encountered while executing the command! Please try again.`, ephemeral: true});
				console.error(err);
			}
		}
	}
}