const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../../config");
const { QuickDB } = require("quick.db");
const db = new QuickDB();




module.exports = {
    adminOnly: false,
    data: new SlashCommandBuilder()
        .setName("hvo")
        .setDescription("Pošlu momentální informace o sérii Hrdinové v Overwatchi")
        .addSubcommand(s => 
            s.setName("hero")
            .setDescription("Zjistí se info o určitém Hrdinovi")
            .addStringOption(option =>  option.setName('hrdina').setDescription('Jméno hrdiny').setRequired(true))
        )
        .addSubcommand(s => 
            s.setName("episode")
            .setDescription("Zjistí se info o určité epizodě")
            .addIntegerOption(option => option.setName('epizoda').setDescription('Číslo epizody').setRequired(true))
        ),
    run: async (client, interaction) => {

        let heroImage;
        let row = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Web').setStyle(ButtonStyle.Link).setURL("https://www.4tense.cz")).addComponents(new ButtonBuilder().setLabel('YouTube kanál').setStyle(ButtonStyle.Link).setURL("https://www.youtube.com/@4Tense"));
        const embed = new EmbedBuilder().setColor("White");
        const heroes = await db.get("web_api.hvoHeroes");
        const heroImgPathEndName = (heroname) => { 
            switch(heroname.toLowerCase()) {
                case "wrecking ball" : heroname = "wb"; break;
                case "torbjörn" : heroname = "torb"; break;
            }

            return `${String(heroname).toLowerCase().replace(/ /g, "").replace(/ú/g, 'u').replace(/ö/g, 'o') }.webp`
        };


        switch(interaction.options.getSubcommand()) {

            case "hero": {

                await interaction.deferReply();
                const heroesNames = [];
                const heroesNamesToLowerCase = [];
                let input = String(interaction.options.getString("hrdina"));

                // hero aliasy
                switch(input) {
                    case "lucio":
                    case "lůcio": input = "lúcio"; break;

                    case "dva": input = "d.va"; break;

                    case "soldier76":
                    case "soldier":
                    case "soldier 76": input = "soldier: 76"; break;

                    case "torbjorn":
                    case "torb": input = "torbjörn"; break;

                    case "wreckingball":
                    case "hammond": 
                    case "wb":
                    case "ball": input = "wrecking ball"; break;

                    case "mccree": input = "cassidy"; break;
                }
                
                for(let hero of heroes) {
                    heroesNamesToLowerCase.push(hero.name.toLowerCase());
                    heroesNames.push(hero.name);
                }

                heroesNames.sort();

                if(!heroesNamesToLowerCase.includes(input.toLowerCase())) {
                    return await interaction.editReply({ 
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`**Hrdina \`${input}\` neexistuje.**`)
                            .setDescription(`\u200b\n**List hrdinů:**\n\`${heroesNames.join(", ")}\`.`)
                            .setColor("Red")
                        ],
                        ephemeral: true 
                    });
                }


                const hero = heroes.find(x => { return x.name.toLowerCase() == input.toLowerCase()});
                heroImage = new AttachmentBuilder(`https://4tense.cz/images/hvo-heroes/${heroImgPathEndName(hero.name)}`);
                
                embed.setTitle(`**${hero.name}**`);
                
                if(hero.played == false) {
                    embed.setColor("#000000");
                    embed.setDescription(`Tento hrdina ještě nebyl natočený.`);
                }
                
                if(hero.inProgress == true && hero.played == false) {
                    embed.setColor("Yellow");
                    embed.setDescription("Pracujeme na tom, epizoda již brzy na YouTube :)")
                }
                
                if(hero.played == true) {
                    embed.setURL(hero.url);
                    embed.setDescription(`Epizoda #${hero.episode}`);
                    row = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Video').setStyle(ButtonStyle.Link).setURL(hero.url)).addComponents(new ButtonBuilder().setLabel('YouTube kanál').setStyle(ButtonStyle.Link).setURL("https://www.youtube.com/@4Tense"));
                }
                
                
                embed.setImage("attachment://" + heroImgPathEndName(hero.name));
                await interaction.editReply({ embeds: [embed], files: [heroImage], components: [row] });
            } break;

            case "episode": {

                await interaction.deferReply();
                let input = String(interaction.options.getInteger("epizoda"));

                if(input < 1 || input > heroes.length) {
                    return await interaction.editReply({ 
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`Zadané číslo \`${input}\` neodpovídá počtu hrdinů.`)
                            .setDescription(`Zadej prosím číslo od \`1\` do \`${heroes.length}\`.`)
                            .setColor("Red")
                        ],
                        ephemeral: true
                    });
                }

                const hero = heroes.find(x => { return x.episode == input }) ?? "unknown";

                if(hero == "unknown") {
                    embed.setColor("#000000");
                    embed.setTitle(`**Epizoda #${input}**`);
                    embed.setDescription("Tato epizoda ještě nebyla natočena.");
                    await interaction.editReply({ embeds: [embed] });
                    return;
                }
                
                if(hero.played == false && hero.episode) {
                    embed.setColor("Yellow");
                    embed.setTitle(`**Epizoda #${input} - ${hero.name}**`);
                    embed.setDescription("Tato epizoda sice ještě nebyla natočena, již je naplánovaný hrdina, kterýho si v ní zahrajeme.");
                    embed.setImage("attachment://" + heroImgPathEndName(hero.name));

                    heroImage = new AttachmentBuilder(`https://4tense.cz/images/hvo-heroes/${heroImgPathEndName(hero.name)}`);
                    row = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('YouTube kanál').setStyle(ButtonStyle.Link).setURL("https://www.youtube.com/@4Tense"));

                    await interaction.editReply({ embeds: [embed], files: [heroImage], components: [row] });
                    return;
                }

                if(hero.played) {
                    embed.setColor("White");
                    embed.setTitle(`**Epizoda #${input}**`);
                    embed.setURL(hero.url)
                    embed.setDescription(`V této epizodě jsme hráli hrdinu jménem **${hero.name}**.`);
                    embed.setImage("attachment://" + heroImgPathEndName(hero.name));

                    heroImage = new AttachmentBuilder(`https://4tense.cz/images/hvo-heroes/${heroImgPathEndName(hero.name)}`);
                    row = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Video').setStyle(ButtonStyle.Link).setURL(hero.url)).addComponents(new ButtonBuilder().setLabel('YouTube kanál').setStyle(ButtonStyle.Link).setURL("https://www.youtube.com/@4Tense"));

                    await interaction.editReply({ embeds: [embed], files: [heroImage], components: [row] });
                    return;
                }
            }; break;
        }
    },
}