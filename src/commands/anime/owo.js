const { MessageEmbed } = require("discord.js")
const nek = require('nekos.life');
const neko = new nek();

module.exports = {
    config: {
        name: "owo",
        desc: "Owoify a message",
        usage: [`owo <text>`]
    },
    run: async (server, message, args) => {

        if (!args[0]) {
            return message.channel.send("I cant owoify nothing!")
        }

        let owo = await neko.sfw.OwOify({ text: args.join(" ") });
        return message.channel.send(owo.owo)
    }
}