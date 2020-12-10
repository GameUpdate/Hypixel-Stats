const { MessageEmbed } = require("discord.js")
const animalAPI = require("random-animals-apis");

module.exports = {
    config: {
        name: "fox",
        desc: "Get a picture of a fox"
    },
    run: async (server, message, args) => {
        const color = server.color;

        const link = await animalAPI.getRandomFoxImage()
        let noperms = new MessageEmbed()
            .setTitle(`:fox:`)
            .setURL(link)
            .setImage(link)
            .setColor(color)
        return message.channel.send(noperms)
    }
}