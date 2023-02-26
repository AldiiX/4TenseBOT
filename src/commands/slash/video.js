const { EmbedBuilder, PermissionsBitField, CommandInteractionOptionResolver } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../../config");
const { QuickDB } = require("quick.db");
const axios = require("axios");
const db = new QuickDB();


module.exports = {
    adminOnly: false,
    data: new SlashCommandBuilder()
        .setName("video")
        .setDescription("Pošlu poslední video."),
    run: async (client, interaction) => {
            
        const video = (await db.get("web_api.videos"))[0];
        const youtubeChannelStats = await db.get("youtube_channel_stats");
        const videoInfo = (await axios.get(new URL(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${video.id}&format=json`))).data;
        const lastFetch = (await db.get("last_fetch"))[1];

        let videoAuthorName;
        let videoAuthorValue;
        switch(video.category.toLowerCase()) {
            case "fromfofo": { videoAuthorValue = "FoFo"; videoAuthorName = "Autor videa" }; break;
            case "fromaldiix": { videoAuthorValue = "AldiiX"; videoAuthorName = "Autor videa" }; break;
            case "top": { videoAuthorValue = "Top"; videoAuthorName = "Kategorie videa" }; break;
            case "old": { videoAuthorValue = "Staré"; videoAuthorName = "Kategorie videa" }; break;
        };

        const embed = new EmbedBuilder()
        .setTitle("**💎 Nejnovější video**")
        .setDescription("\u200b")
        .setURL('https://www.youtube.com/watch?v=' + video.id)
        .setImage(videoInfo.thumbnail_url)
        .setThumbnail(interaction.guild.iconURL())
        .setColor(config.color)
        .addFields(
            { name: "**Název**", value: videoInfo.title, inline: false },
            { name: `**${videoAuthorName}**`, value: `${videoAuthorValue}`, inline: true    },
            { name: `**Kanál**`, value: `4Tense, ${youtubeChannelStats.subscriberCount} odběratelů`, inline: true    },
        )
        .setFooter({ text: `Poslední aktualizace: ${lastFetch} - pokud video nesedí, může to být i z důvodu, že video ještě nebylo do databáze zapsáno.` });

        

        interaction.reply({ embeds: [embed] });
    },
};