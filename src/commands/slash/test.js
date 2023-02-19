// https://discordjs.guide/slash-commands/advanced-creation.html
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("I will send a test message."),
        // s.setDescriptionLocalizations({
        //     "cs": "Pošlu testovací zprávu"
        // }),
    run: async (client, interaction) => {
        interaction.reply(`Pong 🏓`)
    },
    adminOnly: true
};