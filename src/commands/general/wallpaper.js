const { MessageEmbed, MessageAttachment } = require("discord.js")
var gis = require('g-i-s');

module.exports = {
    config: {
        name: "wallpaper",
        aliases: ["wp"],
        desc: "Get a HD wallpaper about a certain topic",
        usage: [`wp <topic>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) {
            gis("wallpaper 4k 1920x1080", logResults);
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

                message.channel.send(imgs[num].url)
                return message.channel.send(`To get a specific type of wallpaper use \`${server.bot_prefix}wp <type>\``)
            }
        } else {
            gis(args.join(" ") + " wallpaper 4k 1920x1080", logResults);
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

                return message.channel.send(imgs[num].url)
            }
        }
    }
}