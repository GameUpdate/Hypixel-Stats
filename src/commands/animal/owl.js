const { MessageEmbed } = require("discord.js")
const animals = require('random-animals-api');

module.exports = {
    config: {
        name: "owl",
        desc: "Get a picture of an owl"
    },
    run: async (server, message, args) => {
        const color = server.color;

        animals.owl()
            .then(url => {
                let noperms = new MessageEmbed()
                    .setTitle(`:owl:`)
                    .setImage(url)
                    .setColor(color)
                return message.channel.send(noperms)
            })
    }
}