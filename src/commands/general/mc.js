const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "mc",
        desc: "Get live information about a minecraft server",
        usage: [`mc <server ip>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) return message.channel.send(`Get live info about a sever by giving an ip, use \`${server.bot_prefix}mc <ip>\``)

        return message.channel.send(`http://status.mclive.eu/Minecraft/${args[0]}/25565/banner.png`)
    }
}