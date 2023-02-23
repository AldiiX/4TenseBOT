const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
const { log } = require("../../util/utilfunctions");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "fetchcommands",
    aliases: ["fec"],
    adminOnly: true,
    run: async (client, message, args) => {

        const slashcommands = await db.get("slashcommands");

        try {
            await rest.put(Routes.applicationCommands(client.user.id), { body: slashcommands });

            message.delete();
            log("Byly refreshnuty slashcommandy.", "warn");
        } catch (error) {
            console.error(error);
        };
    }
};