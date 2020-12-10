const { MessageEmbed, MessageAttachment } = require("discord.js")
const api = require('random-stuff-api')

module.exports = {
    config: {
        name: "insult",
        desc: "Get an insult",
        usage: [`insult`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        api.random.insult()
            .then(insult => {
                return message.channel.send(insult)
            })
    }
}