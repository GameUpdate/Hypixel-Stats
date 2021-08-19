const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: `setprefix`,
        aliases: ['setp'],
        admin: true,
        description: `Change the prefix of the bot`,
    },
    run: async (server, message, args) => {

        if (!args[0]) { return message.channel.send("Can't set my prefix to nothing you silly goose") }

        const prefix = server.prefix
        server.prefix = args[0]
        server.save().then(() => {
            return message.channel.send(`My prefix got changed from \`${prefix}\` to \`${args[0]}\``)
        })
    }
}