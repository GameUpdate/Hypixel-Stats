Pagination = require("discord-paginationembed");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    config: {
        name: "roleall",
        aliases: ["rall"],
        desc: "Give every user in the discord a role",
        usage: [`rall <role>`],
        admin: true,
    },
    run: async (server, message, args) => {
        const color = server.color

        if (!args[0]) return message.channel.send('You need give a role')
        await message.guild.roles.fetch({ query: args[0], limit: 1 })
        const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args[0].toLowerCase())) || message.guild.roles.cache.get(args[0])
        if (!role) return message.channel.send('You need give a role')

        let fails = []
        let t = 0
        let a = 0
        message.guild.members.fetch().then((mm) => {
            mm.forEach(m => {
                if (!m.user.bot) {
                    try {
                        m.roles.has(role) ? '' : m.roles.add(role)
                        t++
                    } catch {
                        fails.push(m.id)
                    }
                    a++
                    sleep(500)
                }
            })

            message.channel.send(`Gave the **${role.name}** role to \`${t}/${a}\` members in the server.`)
            if (fails.length > 1) {
                const FieldsEmbed = new Pagination.FieldsEmbed();
                FieldsEmbed.embed
                    .setColor(color)
                    .setTitle(`Failed for these users:`)

                FieldsEmbed.setArray(fails)
                    .setAuthorizedUsers([message.author.id])
                    .setChannel(message.channel)
                    .setElementsPerPage(10)
                    .formatField("** **", (e) => `<@${e}>`)
                    .setDisabledNavigationEmojis(['delete'])
                    .setPageIndicator('footer')
                return FieldsEmbed.build();
            } else { return }
        })
    }
}