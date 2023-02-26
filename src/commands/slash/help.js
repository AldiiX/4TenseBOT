const { EmbedBuilder, PermissionsBitField, CommandInteractionOptionResolver, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, MessageComponentInteraction, createMessageComponentCollector } = require("discord.js");
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
        
        const slashcommandsArray = await db.get("slashcommands");
        const ycs = await db.get("youtube_channel_stats");
        const lastFetch = await db.get("last_fetch");
        const slashcommands = [];

        slashcommandsArray.forEach(el => {
            slashcommands.push(el.name)
        });

        const row1 = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Web').setStyle(ButtonStyle.Link).setURL("https://www.4tense.cz")).addComponents(new ButtonBuilder().setLabel('YouTube kanál').setStyle(ButtonStyle.Link).setURL("https://www.youtube.com/@4Tense"));;

        const embed = new EmbedBuilder()
        .setTitle("⭐ **__HELP__**")
        .setDescription("\u200b")
        .setColor(config.color)
        .addFields(
            { name: "**COMMANDY**", value: `\`${slashcommands.join(", ")}\`` },
            { name: "\u200b\n**4TENSE**", value: `\`Počet odběratelů:\` **${ycs.subscriberCount}**\n\`Počet zhlédnutí:\` **${ycs.viewCount}**\n\`Počet videí:\` **${ycs.videoCount}**\n\`Poslední aktualizace databáze:\` **${lastFetch.join(" ")}**` },
            { name: "\u200b", value: "Developed by **AldiiX**,\n**[www.4tense.cz](https://www.4tense.cz)**" }
        )
        .setThumbnail(interaction.guild.iconURL());


        interaction.reply({ embeds: [embed], components: [row1] });
    },
};