const config = require("../config");
const axios = require("axios");
const { QuickDB } = require("quick.db");
const db = new QuickDB();


module.exports = {
    fetchApi: async () => {
        const youtubeChannelStats = (await axios.get(`${new URL('https://youtube.googleapis.com/youtube/v3/channels?part=statistics&id=UCoD0oHlXXQYYYzoymB-LfoQ&key=' + config.apiKey)}`, { params: { answer: 42 }})).data.items[0].statistics;
        const webApi = (await axios.get(`${new URL('https://api.npoint.io/22bfa01f4bf8ffb4fe3d')}`, { params: { answer: 42 }})).data;

        db.set("youtube_channel_stats", youtubeChannelStats);
        db.set("web_api", webApi);
    },
}