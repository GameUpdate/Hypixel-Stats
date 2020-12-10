const { MessageEmbed } = require("discord.js")
const translate = require('@vitalets/google-translate-api');

module.exports = {
    config: {
        name: "translate",
        aliases: ["tr"],
        desc: "Translate text from any language to English",
        usage: [`translate <text>`]
    },
    run: async (server, message, args) => {

        if (!args[0]) { return message.channel.send("I can't translate nothing to english") }

        translate(args.join(" "), { to: 'en' }).then(res => {
            return message.channel.send(res.text);
        }).catch(err => {
            return message.channel.send("Couldn't translate that")
        });
    }
}