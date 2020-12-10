const { MessageEmbed } = require("discord.js")
var redditImageFetcher = require("reddit-image-fetcher")

module.exports = {
    config: {
        name: "meme",
        desc: "Get a meme from a random subreddit",
        usage: [`meme`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        redditImageFetcher.fetch({ nsfw: false }).then((m) => {
            let noperms = new MessageEmbed()
                .setDescription(`[${m[0].title}](${m[0].postLink})`)
                .setImage(m[0].image)
                .setColor(color)
                .setFooter(`r/${m[0].subreddit}`)
            return message.channel.send(noperms)
        })
    }
}