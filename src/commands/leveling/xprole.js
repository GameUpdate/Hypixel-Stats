Pagination = require("discord-paginationembed");

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

module.exports = {
    config: {
        name: "xprole",
        desc: "See, add or remove roles per xp level",
        usage: [`xprole list`, `xprole add <level> <role>`, `xprole remove <level>`],
        owner: true,
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) {
            return message.channel.send(`See, add or remove roles per xp level with \`${server.bot_prefix}xprole list\`, \`${server.bot_prefix}xprole add <level> <role>\` or \`${server.bot_prefix}xprole remove <level>\``)
        } else if ([`list`, `l`].includes(args[0].toLowerCase())) {
            if (!server.xprole[0]) return message.channel.send(`No XP role has been set on this server`)
            const FieldsEmbed = new Pagination.FieldsEmbed();
            FieldsEmbed.embed
                .setColor(color)
                .setTitle(`XP roles in ${message.guild.name}`)

            FieldsEmbed.setArray(server.xprole)
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .setElementsPerPage(10)
                .formatField("** **", (e) => `Level **${e.key}** ↦ <@&${e.value}>`)
                .setDisabledNavigationEmojis(['delete'])
                .setPageIndicator('footer')
            return FieldsEmbed.build();
        } else if (['add', 'create'].includes(args[0].toLowerCase())) {

            const level = args[1];
            if (!level) return message.channel.send(`Invalid level given`)
            if (isNaN(level) || level <= 0) return message.channel.send(`Invalid number`)

            args.shift()
            args.shift()
            if (!args[0]) return message.channel.send('You need give a role')
            await message.guild.roles.fetch({ query: args.join(" "), limit: 1 })
            const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.roles.cache.get(args.join(" "))
            if (!role) return message.channel.send('You need give a role')

            if (server.xprole.some(r => r.key === level)) {
                return message.channel.send(`There's is already a role set for that rank, you cannot set multiple to the same one`)
            } else {
                server.xprole.push({
                    key: level,
                    value: role.id
                })
            }
            server.save().then(() => { return message.channel.send(`XP role added for level **${level}** giving the **${role.name}** role`) })

        } else if (["rem", "del", "delete"].includes(args[0].toLowerCase())) {

            const level = args[1];
            if (!level) return message.channel.send(`Invalid level given`)
            if (isNaN(level) || level <= 0) return message.channel.send(`Invalid number`)

            let rr = server.xprole.find(rr => rr.key === level)
            if (!rr) return message.channel.send(`Couldn't find an XP role for that level`)

            server.xprole = removeItemOnce(server.xprole, rr)
            server.save().then(() => { return message.channel.send(`XP role deleted for level **${level}**`) })

        }
    }
}