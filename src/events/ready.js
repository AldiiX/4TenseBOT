const { ActivityType } = require("discord.js");
const { fetchApi } = require("../util/fetchYoutubeChannelAPI");
const { log } = require("../util/utilfunctions");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
    	//let activities = [ `Developed by AldiiX#1121`, `${client.user.username}` ], i = 0;
    	//setInterval(() => client.user.setActivity({ name: `${activities[i++ % activities.length]}`, type: ActivityType.Listening }), 22000);
		async function fetch(){
			await fetchApi("channelStats");
			const stats = await db.get("youtube_channel_stats");

			// nastavení 4tense voice kanálu na počet subů
			client.channels.fetch("1078403689364066324").then(channel => channel.setName(`Počet subů: ${stats.subscriberCount}`));
			client.channels.fetch("1078408841890381895").then(channel => channel.setName(`Počet views: ${stats.viewCount}`));
			
			client.user.setActivity({ name: `${stats.subscriberCount} subů, ${stats.videoCount} videí :)`, type: ActivityType.Playing });
		};

		await fetch();
		setInterval(async () => await fetch(), 1000 * 21600);

		log(`${client.user.username} is online!`, "success");
	}
}
