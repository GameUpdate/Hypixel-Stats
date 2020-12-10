const { MessageEmbed } = require("discord.js")
const meow = require("random-meow");

module.exports = {
    config: {
        name: "cat",
        desc: "Get a picture of a cat"
    },
    run: async (server, message, args) => {
        const color = server.color;

        meow().then(url => {
            let noperms = new MessageEmbed()
                .setTitle(':cat:')
                .setImage(url)
                .setColor(color)
            return message.channel.send(noperms)
        })
    }
}