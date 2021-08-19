const { MessageEmbed } = require("discord.js")
const ms = require('ms')

module.exports = {
    config: {
        name: "help",
        aliases: ['h'],
        description: "Get bot ping to the api and host",
    },
    run: async (server, message, args, pf) => {

        let pingEmbed = new MessageEmbed()
            .setColor(pf.color)
            .setTitle("Hypixel Stats | Help")
            .setDescription(`**${server.prefix}stats [ign]** ↦ Get Hypixel stats on a player
        **${server.prefix}color [color]** ↦ Change your embed color
        **${server.prefix}link <ign>** ↦ Link an ign to your discord account
        **${server.prefix}ping** ↦ Get the bot's ping
        **${server.prefix}info** ↦ Get info about the bot
        **${server.prefix}invite** ↦ Get an invite link for the bot\n
        **${server.prefix}setprefix <prefix>** ↦ Change the bot's prefix`)
            .setFooter(`<> ↦ Necessary Arguments | [] ↦ Optional Arguments`)

        return message.channel.send({content: `\u200b`, embeds: [pingEmbed]})
    }
}