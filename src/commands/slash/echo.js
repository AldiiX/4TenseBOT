const { EmbedBuilder, PermissionsBitField, CommandInteractionOptionResolver, PermissionFlagsBits } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../../config");
const { QuickDB } = require("quick.db");
const db = new QuickDB();


module.exports = {
    adminOnly: false,
    data: new SlashCommandBuilder()
        .setName("echo")
        .setDescription("Zprávu, kterou napíšeš, pošlu do chatu.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option => 
            option.setName('message')
            .setDescription('zpráva, kterou odešlu do chatu')
            .setRequired(true)
        ),
    run: async (client, interaction) => {
        const msg = interaction.options.getString("message") ?? " ";

        interaction.channel.send(msg);
        interaction.reply({ content: "\u200b", ephemeral: true })
    },
};