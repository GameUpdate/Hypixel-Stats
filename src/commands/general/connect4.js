const { MessageEmbed, MessageAttachment } = require("discord.js")
const GameCord = require('gamecord');


module.exports = {
    config: {
        name: "connect4",
        aliases: ["c4"],
        desc: "Play a game of Connect 4 against someone",
        usage: [`c4 <user>`]
    },
    run: async (server, message, args) => {

        args[0] ? await message.guild.members.fetch({ query: args.join(" "), limit: 1 }) : await message.guild.members.fetch(message.author.id)
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args[0].toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args[0].toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user
        if (user.id === message.author.id) return message.channel.send(`You can't play against yourself`)

        let m = await message.channel.send(`${user} do you want to play against ${message.author.username} at Connect4`)
        await m.react('✅')
        await m.react('❎')
        let filter = (r, u) => user.id === u.id
        m.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();
                m.delete()
                if (reaction.emoji.name === '✅') {
                    new GameCord.ConnectFour(message)
                        .setTitle(`Connect 4`)
                        .setColor(server.color)
                        .setOpponent(user)
                        .run()
                } else {
                    return (`Looks like ${user.username} doesn't want to play with you ${message.author}`)
                }
            })
            .catch(collected => {
                return (`Looks like ${user.username} doesn't want to play with you ${message.author}`)
            });
    }
}