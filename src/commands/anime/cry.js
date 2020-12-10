const { MessageEmbed } = require("discord.js")
const snpm = require('sakuranpm');

module.exports = {
    config: {
        name: "cry",
        desc: "Get a crying gif",
        usage: [`cry`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        let cry = await snpm.cry();

        let noperms = new MessageEmbed()
            .setColor(color)
            .setDescription(`:sob:`)
            .setImage(cry)
        return message.channel.send(noperms)
    }
}