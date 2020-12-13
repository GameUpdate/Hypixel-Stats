const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "rinfo",
        desc: "Get info on a station",
        usage: [`rinfo <id>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) {
            return message.channel.send(`Can't get information on a station with no id`)
        } else {
            if (parseInt(args[0].substr(1))) {

                client.radio.describe(args[0], true).then(function (result) {
                    console.log(result)
                    const list = new MessageEmbed()
                        .setTitle(`${result.body[0].text}`)
                        .setDescription(`*${result.body[1].text}*`)
                        .setThumbnail(result.body[0].image)
                        .setColor(color)
                    message.channel.send(list)
                })
            } else {
                return message.channel.send(`Use a correct station id (ex: s25211)`)
            }
        }
    }
}