const { MessageEmbed } = require("discord.js")
const request = require('node-fetch');

module.exports = {
    config: {
        name: "discord",
        aliases: ['dc'],
        desc: "Get current status information about Discord",
        usage: [`dc`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        request(`https://discordstatus.com/index.json`)
            .then(res => res.json())
            .then(data => {

                let stats = []
                let noperms = new MessageEmbed()
                    .setTitle(`Server status`)
                    .setThumbnail(`https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/91_Discord_logo_logos-512.png`)
                    .setColor(color)

                data.components.forEach(s => {
                    stats.push(`${s.status != 'operational' ? '<:dnd:759044009854631966>' : '<:online:759044009900376104>'} **${s.name}**`)
                })

                noperms.addField(`**${data.status.description}**`, stats.join('\n'), true)

                return message.channel.send(noperms)
            }).catch(error => { return message.channel.send("Couldn't get a status update from discord") })
    }
}