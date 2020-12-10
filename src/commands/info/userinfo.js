const { MessageEmbed } = require("discord.js")
const moment = require('moment')

module.exports = {
    config: {
        name: "userinfo",
        aliases: ['ui', 'uinfo'],
        desc: "Get information about a user",
        usage: [`ui <user>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        args[0] ? await message.guild.members.fetch({ query: args.join(" "), limit: 1 }) : await message.guild.members.fetch(message.author.id)
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user

        const profile = await Profile.findOne({ guildID: message.guild.id, userID: message.author.id });
        if (profile.pf.firstJoin != 'Couldn\'t find when') {
            var dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: '2-digit' })
            var [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(new Date(profile.pf.firstJoin))
        }

        const dateTimeFormat2 = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: '2-digit' })
        const [{ value: month2 }, , { value: day2 }, , { value: year2 }] = dateTimeFormat2.formatToParts(new Date(message.guild.member(user.id).joinedAt))
        const [{ value: month3 }, , { value: day3 }, , { value: year3 }] = dateTimeFormat2.formatToParts(new Date(user.createdAt))

        let roles = [];
        message.guild.member(user.id).roles.cache.forEach(r => {
            if (r.name.includes('everyone')) { } else {
                roles.push(r)
            }
        })
        if (roles.length < 1) {
            roles = ['No roles']
        } else {
            roles.sort(function (a, b) {
                return b.position - a.position
            })
        }

        let presences = user.presence.activities.map((a, i) => a.name === 'Spotify' ? `<:spotify:783379402602840114> Listening to **${a.details}** by **${a.state}**` : (a.name != 'Custom Status' ? `🎮 Playing **${a.name}**` : (a.emoji ? `${a.emoji} ${a.state}` : `${a.state}`))).join(`\n`)

        let dude = parseInt(profile.pf.inviter) ? `<@${profile.pf.inviter}>` : profile.pf.inviter
        let pf = new MessageEmbed()
            .setTitle(user.tag)
            .setDescription('<:user1:750150492197355571> <@' + user + '> (ID: ' + user.id + ')\n\n' + presences)
            .addField('Created on:', `${day3}/${month3}/${year3} \`(${(moment(new Date(user.createdAt)).fromNow())})\``, true)
            .addField(`\u200b`, `\u200b`, true)
            .addField('Last Joined on:', `${day2}/${month2}/${year2} \`(${(moment(new Date(message.guild.member(user.id).joinedAt)).fromNow())})\``, true)
        profile.pf.firstJoin != 'Couldn\'t find when' ? pf.addField('First Joined on:', `${day}/${month}/${year} \`(${(moment(new Date(profile.pf.firstJoin)).fromNow())})\``, true) : pf.addField('First Joined on:', profile.pf.firstJoin, true)
        pf.addField(`\u200b`, `\u200b`, true)
            .addField('Invited by:', `${dude}`, true)
            .addField('Invite Stats:', `\`${profile.inv.invites}\` Invites | (\`${profile.inv.invitesTotal}\` Total | \`${profile.inv.fakes}\` Fakes | \`${profile.inv.left}\` Left)`)
            .addField('Roles:', roles.join(" "))
            .setURL(user.avatarURL({ dynamic: true, size: 1024 }))
            .setThumbnail(user.avatarURL({ dynamic: true, size: 1024 }))
            .setColor(color)
        return message.channel.send(pf)
    }
}