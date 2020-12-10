const { MessageEmbed } = require("discord.js")
const randomPuppy = require('random-puppy');

module.exports = {
    config: {
        name: "dog",
        desc: "Get a picture of a dog"
    },
    run: async (server, message, args) => {
        const color = server.color;

        randomPuppy().then(url => {
            let noperms = new MessageEmbed()
                .setTitle(':dog:')
                .setImage(url)
                .setColor(color)
            return message.channel.send(noperms)
        })
    }
}