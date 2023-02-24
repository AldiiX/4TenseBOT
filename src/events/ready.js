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

		await fetchApi(client);
		setInterval(async () => await fetchApi(client), 1000 * 21600);

		log(`${client.user.username} is online!`, "success");
	}
}
