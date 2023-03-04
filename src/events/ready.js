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
		
		const interval = 4 * 60 * 60; // 4 hodiny = 14400s

		const getTimeOffset = () => {
			
			let date = new Date();
			date = [date.toLocaleString('cs-CS', { hour: "2-digit" ,timeZone: "Europe/Prague" }), date.toLocaleString('cs-CS', { minute: "2-digit", timeZone: "Europe/Prague" })];
			
			const currentTimeToSeconds = (date[0] * 60 * 60) + (date[1] * 60);
			const closestHour = Math.floor(currentTimeToSeconds / interval);

			return closestHour + interval - currentTimeToSeconds;
		};


		await fetchApi(client);
		setTimeout(() => {

			setInterval(async () => await fetchApi(client), 1000 * interval);

		}, 1000 * getTimeOffset());

		log(`${client.user.username} is online!`, "success");
	}
}
