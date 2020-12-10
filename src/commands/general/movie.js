const { MessageEmbed } = require("discord.js")
const { simpleSearch, scrapper } = require('imdb-scrapper')

module.exports = {
    config: {
        name: "imdb",
        aliases: ['movie'],
        desc: "Get more information about a movie or tv show via IMDB",
        usage: [`movie <movie title/tv show title>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) { return message.channel.send("Can't search up nothing on IMDB") }

        simpleSearch(args.join(" "))
            .then(async movies => {
                let list = movies.d.map(res => `${movies.d.indexOf(res) + 1}. *${res.l} - (${res.q})*`)
                list.forEach(item => { list[list.indexOf(item)] = item.replace('feature', 'Movie'); list[list.indexOf(item)] = item.replace('undefined', 'Unknown'), list[list.indexOf(item)] = item.replace('video', 'Video'); list[list.indexOf(item)] = item.replace('video game', 'Video Game') })
                let noperms = new MessageEmbed()
                    .setTitle('Search results')
                    .setDescription(`${list[0]}\n${list[1]}\n${list[2]}\n${list[3]}\n${list[4]}`)
                    .setFooter(`React to get more info`)
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
                            scrapper(movies.d[num].id).then((data) => {
                                let info = new MessageEmbed()
                                    .setTitle(`${movies.d[num].l}`)
                                    .setThumbnail(data.poster)
                                    .setURL(`https://www.imdb.com/title/${movies.d[num].id}`)
                                    .setDescription(`Runtime: *${data.runtime}*\nYear: *${data.year}*\n\n${data.story}`)
                                    .addField('Cast', `Director: ${data.director}\nWriters: ${data.writers.join(", ")}\nStars: ${data.stars.join(", ")}`, true)
                                    .addField('\u200b', '\u200b', true)
                                    .addField('Stats', `Rating: ${data.rating}\nGenres: ${data.genre.join(", ")}`, true)
                                    .setColor(color)
                                msg.reactions.removeAll()
                                setTimeout(() => msg.reactions.removeAll(), 2000)
                                return msg.edit(info)
                            }).catch((err) => { msg.reactions.removeAll(); return message.channel.send("Couldn't find more info") })
                        })
                        collector.on('end', collected => {
                            collector.stop()
                            if (collected.size === 0) {
                                msg.reactions.removeAll()
                            }
                        })
                    })
                })
            }).catch(e => { console.log(e); return message.channel.send("Couldn't find that") })
    }
}