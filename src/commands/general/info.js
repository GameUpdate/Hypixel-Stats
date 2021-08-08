const { MessageEmbed } = require("discord.js");
const { copyFileSync } = require("fs");
const ms = require('ms')
const si = require('systeminformation');

module.exports = {
    config: {
        name: "info",
        aliases: ['i'],
        desc: "Get bot info",
        usage: [`info`]
    },
    run: async (server, message, args, pf) => {

        let CpuUsed; let RAMUsed; let RAMMax; let RAMPercent;
        await si.currentLoad().then(data => CpuUsed = `${(data.currentload).toFixed(2)}%`).catch(error => console.error(error));
        await si.mem().then(data => { RAMMax = `${((data.total) / 1070386380.80).toFixed(2)} GB`; RAMUsed = `${((data.used) / 1070386380.80).toFixed(2)} GB` }).catch(error => console.error(error));
        RAMPercent = `${((parseFloat(RAMUsed) / parseFloat(RAMMax)) * 100).toFixed(2)}%`

        let totalMembers = 0; let totalGuilds = Array.from(client.guilds.cache)
        for (i = 0; i < totalGuilds.length; i++) {
            totalMembers = totalMembers + parseInt(totalGuilds[i][1].memberCount)
        }

        let pingEmbed = new MessageEmbed()
            .setColor(pf.color)
            .setTitle("Hypixel Stats | Info")
            .setDescription(`Made by <:game:873909546723213312>\`Game#0005\`\n<:djs:873908889110847539> Discord.JS: **v13.0.1** | <:nodejs:873908889337352242> Node.JS: **v15.7.0**\n
            Guild: \`${client.guilds.cache.size}\` | Users \`${totalMembers}\`
            CPU Usage: \`${CpuUsed}\` | RAM Usage \`${RAMUsed} / ${RAMMax} (${RAMPercent}%)\`
            Commands Ran: \`${cmdTotal}\` | Messages Received: \`${msgsTotal}\`
            \nBot Uptime: \`${ms(client.uptime)}\`\nInvite link: [Click here](https://discord.com/api/oauth2/authorize?client_id=873510013983916042&permissions=0&scope=bot)`)

        return message.channel.send({content: `\u200b`, embeds: [pingEmbed]})
    }
}