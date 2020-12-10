const { MessageEmbed, MessageAttachment } = require("discord.js")
const api = require('random-stuff-api')

module.exports = {
    config: {
        name: "art",
        desc: "Get a random piece of art",
        usage: [`art`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        api.image.art()
            .then(art => {
                return message.channel.send(art)
            })
    }
}