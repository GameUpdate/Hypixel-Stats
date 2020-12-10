const { MessageEmbed } = require("discord.js")
const request = require('node-fetch');

module.exports = {
    config: {
        name: "porn",
        nsfw: true,
        desc: `Get random porn`,
        usage: [`porn`],
    },
    run: async (server, message, args) => {
        const color = server.color;

        const type = ['boobs', 'pussy', 'ass', 'missionary', 'cowgirl', 'doggystyle', 'blowjob', 'cumshot']
        let noperms = new MessageEmbed()
            .setColor(color)

        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }

        let nsfw = type[getRandomInt(type.length)]

        request(`https://love-you.xyz/api/v2/${nsfw}`)
            .then(res => res.json())
            .then(data => {
                noperms.setTitle(`:hot_face: ${nsfw.charAt(0).toUpperCase() + nsfw.slice(1)} pic`)
                noperms.setURL(data.url)
                noperms.setImage(data.url)
                return message.channel.send(noperms)
            })
    }
}