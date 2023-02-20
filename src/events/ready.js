const { ActivityType } = require("discord.js");
const { fetchApi } = require("../util/fetchYoutubeChannelAPI");
const { QuickDB } = require("quick.db");
const db = new QuickDB();


module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
    	//let activities = [ `Developed by AldiiX#1121`, `${client.user.username}` ], i = 0;
    	//setInterval(() => client.user.setActivity({ name: `${activities[i++ % activities.length]}`, type: ActivityType.Listening }), 22000);
		async function fetch() {
			await fetchApi("channelStats");
			const stats = await db.get("youtube_channel_stats");
	
			client.user.setActivity({ name: `${stats.subscriberCount} subů, ${stats.videoCount} videí :)`, type: ActivityType.Playing });
		}

		await fetch();
		
		setInterval(async () => {
			await fetch();
		}, 1000 * 21600);
	}
};
