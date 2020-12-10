const { MessageEmbed } = require("discord.js")

module.exports = {
    create: async function (channel, user) {
        let server = await Server.findOne({ guildID: channel.guild.id })

        const color = server.color;

        let profile = await Profile.findOne({ userID: user.id, guildID: channel.guild.id })
        if (profile.rooms.open) {
            let chan = channel.guild.channels.cache.find(c => c.name === `${user.username}'s Voice Channel`)
            channel.guild.member(user).voice.setChannel(chan)
        }

        channel.guild.channels.create(user.username, {
            type: 'category', permissionOverwrites: [
                {
                    id: user.id,
                    allow: ['MOVE_MEMBERS', 'VIEW_CHANNEL', 'SEND_MESSAGES'],
                }, {
                    id: client.user.id,
                    allow: ['MOVE_MEMBERS', 'VIEW_CHANNEL', 'SEND_MESSAGES'],
                }, {
                    id: channel.guild.roles.everyone.id,
                    deny: ['VIEW_CHANNEL'],
                },
            ],
        }).then(cat => {
            channel.guild.channels.create(`${user.username}'s Voice Channel`, {
                type: 'voice', parent: cat,
            }).then(vc => {
                channel.guild.channels.create(`${user.username}'s Text Channel`, {
                    parent: cat,
                }).then(async c => {
                    let pf = new MessageEmbed()
                        .setDescription(`Hey ${user}, here is your private category\n\nTo add people to this use \`${server.bot_prefix}add <user>\`\nTo remove people to this use \`${server.bot_prefix}remove <user>\`\nDragging people in and out also adds and removes them from your category\n\nWhenever you **leave the voice channel** your category will be removed\nHave fun in your own private room!`)
                        .setColor(color)
                    await c.send(pf)
                    await vc.createInvite({ reason: `Made for ${user.username}'s private category` }).then(inv => c.send(`discord.gg/${inv.code}`))
                    profile.rooms.open = true
                    profile.save().then(() => {
                        return channel.guild.member(user).voice.setChannel(vc)
                    })
                })
            })
        })
    }
}