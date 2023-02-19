const config = require("../config");
const axios = require("axios");


module.exports = {
    fetchYtbApi: async(returned) => {

        const youtubeChannelInfo = await axios.get(`${new URL('https://youtube.googleapis.com/youtube/v3/channels?part=statistics&id=UCoD0oHlXXQYYYzoymB-LfoQ&key=' + config.apiKey)}`, { params: { answer: 42 }});
        const channelStats = youtubeChannelInfo.data.items[0].statistics;

        switch(returned) {
            case "channelStats": return channelStats; break;
        };
    },
}