const { MessageEmbed } = require("discord.js")
const snpm = require('sakuranpm');

module.exports = {
    config: {
        name: "bored",
        desc: "Get a sleeping gif",
        usage: [`bored`]
    },
    run: async (server, message, args) => {

        const color = server.color;

        let bored = await snpm.bored();

        let noperms = new MessageEmbed()
            .setColor(color)
            .setDescription(`:sleeping:`)
            .setImage(bored)
        return message.channel.send(noperms)
    }
}