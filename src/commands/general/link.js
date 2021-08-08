const { MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
    config: {
        name: "link",
        aliases: ['l'],
        desc: "Link an ign to your discord",
        usage: [`link <ign>`]
    },
    run: async (server, message, args, pf) => {

        if (!args[0]) {
            return message.channel.send(`Didn't give any IGN to link to`)
        } else {
            pf.ign = args[0]
            await pf.save()
            return message.channel.send(`You linked your account to \`${args[0]}\``)
        }
    }
}