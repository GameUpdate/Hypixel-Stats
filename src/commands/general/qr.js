const { MessageEmbed, MessageAttachment } = require("discord.js")
const fetch = require("node-fetch");

module.exports = {
    config: {
        name: "qr",
        aliases: ["qrc"],
        desc: "Generate a qr code for a link",
        usage: [`qr <link>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) return message.channel.send(`Give a url to render into a qr code`)
        return message.channel.send(`http://chart.apis.google.com/chart?cht=qr&chs=200x200&chl=${args[0]}&chld=H|0`)
    }
}