const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "bot",
        aliases: ["bot"],
        desc: "Get links for the bot",
        usage: [`bot`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        let noperms = new MessageEmbed()
            .addField('Invite Me', `[Click Here](https://discord.com/api/oauth2/authorize?client_id=784082016379076618&permissions=8&scope=bot)\n*Admin perms needed*`)
            .addField('Support Server', `[Click Here](https://discord.gg/jYnGZkJtuS)`)
            .setColor(color)
        return message.channel.send(noperms)
    }
}