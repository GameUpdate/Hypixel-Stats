const { MessageEmbed } = require("discord.js")
var gis = require('g-i-s');

module.exports = {
    config: {
        name: "search",
        aliases: ["pic"],
        desc: "Get a random image from the internet about a topic",
        usage: [`pic <topic>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) { return message.channel.send("Can't search for an image of nothing") }

        gis(args.join(" "), logResults);
        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }

        function logResults(error, results) {
            var resp = JSON.stringify(results, null, '  ')
            var imgs = JSON.parse(resp)
            var num = getRandomInt(imgs.length)

            while (imgs[num].width > 1920 && imgs[num].height > 1080) {
                num = getRandomInt(imgs.length)
            }

            let noperms = new MessageEmbed()
                .setTitle(args.join(" "))
                .setURL(imgs[num].url)
                .setImage(imgs[num].url)
                .setColor(color)
            return message.channel.send(noperms)
        }
    }
}