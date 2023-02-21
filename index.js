require('dotenv').config();

const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({intents: [GatewayIntentBits.Guilds], partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.User]});
const config = require("./src/config.js");
const { readdirSync } = require("fs");
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
let token = config.token;

client.commands = new Collection();
client.slashcommands = new Collection();
client.commandaliases = new Collection();

const rest = new REST({ version: '10' }).setToken(token);
const log = x => { console.log(`[${moment().format("DD/MM/YYYY HH:mm:ss")}] ${x}`) };

//slash-command-handler
const slashcommands = [];
readdirSync('./src/commands/slash').forEach(async file => {
    const command = await require(`./src/commands/slash/${file}`);
    slashcommands.push(command.data.toJSON());
    client.slashcommands.set(command.data.name, command);
});

client.on("ready", async () => {
    try {
        // await rest.put(Routes.applicationCommands(client.user.id), { body: slashcommands });
    } catch (error) {
        console.error(error);
    };

    log(`${client.user.username} is online!`);
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
process.on("unhandledRejection", e => { 
   console.log(e);
})

process.on("uncaughtException", e => { 
   console.log(e);
})  

process.on("uncaughtExceptionMonitor", e => { 
   console.log(e);
})


client.login(process.env.DISCORD_TOKEN);
