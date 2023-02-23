const { EmbedBuilder, PermissionsBitField, CommandInteractionOptionResolver } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../../config");
const { QuickDB } = require("quick.db");
const db = new QuickDB();


module.exports = {
    adminOnly: false,
    data: new SlashCommandBuilder()
        .setName("videa")
        .setDescription("Pošlu poslední video."),
    run: async (client, interaction) => {
            
        const videos = await db.get("web_api.videos");
        const embed = new EmbedBuilder();


        
        

        interaction.reply({ embeds: [embed] });
    },
};