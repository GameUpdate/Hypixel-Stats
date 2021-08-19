const { MessageEmbed } = require("discord.js");

module.exports = {
    config: {
        name: "invite",
        aliases: ['inv'],
        description: "Get bot invite link",
    },
    run: async (server, message, args, pf) => {

        let pingEmbed = new MessageEmbed()
            .setColor(pf.color)
            .setTitle("Invite Link")
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=873510013983916042&permissions=0&scope=bot`)

        return message.channel.send({content: `\u200b`, embeds: [pingEmbed]})
    }
}