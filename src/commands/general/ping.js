const { MessageEmbed } = require("discord.js")
const ms = require('ms')

module.exports = {
    config: {
        name: "ping",
        aliases: ['pong'],
        description: "Get bot ping to the api and host",
    },
    run: async (server, message, args, pf) => {

        let pingEmbed = new MessageEmbed()
            .setColor(pf.color)
            .setTitle("Pinging...")

        message.channel.send({content: `\u200b`, embeds: [pingEmbed]}).then(m => {
            let ping = m.createdTimestamp - message.createdTimestamp
            pingEmbed.setDescription(`Bot Latency: \`${ping} ms\`\n API Latency: \`${Math.round(client.ws.ping)} ms\``).setTitle(`Hypixel Stats | Ping`)
            m.edit({content: `\u200b`, embeds: [pingEmbed]})
        })
    }
}