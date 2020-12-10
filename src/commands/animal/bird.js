const { MessageEmbed } = require("discord.js")
const animalAPI = require("random-animals-apis");

module.exports = {
    config: {
        name: "bird",
        desc: "Get a picture of a bird"
    },
    run: async (server, message, args) => {
        const color = server.color;

        const link = await animalAPI.getRandomBirdImage()
        let noperms = new MessageEmbed()
            .setTitle(`:bird:`)
            .setImage(link)
            .setColor(color)
        return message.channel.send(noperms)
    }
}