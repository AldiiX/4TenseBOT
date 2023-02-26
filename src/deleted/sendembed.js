const { EmbedBuilder, PermissionFlagsBits, CommandInteractionOptionResolver } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../config");
const { QuickDB } = require("quick.db");
const db = new QuickDB();


module.exports = {
    adminOnly: true,
    data: new SlashCommandBuilder()
        .setName("sendembed")
        .setDescription("Vytvoř si vlastní embed zprávu")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option => 
            option.setName('title')
            .setDescription('titulek')
        )
        .addStringOption(option => 
            option.setName('description')
            .setDescription('popis')
        )
        .addStringOption(option => 
            option.setName('color')
            .setDescription('barva')
        ),
    run: async (client, interaction) => {
        const msg = interaction.options.getString("message") ?? " ";

        interaction.channel.send(msg);
        interaction.reply({ content: "\u200b", ephemeral: true })
    },
};