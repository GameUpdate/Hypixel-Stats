const { MessageEmbed } = require("discord.js")
const ms = require('ms')

module.exports = {
    config: {
        name: "ping",
        aliases: ['pong'],
        desc: "Get bot ping to the api and host",
        usage: [`ping`]
    },
    run: async (server, message, args) => {

        let pingEmbed = new MessageEmbed()
            .setColor(server.color)
            .setTitle("Pinging...")

        message.channel.send(pingEmbed).then(m => {
            let ping = m.createdTimestamp - message.createdTimestamp
            pingEmbed.setDescription(`Uptime: \`${ms(client.uptime)}\`\nBot Latency: \`${ping} ms\`\n API Latency: \`${Math.round(client.ws.ping)} ms\``).setTitle(`:ping_pong: Pong!`)
            m.edit(pingEmbed)
        })
    }
}