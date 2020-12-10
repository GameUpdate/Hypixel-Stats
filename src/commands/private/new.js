const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "new",
        desc: `Create a private category for yourself`,
        usage: [`new`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        let profile = await Profile.findOne({ userID: message.author.id, guildID: message.guild.id })
        if (profile.rooms.open) {
            message.channel.send(`You already have a private category, here's the text channel`)
            let chan = channel.guild.channels.cache.find(c => c.name === `${user.username}'s Text Channel`)
            message.channel.send(chan.toString())
        }

        message.guild.channels.create(message.author.username, {
            type: 'category', permissionOverwrites: [
                {
                    id: message.author.id,
                    allow: ['MOVE_MEMBERS', 'VIEW_CHANNEL', 'SEND_MESSAGES'],
                }, {
                    id: client.user.id,
                    allow: ['MOVE_MEMBERS', 'VIEW_CHANNEL', 'SEND_MESSAGES'],
                }, {
                    id: message.guild.roles.everyone.id,
                    deny: ['VIEW_CHANNEL'],
                },
            ],
        }).then(cat => {
            message.guild.channels.create(`${message.author.username}'s Voice Channel`, {
                type: 'voice', parent: cat,
            }).then(vc => {
                message.guild.channels.create(`${message.author.username}'s Text Channel`, {
                    parent: cat,
                }).then(async c => {
                    let pf = new MessageEmbed()
                        .setDescription(`Hey ${message.author}, here is your private category\n\nTo add people to this use \`${server.bot_prefix}add <user>\`\nTo remove people to this use \`${server.bot_prefix}remove <user>\`\n\nWhenever you **leave the voice channel** your category will be removed\nHave fun in your own private room!`)
                        .setFooter('Below is an invitation to your voice channel you can send to members')
                        .setColor(color)
                    await c.send(pf)
                    await vc.createInvite({ reason: `Made for ${message.author.username}'s private category` }).then(inv => c.send(`discord.gg/${inv.code}`))
                    message.channel.send('Private category made, here is your text channel')
                    message.channel.send(c.toString())
                    profile.rooms.open = true
                    profile.save().then(() => {
                        message.member.voice.channel ? message.member.voice.setChannel(vc) : ''
                        setTimeout(() => {
                            if (message.member.voice.channel && message.member.voice.channelID === vc.id) return
                            c.delete()
                            vc.delete()
                            cat.delete()
                        }, 10000)
                    })
                })
            })
        })
    }
}