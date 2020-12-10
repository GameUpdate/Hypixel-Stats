const { MessageEmbed, MessageAttachment } = require("discord.js")
const api = require('random-stuff-api')

module.exports = {
    config: {
        name: "joke",
        desc: "Get a dad joke",
        usage: [`joke`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        api.random.joke()
            .then(joke => {
                return message.channel.send(joke)
            })
    }
}