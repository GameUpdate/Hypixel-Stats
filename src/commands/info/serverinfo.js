const { MessageEmbed } = require("discord.js")
const moment = require('moment')

module.exports = {
    config: {
        name: `serverinfo`,
        aliases: ['sinfo', 'si'],
        desc: "Get information of this server",
        usage: [`sinfo`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        let premium = '<:noo:759043247888138300>'; let tier = '0 (No Level)'; let bans = await message.guild.fetchBans()
        if (server.premium) premium = '<:yess:759043247791276072>'
        if (message.guild.PremiumTier == 1) tier = `1 (Tier 1)`
        if (message.guild.PremiumTier == 2) tier = `2 (Tier 2)`
        if (message.guild.PremiumTier == 3) tier = `3 (Tier 3)`
        let sInfo = new MessageEmbed()
            .setColor(color)

        const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: '2-digit' })
        const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(new Date(message.guild.createdTimestamp))

        const banner = message.guild.bannerURL({ dynamic: true }) ? `Banner: [Click here](${message.guild.bannerURL({ dynamic: true })})` : `Banner: Not set`
        const splash = message.guild.splashURL({ dynamic: true }) ? `Splash: [Click here](${message.guild.splashURL({ dynamic: true })})` : `Splash: Not set`
        const discovery = message.guild.discoverySplashURL({ dynamic: true }) ? `Discovery: [Click here](${message.guild.discoverySplashURL({ dynamic: true })})` : `Discovery: Not set`

        let owner = await message.guild.members.fetch(message.guild.ownerID)
        sInfo.setTitle(`${message.guild.name} (ID: ${message.guild.id})`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setDescription(`${premium} Premium Server`)
            .setURL(message.guild.iconURL({ dynamic: true }))
            .addField(`Owner:`, `${owner.user.tag}\n${owner}`, true)
            .addField(`Boost Status:`, tier, true)
            .addField(`Created On:`, `${day}/${month}/${year}\n\`(${moment(new Date(message.guild.createdTimestamp)).fromNow()})\``, true)
            .addField(`Members:`, `<:online:759044009900376104> \`${message.guild.members.cache.filter(r => r.presence.status !== 'offline').size} Online\`\n<:offline:759044009577807893> \`${message.guild.members.cache.filter(r => r.presence.status === 'offline').size} Offline\`\n<:user2:750150492365127682> \`${message.guild.members.cache.filter(r => !r.user.bot).size} Users\`\n<:settings1:750150492193161317> \`${message.guild.members.cache.filter(r => r.user.bot).size} Bots\``, true)
            .addField(`Overview:`, `Text : \`${message.guild.channels.cache.filter(r => r.type == "text").size}\`\nVoice: \`${message.guild.channels.cache.filter(r => r.type == "voice").size}\`\nRoles:\`${message.guild.roles.cache.size}\`\nBans :\`${bans.size}\``, true)
            .addField(`Images:`, `Icon: [Click Here](${message.guild.iconURL({ dynamic: true })})\n${banner}\n${splash}\n${discovery}`, true)
        return message.channel.send(sInfo)
    }
}