const { MessageEmbed, MessageAttachment } = require("discord.js")
const GameCord = require('gamecord');

module.exports = {
    config: {
        name: "snake",
        desc: "Play a game of snake",
        usage: [`snake`]
    },
    run: async (server, message, args) => {

        new GameCord.SnakeGame(message)
            .setTitle(`${message.author.username}'s snake game`)
            .setColor(server.color)
            .setMaxTime(60000)
            .run()
    }
}