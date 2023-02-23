const { EmbedBuilder, PermissionsBitField, CommandInteractionOptionResolver } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../../config");
const { QuickDB } = require("quick.db");
const db = new QuickDB();


module.exports = {
    adminOnly: false,
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Pošlu všechny příkazy."),
    run: async (client, interaction) => {
            
        const embed = new EmbedBuilder()
        .setTitle("**__HELP__**")
        .addFields({ name: "\u200b", value: "team (<jmeno clena>)\nvidea\nhelp"})
        .setColor(config.color)
        .setThumbnail(interaction.guild.iconURL());


        interaction.reply({ embeds: [embed] });
    },
};