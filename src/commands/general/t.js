const { MessageEmbed } = require("discord.js")
const ms = require('ms')

module.exports = {
    config: {
        name: "t",
        desc: "Get bot ping to the api and host",
        usage: [`t`]
    },
    run: async (server, message, args) => {

        await message.guild.channels.cache.get('809762513553195031').join()
    }
}