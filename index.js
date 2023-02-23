require('dotenv').config();

const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages], partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.User]});
const config = require("./src/config.js");
const { readdirSync } = require("fs");
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const {log} = require("./src/util/utilfunctions");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

client.prefixcommands = new Collection();
client.slashcommands = new Collection();
client.commandaliases = new Collection();



const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

//slash-command-handler
const slashcommands = [];

readdirSync('./src/commands/slash').forEach(async file => {

    const command = await require(`./src/commands/slash/${file}`);
    slashcommands.push(command.data.toJSON());

    await db.get("slashcommands");
    await db.set("slashcommands", slashcommands);
    client.slashcommands.set(command.data.name, command);
});


//prefix-command-handler
const prefixcommands = [];

readdirSync('./src/commands/prefix').forEach(async file => {

    const command = await require(`./src/commands/prefix/${file}`);

    if(command) {
        client.prefixcommands.set(command.name, command);
        prefixcommands.push(command.name, command);
        if(command.aliases && Array.isArray(command.aliases)) {
            command.aliases.forEach(alias => {
                client.commandaliases.set(alias, command.name);
            });
        }
    }
});


//event-handler
readdirSync('./src/events').forEach(async file => {
	const event = await require(`./src/events/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
});



//nodejs-events
function announceError(error) {
    console.error("\x1b[41m");
    console.error(error);
    console.error("\x1b[0m");
};


process.on("unhandledRejection", e => { 
    announceError(e);
})

process.on("uncaughtException", e => { 
    announceError(e);
})  

process.on("uncaughtExceptionMonitor", e => { 
    announceError(e);
})


client.login(process.env.DISCORD_TOKEN);
