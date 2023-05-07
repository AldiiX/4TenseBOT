const { EmbedBuilder, PermissionsBitField, CommandInteractionOptionResolver, PermissionFlagsBits , AttachmentBuilder} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../../config");
const { QuickDB } = require("quick.db");
const db = new QuickDB();


module.exports = {
    adminOnly: false,
    data: new SlashCommandBuilder()
        .setName("qr")
        .setDescription("Pošlu ti 4Tense QR kód"),
    run: async (client, interaction) => {

        await interaction.deferReply();

        const qr = new AttachmentBuilder(`https://4tense.cz/images/4tqr.png`);

        const embed = new EmbedBuilder()
        .setTitle("**4TENSE QR**")
        .setImage("attachment://4tqr.png")
        .setColor(config.color);

        interaction.editReply({ embeds: [embed], ephemeral: false, files: [qr] })
    },
};