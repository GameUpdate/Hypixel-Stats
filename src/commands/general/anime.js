const { MessageEmbed } = require("discord.js")
const malScraper = require('mal-scraper')
const search = malScraper.search

module.exports = {
    config: {
        name: "anime",
        desc: "Get more information about an anime via MyAnimeList",
        usage: [`anime <anime name>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) { return message.channel.send("Can't search up an anime with no name") }

        search.search('anime', {
            term: args.join(" "),
        }).then(async anime => {
            let list = anime.map(res => `${anime.indexOf(res) + 1}. *${res.title}*`)
            let noperms = new MessageEmbed()
                .setTitle('Search results')
                .setDescription(`${list[0]}\n${list[1]}\n${list[2]}\n${list[3]}\n${list[4]}`)
                .setFooter(`React to get more info on the anime`)
                .setColor(color)
            message.channel.send(noperms).then(async msg => {
                await msg.react('1️⃣').then(r => {
                    msg.react('2️⃣').then(r => { msg.react('3️⃣').then(r => { msg.react('4️⃣').then(r => msg.react('5️⃣')) }) })

                    const filter = (reaction, user) => user.id === message.author.id && !user.bot
                    const collector = msg.createReactionCollector(filter, { time: 25000 });
                    collector.on('collect', r => {
                        collector.stop()
                        let num
                        switch (r._emoji.name) {
                            case '1️⃣':
                                num = 0
                                break
                            case '2️⃣':
                                num = 1
                                break
                            case '3️⃣':
                                num = 2
                                break
                            case '4️⃣':
                                num = 3
                                break
                            case '5️⃣':
                                num = 4
                                break
                        }
                        malScraper.getInfoFromName(anime[num].title).then((data) => {
                            let chars = data.characters.map(c => `[${c.name}](${c.link})`)
                            let date
                            if (data.aired.size === 0) { date = unknown } else { date = data.aired }
                            let info = new MessageEmbed()
                                .setTitle(`${data.title} | ${data.englishTitle}`)
                                .setThumbnail(data.picture)
                                .setURL(data.url)
                                .setDescription(`Status: *${data.status}*\nAired: *${data.aired}*\n\n${anime[num].shortDescription.replace(`.read more.`, `.`)}`)
                                .addField('Characters', chars.join(`\n`), true)
                                .addField('\u200b', '\u200b', true)
                                .addField('Stats', `Score: ${data.score}\nRank: ${data.ranked}\nPopularity: ${data.popularity}\nEpisodes: ${data.episodes}\n\nRating: ${data.rating}\nType: ${data.type}\nStudio: ${data.studios}\nGenres: ${data.genres.join(", ")}`, true)
                                .setFooter(`${data.scoreStats.charAt(0).toUpperCase() + data.scoreStats.slice(1)}`)
                                .setColor(color)
                            msg.reactions.removeAll()
                            setTimeout(() => msg.reactions.removeAll(), 2000)
                            return msg.edit(info)
                        }).catch((err) => { msg.reactions.removeAll(); return message.channel.send("Couldn't find more info for that anime") })
                    })
                    collector.on('end', collected => {
                        collector.stop()
                        if (collected.size === 0) {
                            msg.reactions.removeAll()
                        }
                    })
                })
            })
        }).catch(e => { console.log(e); return message.channel.send("Couldn't find that anime") })
    }
}