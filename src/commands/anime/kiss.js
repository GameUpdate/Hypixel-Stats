const { MessageEmbed } = require("discord.js")
const nek = require('nekos.life');
const neko = new nek();

module.exports = {
    config: {
        name: "kiss",
        desc: "Kiss someone",
        usage: [`kiss <user>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        args[0] ? await message.guild.members.fetch({ query: args.join(" "), limit: 1 }) : await message.guild.members.fetch(message.author.id)
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user

        let noperms = new MessageEmbed()
            .setColor(color)

        if (user === message.author) {
            return message.channel.send("You can't kiss yourself that's just weird!")
        } else {
            noperms.setDescription(`${message.member} kissed ${user}!`)
        }

        let kiss = await neko.sfw.kiss()
        noperms.setImage(kiss.url)
        return message.channel.send(noperms)
    }
}