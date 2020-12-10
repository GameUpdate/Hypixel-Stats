const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: `setprefix`,
        aliases: ['setp'],
        memberPerms: ['ADMINISTRATOR'],
        admin: true,
        desc: `Change the prefix of the bot`,
        usage: [`setp <new prefix>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) { return message.channel.send("Can't set my prefix to nothing you silly goose") }

        const prefix = server.bot_prefix
        server.bot_prefix = args[0]
        server.save().then(() => {
            return message.channel.send(`My prefix got changed from \`${prefix}\` to \`${args[0]}\``)
        })
    }
}