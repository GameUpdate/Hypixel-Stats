const { MessageEmbed } = require("discord.js")
const request = require('node-fetch');

module.exports = {
    config: {
        name: "fact",
        desc: "Get a random fact",
        usage: [`fact`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        request(`https://uselessfacts.jsph.pl/random.json`)
            .then(res => res.json())
            .then(data => {
                return message.channel.send(data.text)
            }).catch(error => { return message.channel.send("Couldn't get a random fact") })
    }
}