const { EmbedBuilder, PermissionsBitField, CommandInteractionOptionResolver, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, MessageComponentInteraction, createMessageComponentCollector } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../../config");
const { QuickDB } = require("quick.db");
const db = new QuickDB();


module.exports = {
    adminOnly: false,
    data: new SlashCommandBuilder()
        .setName("zajimavost")
        .setDescription("Pošlu náhodnou zajímavost o 4Tense."),
    run: async (client, interaction) => {

        const zajimavosti = await db.get("web_api.company.zajimavosti");
        const embed = new EmbedBuilder()
        .setTitle("**👀  Náhodná zajímavost**")
        .setColor(config.color);


        
        const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('primary').setLabel('Další zajímavost prosím!').setStyle(ButtonStyle.Primary));
        const rowDisabled = () => {row.components[0].setDisabled(true); return row};
        const endRow = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('end').setLabel('Konec').setStyle(ButtonStyle.Danger));



        function generateZajimavost() {
            embed.setDescription(zajimavosti[Math.floor(Math.random() * zajimavosti.length)])
        };



        const filterPrimaryRow = i => i.customId === 'primary';
        const filterEndRow = i => i.customId === 'end';
        const collectorPrimaryRow = interaction.channel.createMessageComponentCollector({ filter: filterPrimaryRow, time: 300 * 1000 });
        const collectorEndRow = interaction.channel.createMessageComponentCollector({ filter: filterEndRow, time: 300 * 1000 });




        collectorPrimaryRow.on('collect', async i => {
            generateZajimavost();
            await i.update({ embeds: [embed] });
        });

        collectorPrimaryRow.on('end', async collected => {
            await interaction.editReply({ embeds: [embed], components: [rowDisabled()] });
        });

        collectorEndRow.on('collect', async i => {
            await interaction.editReply({ embeds: [embed], components: [rowDisabled()] });
        });

        collectorEndRow.on('end', async collected => {
            await interaction.editReply({ embeds: [embed], components: [rowDisabled()] });
        });



        
        generateZajimavost();
        await interaction.reply({ embeds: [embed], components: [row, endRow]})
    },
};