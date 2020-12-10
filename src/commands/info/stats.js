const { MessageEmbed } = require("discord.js")
const ms = require('ms')
const si = require('systeminformation');

module.exports = {
    config: {
        name: "stats",
        aliases: ['statistics'],
        desc: "Get stats about me",
        usage: [`stats`]
    },
    run: async (server, message, args) => {
        const color = server.color

        let CpuUsed; let RAMUsed; let RAMMax; let RAMPercent;
        await si.currentLoad().then(data => CpuUsed = `${(data.currentload).toFixed(2)}%`).catch(error => console.error(error));
        await si.mem().then(data => { RAMMax = `${((data.total) / 1070386380.80).toFixed(2)} GB`; RAMUsed = `${((data.used) / 1070386380.80).toFixed(2)} GB` }).catch(error => console.error(error));
        RAMPercent = `${((parseFloat(RAMUsed) / parseFloat(RAMMax)) * 100).toFixed(2)}%`

        let totalMembers = 0; let totalGuilds = client.guilds.cache.array()
        for (i = 0; i < totalGuilds.length; i++) {
            totalMembers = totalMembers + parseInt(totalGuilds[i].memberCount)
        }

        const MstatsEmbed = new MessageEmbed().setAuthor(`${client.user.username} Stats`)
            .setDescription(`Made by <:game:783378966076850197>\`${client.config.ownerTag}\`\nDependencies: <:djs:783379389676519454>\`v12.5.1\` and <:nodejs:783379396241260545>\`v12.18.4\``)
            .addField(`<:timer:750150492130246698> Uptime`, `${ms(client.uptime)}`, true)
            .addField(`<:settings1:750150492193161317> CPU Usage`, `${CpuUsed}`, true)
            .addField(`<:settings2:750150490708377701> RAM Usage`, `${RAMUsed} / ${RAMMax} (${RAMPercent})`, true)
            .addField(`<:server:750150492210069604> Shards`, `1 (Currently in Shard #1)`, true)
            .addField(`<:user1:750150492197355571> Guilds`, `${client.guilds.cache.size} (${client.guilds.cache.size} on this shard)`, true)
            .addField(`<:user2:750150492365127682> Users`, `${totalMembers} Users`, true)
            .addField(`<:announcements:750150489659932762> Commands Executed`, cmdTotal, true)
            .addField(`<:discussion:750150490846920794>  Messages Received`, msgsTotal, true)
            .addField('\u200b', '\u200b', true)
            .setColor(color)
        message.channel.send(MstatsEmbed)
    }
}