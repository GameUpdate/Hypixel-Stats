const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "rlist",
        desc: "List the radios",
        usage: [`rlist`, `rlist <category>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) {
            const list = new MessageEmbed()
                .setTitle(`Radio categories`)
                .setDescription(`Best\nPopular\nMusic\nSports`)
                .setFooter(`To see stations do ${server.bot_prefix}rlist <category>`)
                .setColor(color)
            return message.channel.send(list)
        } else if (args[0].toLowerCase() === 'music') {
            client.radio.browse_music().then(function (result) {
                let cats = []; let i = 1
                result.body.forEach(c => cats.push(`\`${i++}.\` ${c.text}`))
                const list = new MessageEmbed()
                    .setTitle(`Music genres`)
                    .setDescription(cats.join(`\n`))
                    .setFooter(`To list stations for a certain music genre give a number`)
                    .setColor(color)
                message.channel.send(list)
                const collector = message.channel.createMessageCollector((m) => m.author.id === message.author.id, {
                    time: 60000,
                    errors: ['time']
                })
                collector.on('collect', ({ content }) => {
                    if (!isNaN(content) && parseInt(content) >= 1 && parseInt(content) <= cats.length) {
                        collector.stop()
                        client.radio.browse({ id: result.body[parseInt(content) - 1].guide_id }).then(function (resul) {
                            let catss = [];
                            resul.body[1].children.forEach(c => !c.guide_id ? '' : catss.push(`${c.text} ↦ \`${c.guide_id}\``))
                            const list = new MessageEmbed()
                                .setTitle(`Stations for ${result.body[parseInt(content) - 1].text}`)
                                .setDescription(catss.join(`\n`))
                                .setFooter(`To play one of these stations use ${server.bot_prefix}rplay <id> (ex: ${server.bot_prefix}rplay s24861)\nTo search for a station use ${server.bot_prefix}rsearch <name>`)
                                .setColor(color)
                            return message.channel.send(list)
                        }).catch(function (err) {
                            return message.channel.send(`Couldn't get radio information`)
                        });
                    } else {
                        message.channel.send(`Invalid number`)
                    }
                })
                collector.on('end', (collected, reason) => {
                    if (reason === 'time') {
                        return message.channel.send(`Listing cancelled`)
                    }
                })
            }).catch(function (err) {
                return message.channel.send(`Couldn't get radio information`)
            });
        } else if (args[0].toLowerCase() === 'best') {
            client.radio.browse_best().then(function (result) {
                let cats = []
                result.body.forEach(c => !c.guide_id ? '' : cats.push(`${c.text} ↦ \`${c.guide_id}\``))
                const list = new MessageEmbed()
                    .setTitle(`Best stations`)
                    .setDescription(cats.join(`\n`))
                    .setFooter(`To play one of these stations use ${server.bot_prefix}rplay <id> (ex: ${server.bot_prefix}rplay s24861)\nTo search for a station use ${server.bot_prefix}rsearch <name>`)
                    .setColor(color)
                return message.channel.send(list)
            }).catch(function (err) {
                return message.channel.send(`Couldn't get radio information`)
            });
        } else if (args[0].toLowerCase() === 'popular') {
            client.radio.browse_popular().then(function (result) {
                let cats = []
                result.body.forEach(c => !c.guide_id ? '' : cats.push(`${c.text} ↦ \`${c.guide_id}\``))
                const list = new MessageEmbed()
                    .setTitle(`Most popular stations`)
                    .setDescription(cats.join(`\n`))
                    .setFooter(`To play one of these stations use ${server.bot_prefix}rplay <id> (ex: ${server.bot_prefix}rplay s24861)\nTo search for a station use ${server.bot_prefix}rsearch <name>`)
                    .setColor(color)
                return message.channel.send(list)
            }).catch(function (err) {
                return message.channel.send(`Couldn't get radio information`)
            });
        } else if (args[0].toLowerCase() === 'sports') {
            client.radio.browse_sports().then(function (result) {
                let cats = []; let i = 1
                result.body.forEach(c => cats.push(`\`${i++}.\` ${c.text}`))
                const list = new MessageEmbed()
                    .setTitle(`Sports genres`)
                    .setDescription(cats.join(`\n`))
                    .setFooter(`To list stations for a certain sports genre give a number`)
                    .setColor(color)
                message.channel.send(list)
                const collector = message.channel.createMessageCollector((m) => m.author.id === message.author.id, {
                    time: 60000,
                    errors: ['time']
                })
                collector.on('collect', ({ content }) => {
                    if (!isNaN(content) && parseInt(content) >= 1 && parseInt(content) <= cats.length) {
                        collector.stop()
                        client.radio.browse({ id: result.body[parseInt(content) - 1].guide_id }).then(function (resul) {
                            let catss = [];
                            resul.body[1].children.forEach(c => !c.guide_id ? '' : catss.push(`${c.text} ↦ \`${c.guide_id}\``))
                            const list = new MessageEmbed()
                                .setTitle(`Stations for ${result.body[parseInt(content) - 1].text}`)
                                .setDescription(catss.join(`\n`))
                                .setFooter(`To play one of these stations use ${server.bot_prefix}rplay <id> (ex: ${server.bot_prefix}rplay s24861)\nTo search for a station use ${server.bot_prefix}rsearch <name>`)
                                .setColor(color)
                            return message.channel.send(list)
                        }).catch(function (err) {
                            return message.channel.send(`Couldn't get radio information`)
                        });
                    } else {
                        message.channel.send(`Invalid number`)
                    }
                })
                collector.on('end', (collected, reason) => {
                    if (reason === 'time') {
                        return message.channel.send(`Listing cancelled`)
                    }
                })
            }).catch(function (err) {
                return message.channel.send(`Couldn't get radio information`)
            });
        } else {
            return message.channel.send(`Couldn't recognise that category, do \`${server.bot_prefix}rlist\` to list them all`)
        }
    }
}