const { EmbedBuilder, PermissionFlagsBits, CommandInteractionOptionResolver } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../../config");
const { QuickDB } = require("quick.db");
const db = new QuickDB();


module.exports = {
    adminOnly: false,
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
            .setDescription('barva embedu')
            .addChoices(
                { name: "Červená", value: "red"},
                { name: "Žlutá", value: "yellow"},
                { name: "Modrá", value: "blue"},
                { name: "Oranžová", value: "orange"},
                { name: "Zelená", value: "green"},
                { name: "Světle modrá", value: "aqua"},
                { name: "Bílá", value: "white"},
                { name: "Růžová", value: "pink"}
            )
        )
        .addBooleanOption(option => 
            option.setName('add_timestamp')
            .setDescription("Přidat timestamp")    
        ),
    run: async (client, interaction) => {

        const embed = new EmbedBuilder();
        const title = interaction.options.getString("title");
        const description = interaction.options.getString("description");
        const color = interaction.options.getString("color");
        const colors = {
            red: "#ff0000",
            yellow: "#F8FF00",
            blue: "#002FFF",
            orange: "#FF9B00",
            green: "#00D71E",
            aqua: "#00FFF9",
            white: "#FFFFFF",
            pink: "#FF56D5",
        };
        const addTimeStamp = interaction.options.getBoolean('add_timestamp') ?? false;
        

        if(title == null && description == null) {
            return interaction.reply({ content: "Abys mohl/a poslat embed, musíš buď zadat title nebo description.", ephemeral: true });
        };


        if(title) embed.setTitle(title);
        if(description) embed.setDescription(description);
        if(color) embed.setColor(colors[color]); else embed.setColor(config.color);
        if(addTimeStamp) embed.setTimestamp();


        interaction.channel.send({ embeds: [embed] });
        interaction.reply({ content: "\u200b", ephemeral: true })
    },
};