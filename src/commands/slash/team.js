const { EmbedBuilder, PermissionsBitField, CommandInteractionOptionResolver } = require("discord.js");
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
            
        const team = await db.get("web_api.members");
        const embed = new EmbedBuilder();

        let targetUser = interaction.options.getString("clen").toLowerCase() ?? null;
        if(targetUser) {
            const arr = [];
            for(let m of team) if(!m.hidden) arr.push(m.name.toLowerCase());

            if(targetUser == "fofo" || targetUser == "fofo 23") targetUser = "fofo23";
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
            }
        } else {

            let index;
            index = team.findIndex(function(object) {
                return object.name.toLowerCase() == targetUser ?? null;
            });

            const member = team[index];

            embed.setTitle(`**${member.name.toUpperCase()}**   (${member.funkce[0].name})`)
            .setDescription(member.about)
            .setThumbnail(`https://www.4tense.cz/images/avatars/aldiix.png`)
            .setURL("https://www.4tense.cz/#team")
            .setColor(member.accentColor.dark);
        }
        
        
        
        embed.setFooter({ text: "www.4tense.cz", iconURL: 'https://4tense.cz/images/logo.webp'});
        interaction.reply({ embeds: [embed] });
    },
};