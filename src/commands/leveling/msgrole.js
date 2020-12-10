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
        name: "msgrole",
        desc: "See, add or remove roles per amount of messages",
        usage: [`msgrole list`, `msgrole add <amount of messages> <role>`, `msgrole remove <amount of messages>`],
        owner: true,
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) {
            return message.channel.send(`See, add or remove roles per amount of messages with \`${server.bot_prefix}msgrole list\`, \`${server.bot_prefix}msgrole add <amount of messages> <role>\` or \`${server.bot_prefix}msgrole remove <amount of messages>\``)
        } else if ([`list`, `l`].includes(args[0].toLowerCase())) {
            if (!server.msgrole[0]) return message.channel.send(`No msg role has been set on this server`)
            const FieldsEmbed = new Pagination.FieldsEmbed();
            FieldsEmbed.embed
                .setColor(color)
                .setTitle(`Message roles in ${message.guild.name}`)

            FieldsEmbed.setArray(server.msgrole)
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .setElementsPerPage(10)
                .formatField("** **", (e) => `**${e.key}** Messages ↦ <@&${e.value}>`)
                .setDisabledNavigationEmojis(['delete'])
                .setPageIndicator('footer')
            return FieldsEmbed.build();
        } else if (['add', 'create'].includes(args[0].toLowerCase())) {

            const msgs = args[1];
            if (!msgs) return message.channel.send(`Invalid amount of messages given`)
            if (isNaN(msgs) || msgs <= 0) return message.channel.send(`Invalid number`)

            args.shift()
            args.shift()
            if (!args[0]) return message.channel.send('You need give a role')
            await message.guild.roles.fetch({ query: args.join(" "), limit: 1 })
            const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.roles.cache.get(args.join(" "))
            if (!role) return message.channel.send('You need give a role')

            if (server.msgrole.some(r => r.key === msgs)) {
                return message.channel.send(`There's is already a role set for that amount of messages, you cannot set multiple to the same one`)
            } else {
                server.msgrole.push({
                    key: msgs,
                    value: role.id
                })
            }
            server.save().then(() => { return message.channel.send(`Msg role added for **${msgs}** messages giving the **${role.name}** role`) })

        } else if (["rem", "del", "delete"].includes(args[0].toLowerCase())) {

            const msgs = args[1];
            if (!msgs) return message.channel.send(`Invalid amount of messages given`)
            if (isNaN(msgs) || msgs <= 0) return message.channel.send(`Invalid number`)

            let rr = server.msgrole.find(rr => rr.key === msgs)
            if (!rr) return message.channel.send(`Couldn't find an message role for that amount of messages`)

            server.msgrole = removeItemOnce(server.msgrole, rr)
            server.save().then(() => { return message.channel.send(`Msg role deleted for **${msgs}** messages`) })

        }
    }
}