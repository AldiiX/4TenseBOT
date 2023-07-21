const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../../config");
const { QuickDB } = require("quick.db");
const db = new QuickDB();



module.exports = {
    adminOnly: false,
    data: new SlashCommandBuilder()
        .setName("team")
        .setDescription("Pošlu info o aktuálním 4Tense týmu.")
        .addStringOption(option => 
            option.setName('clen')
            .setDescription('Jméno člena 4Tense')
        ),
    run: async (client, interaction) => {
            
        let memberAvatar;
        const team = await db.get("web_api.members");
        const embed = new EmbedBuilder();
        let targetUser = String(interaction.options.getString("clen")).toLowerCase() ?? null;



        if(targetUser) {
            const arr = [];
            for(let m of team) if(!m.hidden) arr.push(m.name.toLowerCase());

            if(targetUser == "fofo" || targetUser == "fofo 23") targetUser = "fofo23";
            if(targetUser == "adrevenue" || targetUser == "slippercrx") targetUser = "steroine";
            if(!arr.includes(targetUser)) targetUser = null;
        }

        if(targetUser == null) {

            let memberCount = 0;
            for(let member of team) if(!member.hidden) memberCount++;
    
            embed.setTitle("**NÁŠ TÝM**")
            .setThumbnail('https://4tense.cz/images/logo.webp')
            .setDescription(`V našem týmu je momentálně **${memberCount} členů**.\n\u200b`)
            .setURL("https://www.4tense.cz/#team")
            .setColor(config.color);

    
            for(let member of team) {
                if(member.hidden) continue;
    
                embed.addFields({ name: member.name, value: member.about + "\n\u200b" })
            };

            embed.setFooter({ text: "www.4tense.cz", iconURL: 'https://4tense.cz/images/logo.webp'});
            interaction.reply({ embeds: [embed] })

            return;
        }



        await interaction.deferReply();
        
        let index;
        index = team.findIndex(function(object) {
            return object.name.toLowerCase() == targetUser ?? null;
        });

        const member = team[index];
        const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Profil').setStyle(ButtonStyle.Link).setURL(`https://www.4tense.cz/@${member.name}`));
        try { memberAvatar = new AttachmentBuilder(`https://4tense.cz/${member.avatar}`) } catch {};

        embed.setTitle(`**${member.name.toUpperCase()}**   (${member.funkce[0].name})`)
        .setDescription(member.about)
        .setThumbnail(`attachment://${member.name.toLowerCase()}.webp`)
        .setURL(`https://www.4tense.cz/@${member.name}`)
        .setColor(member.accentColor.dark)
        .setFooter({ text: "www.4tense.cz", iconURL: 'https://4tense.cz/images/logo.webp'});

        await interaction.editReply({ embeds: [embed], files: [memberAvatar], components: [row] })
    },
};