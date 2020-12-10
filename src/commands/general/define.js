const { MessageEmbed, Message } = require("discord.js")
const urban = require('relevant-urban');

module.exports = {
    config: {
        name: "urbandictionary",
        aliases: ["ud", "define"],
        desc: "Get a definition for something via Urban Dictionary",
        usage: [`ud <anything>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) { return message.channel.send("I can't define nothing...") }

        urban(args.join(" ")).then(def => {
            let noperms = new MessageEmbed()
                .setColor(color)
                .setTitle(def.word)
                .setURL(def.urbanURL)
                .addField('Examples:', def.example)
                .setDescription(def.definition)
                .setFooter(`Defined by: ${def.author} | 👍 ${def.thumbsUp} | 👎 ${def.thumbsDown}`)
            return message.channel.send(noperms)
        }).catch(err => {
            return message.channel.send("Couldn't define that")
        })
    }
}