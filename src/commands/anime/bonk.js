const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "bonk",
        desc: "Bonk someone",
        usage: [`bonk <user>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        args[0] ? await message.guild.members.fetch({ query: args.join(" "), limit: 1 }) : await message.guild.members.fetch(message.author.id)
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user

        let noperms = new MessageEmbed()
            .setColor(color)
            .setImage('https://media1.tenor.com/images/347f852d3dfa48502406fa949fcc1449/tenor.gif?itemid=15150394')

        if (user === message.author) {
            return message.channel.send("You can't bonk yourself akemi!")
        } else {
            noperms.setDescription(`${message.member} bonked ${user}!`)
        }

        return message.channel.send(noperms)
    }
}