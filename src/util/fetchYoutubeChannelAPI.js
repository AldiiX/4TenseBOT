const config = require("../config");
const { ActivityType } = require("discord.js");
require("dotenv").config()
const axios = require("axios");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { log } = require("./utilfunctions");


module.exports = {
    fetchApi: async (client) => {
        const youtubeChannelStats = (await axios.get(`${new URL('https://youtube.googleapis.com/youtube/v3/channels?part=statistics&id=UCoD0oHlXXQYYYzoymB-LfoQ&key=' + process.env.API_KEY)}`, { params: { answer: 42 }})).data.items[0].statistics;
        const webApi = (await axios.get(`${new URL('https://api.npoint.io/22bfa01f4bf8ffb4fe3d')}`, { params: { answer: 42 }})).data;
        
        const date = new Date();
        const today = [date.toLocaleDateString('cs-CS', { year:"numeric", month:"short", day:"numeric" }), `${date.getHours()}:${date.getMinutes()}` ]

        await db.set("last_fetch", today);
        await db.set("youtube_channel_stats", youtubeChannelStats);
        await db.set("web_api", webApi);

        // ----------------------------------------------------------------------------------------------- 

        const stats = await db.get("youtube_channel_stats");
        const lastFetch = (await db.get("last_fetch"))[1];
        
        // nastavení 4tense voice kanálu na počet subů
        client.channels.fetch("1078403689364066324").then(channel => channel.setName(`Počet subů: ${stats.subscriberCount}`));
        client.channels.fetch("1078408841890381895").then(channel => channel.setName(`Počet views: ${stats.viewCount}`));
        client.channels.fetch("1078670676006809620").then(channel => channel.setName(`Poslední fetch: ${lastFetch}`));

        client.user.setActivity({ name: `${stats.subscriberCount} subů, ${stats.videoCount} videí :)`, type: ActivityType.Playing });


        log("API fetchnuto.", "success");
    },
}