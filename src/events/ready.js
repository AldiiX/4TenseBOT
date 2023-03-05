const { fetchApi } = require("../util/fetchapi");
const { log } = require("../util/utilfunctions");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
    	//let activities = [ `Developed by AldiiX#1121`, `${client.user.username}` ], i = 0;
    	//setInterval(() => client.user.setActivity({ name: `${activities[i++ % activities.length]}`, type: ActivityType.Listening }), 22000);
		
		let closestHour = 0;
		const interval = 4;
		const intervalToSeconds = interval * 60 * 60;

		const getTimeOffset = () => {
			
			let date = new Date();
			date = [date.toLocaleString('cs-CS', { hour: "2-digit" ,timeZone: "Europe/Prague" }), date.toLocaleString('cs-CS', { minute: "2-digit", timeZone: "Europe/Prague" })];
			
			const currentTimeToSeconds = (date[0] * 60 * 60) + (date[1] * 60);
			closestHour = Math.floor(currentTimeToSeconds / intervalToSeconds) * interval * 60 * 60;


			return closestHour + intervalToSeconds - currentTimeToSeconds;

			/*
				Takže, teď přichází největší slohovka o tom, co jsem tady kurva udělal. Přemýšlel jsem nad tím nejvíc dlouho,
				dával jsem si dohromady největší rovnice, abych dokázal vypočítat, kolik minut mi ještě zbývá do 0,4,8,12,16,20 hodin.
				Budu to teď vysvětlovat na příkladu, že momentálně je 11:30 hodin a potřebuju získat, kolik mi zbývá do 12 hodin, protože 
				12 je další hodina, kdy se má fetchovat databáze.
					1.) Nejdřív jsem si musel currentTime převést na sekundy.
					2.) Musel jsem zjistil nejbližší hodinu. To jsem zjistil tak, že jsem currentTime vydělil intervalem v sekundách.
						To celé ještě musím vynásobit intervalem, abych získal nejbližší nejnižší hodinu k momentálnímu času.
						Např. bude-li 11:30, nejbližší nejnižší hodina je 8h, protože interval jsou 4 hodiny (0,4,8,12..).
						Nyní mám nejbližší hodinu, kterou ale kvůli budoucím výpočtům musím převést na sekundy, 
						tak to celé ještě vynásobím 60*60.
					3.) Nyní už můžu zjistit offset tím, že k nejbližší hodině přičtu interval (což jsou teď 4 hodiny), takže dostanu 12h,
						12h ofc je převedeno na sekundy a od toho odečtu momentální čas na sekundy. Tím dostanu sekundy, které mi zbývají do
						dalšího fetche. Což v tomto příkladě je 0,5h = 30min = 1800s.
			*/
		};


		await fetchApi(client);
		setTimeout(async () => {
			
			await fetchApi(client);
			setInterval(async () => await fetchApi(client), 1000 * intervalToSeconds);

		}, 1000 * getTimeOffset()); // interval se spustí až v hodinu, kdy se dělají fetche.

		log(`Automatický fetch v ${(closestHour + intervalToSeconds) / 3600}:00, zbývá ${getTimeOffset()}s = ${getTimeOffset() / 60}min = ${parseFloat(getTimeOffset() / 3600).toFixed(2)}h`, "warn");
		log(`4TenseBOT je online!`, "success");
	}
}
