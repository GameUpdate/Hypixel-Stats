const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "rstop",
        desc: "Stops the radio",
        usage: [`rstop`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!message.guild.me.voice.channel) {
            return message.channel.send(`Can't stop the radio if I'm not in a channel playing it`)
        } else {
            message.guild.me.voice.channel.leave()
            return message.react(`👌`)
        }
    }
}