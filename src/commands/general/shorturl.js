const { MessageEmbed } = require("discord.js")
const fetch = require("node-fetch");

module.exports = {
    config: {
        name: "shorturl",
        aliases: ["shorten", "shortlink", "short"],
        desc: "Shorten a link",
        usage: [`shorten <link>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) return message.channel.send(`Give a url to shorten`)

        const res = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURI(args[0])}`);
        const body = await res.text();

        if (body === "Error: Please enter a valid URL to shorten") {
            return message.channel.send(`You gave an invalid url`)
        }

        return message.channel.send(body)
    }
}