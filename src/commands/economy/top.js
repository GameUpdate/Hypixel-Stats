const { MessageEmbed } = require("discord.js")
Pagination = require("discord-paginationembed");

module.exports = {
    config: {
        name: "top",
        desc: "See the leaderboards for the server",
        usage: [`top xp`, `top msgs`, `top bal`, `top bank`, `top invites`, `top gems`]
    },
    run: async (server, message, args) => {
        let prefix = server.bot_prefix
        const color = server.color;

        if (!args[0] || !['xp', 'msgs', 'bal', 'bank', 'invites', 'gems'].includes(args[0].toLowerCase())) return message.channel.send(`Wrong usage, use \`${prefix}top xp\`, \`${prefix}top msgs\`, \`${prefix}top bal\`, \`${prefix}top bank\`, \`${prefix}top invites\` or \`${prefix}top gems\``)

        if (args[0].toLowerCase() === 'xp') {
            Profile.find({ "lvl.level": { $exists: 1 }, guildID: { $eq: message.guild.id } }).sort({ "lvl.level": -1, "lvl.xp": -1 }).then(async lb => {
                const users = await Promise.all(lb.map(async l => {
                    const user = await client.users.fetch(l.userID).catch(() => ({ tag: "Unknown#????", id: l.userID }));
                    return {
                        user,
                        level: l.lvl.level,
                        xp: l.lvl.xp
                    };
                }));
                const FieldsEmbed = new Pagination.FieldsEmbed();
                FieldsEmbed.embed
                    .setColor(color)
                    .setTitle(`Members in ${message.guild.name}`)
    
                FieldsEmbed.setArray(users[0] ? users : [])
                    .setAuthorizedUsers([message.author.id])
                    .setChannel(message.channel)
                    .setElementsPerPage(10)
                    .formatField("** **", (l, index) => `\`${(++index).toString().padStart(2, "0")}. \` ${l.user} • **Level ${l.level}** ↦ \`${l.xp.toLocaleString()} XP\``)
                    .setDisabledNavigationEmojis(['delete'])
                    .setPageIndicator('footer')
                return FieldsEmbed.build();
            })
        } else if (args[0].toLowerCase() === 'msgs') {
            Profile.find({ "pf.msgTotal": { $gt: 0 }, "guildID": { $eq: message.guild.id } }).sort({ "pf.msgTotal": -1 }).then(async lb => {
                const users = await Promise.all(lb.map(async l => {
                    const user = await client.users.fetch(l.userID).catch(() => ({ tag: "Unknown#????", id: l.userID }));
                    return {
                        user,
                        msgTotal: l.pf.msgTotal
                    };
                }));
                const FieldsEmbed = new Pagination.FieldsEmbed();
                FieldsEmbed.embed
                    .setColor(color)
                    .setTitle(`Members in ${message.guild.name}`)
    
                FieldsEmbed.setArray(users[0] ? users : [])
                    .setAuthorizedUsers([message.author.id])
                    .setChannel(message.channel)
                    .setElementsPerPage(10)
                    .formatField("** **", (l, index) => `\`${(++index).toString().padStart(2, "0")}. \` ${l.user} • \`${l.msgTotal.toLocaleString()} Messages\``)
                    .setDisabledNavigationEmojis(['delete'])
                    .setPageIndicator('footer')
                return FieldsEmbed.build();
            })
        } else if (args[0].toLowerCase() === 'bal') {
            Profile.find({ "eco.bal": { $gte: 5000 }, guildID: { $eq: message.guild.id } }).sort({ "eco.bal": -1 }).then(async lb => {
                const users = await Promise.all(lb.map(async l => {
                    const user = await client.users.fetch(l.userID).catch(() => ({ tag: "Unknown#????", id: l.userID }));
                    return {
                        user,
                        bal: l.eco.bal
                    };
                }));
                const FieldsEmbed = new Pagination.FieldsEmbed();
                FieldsEmbed.embed
                    .setColor(color)
                    .setTitle(`Members in ${message.guild.name}`)
    
                FieldsEmbed.setArray(users[0] ? users : [])
                    .setAuthorizedUsers([message.author.id])
                    .setChannel(message.channel)
                    .setElementsPerPage(10)
                    .formatField("** **", (l, index) => `\`${(++index).toString().padStart(2, "0")}. \` ${l.user} • <:Money:759044714853957652>\`${l.bal.toLocaleString()}\``)
                    .setDisabledNavigationEmojis(['delete'])
                    .setPageIndicator('footer')
                return FieldsEmbed.build();
            })
        } else if (args[0].toLowerCase() === 'bank') {
            Profile.find({ "eco.bank": { $gte: 0 }, guildID: { $eq: message.guild.id } }).sort({ "eco.bank": -1 }).then(async lb => {
                const users = await Promise.all(lb.map(async l => {
                    const user = await client.users.fetch(l.userID).catch(() => ({ tag: "Unknown#????", id: l.userID }));
                    return {
                        user,
                        bank: l.eco.bank
                    };
                }));
                const FieldsEmbed = new Pagination.FieldsEmbed();
                FieldsEmbed.embed
                    .setColor(color)
                    .setTitle(`Members in ${message.guild.name}`)
    
                FieldsEmbed.setArray(users[0] ? users : [])
                    .setAuthorizedUsers([message.author.id])
                    .setChannel(message.channel)
                    .setElementsPerPage(10)
                    .formatField("** **", (l, index) => `\`${(++index).toString().padStart(2, "0")}. \` ${l.user} • <:Money:759044714853957652>\`${l.bank.toLocaleString()}\``)
                    .setDisabledNavigationEmojis(['delete'])
                    .setPageIndicator('footer')
                return FieldsEmbed.build();
            })
        } else if (args[0].toLowerCase() === 'invites') {
            Profile.find({ "inv.invites": { $gte: 1 }, guildID: { $eq: message.guild.id } }).sort({ "inv.invites": -1 }).then(async lb => {
                const users = await Promise.all(lb.map(async l => {
                    const user = await client.users.fetch(l.userID).catch(() => ({ tag: "Unknown#????", id: l.userID }));
                    return {
                        user,
                        invitesTotal: l.inv.invitesTotal,
                        invites: l.inv.invites,
                        fakes: l.inv.fakes,
                        left: l.inv.left
                    };
                }));
                const FieldsEmbed = new Pagination.FieldsEmbed();
                FieldsEmbed.embed
                    .setColor(color)
                    .setTitle(`Members in ${message.guild.name}`)
    
                FieldsEmbed.setArray(users[0] ? users : [])
                    .setAuthorizedUsers([message.author.id])
                    .setChannel(message.channel)
                    .setElementsPerPage(10)
                    .formatField("** **", (l, index) => `\`${(++index).toString().padStart(2, "0")}. \` ${l.user} • \`${l.invites}\` Invites (\`${l.invitesTotal}\` Total | \`${l.fakes}\` Fakes | \`${l.left}\` Left)`)
                    .setDisabledNavigationEmojis(['delete'])
                    .setPageIndicator('footer')
                return FieldsEmbed.build();
            })
        } else if (args[0].toLowerCase() === 'gems') {
            Profile.find({ "eco.gems": { $gte: 1 }, guildID: { $eq: message.guild.id } }).sort({ "eco.gems": -1 }).then(async lb => {
                const users = await Promise.all(lb.map(async l => {
                    const user = await client.users.fetch(l.userID).catch(() => ({ tag: "Unknown#????", id: l.userID }));
                    return {
                        user,
                        gems: l.eco.gems
                    };
                }));
                const FieldsEmbed = new Pagination.FieldsEmbed();
                FieldsEmbed.embed
                    .setColor(color)
                    .setTitle(`Members in ${message.guild.name}`)
    
                FieldsEmbed.setArray(users[0] ? users : [])
                    .setAuthorizedUsers([message.author.id])
                    .setChannel(message.channel)
                    .setElementsPerPage(10)
                    .formatField("** **", (l, index) => `\`${(++index).toString().padStart(2, "0")}. \` ${l.user} • 💎\`${l.gems.toLocaleString()}\``)
                    .setDisabledNavigationEmojis(['delete'])
                    .setPageIndicator('footer')
                return FieldsEmbed.build();
            })
        }
    }
}