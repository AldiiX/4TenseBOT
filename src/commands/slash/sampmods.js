const { EmbedBuilder, PermissionsBitField, CommandInteractionOptionResolver, PermissionFlagsBits } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../../config");
const { QuickDB } = require("quick.db");
const db = new QuickDB();


module.exports = {
    adminOnly: false,
    data: new SlashCommandBuilder()
        .setName("sampmods")
        .setDescription("Pošlu všechny módy, které FoFo používá na samp."),
    run: async (client, interaction) => {

        await interaction.deferReply();

        const mods = await db.get("web_api.sampMods");
        const embed = new EmbedBuilder()
        .setTitle("**💎 SAMP MÓDY**")
        .setDescription("Používání módů není WTLSku oficiálně povolené a můžeš za to dostat ban. Použití jen na vlastní riziko, 4Tense není odpovědné za použití modifikací do hry.")
        .setColor(config.color);

        mods.forEach(mod => {
            embed.addFields({ name: `\u200b\n**${mod.name}**`, value: `${mod.desc}\n[**STÁHNOUT**](${mod.url})`});
        }); 



        interaction.editReply({ embeds: [embed], ephemeral: false })
    },
};