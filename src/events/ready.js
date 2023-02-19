const { ActivityType } = require("discord.js");
const { fetchYtbApi } = require("../util/fetchYoutubeChannelAPI");


module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
    	//let activities = [ `Developed by AldiiX#1121`, `${client.user.username}` ], i = 0;
    	//setInterval(() => client.user.setActivity({ name: `${activities[i++ % activities.length]}`, type: ActivityType.Listening }), 22000);
		const stats = await fetchYtbApi("channelStats");

		client.user.setActivity({ name: `${stats.subscriberCount} subů, ${stats.videoCount} videí :)`, type: ActivityType.Playing });

	}
};
