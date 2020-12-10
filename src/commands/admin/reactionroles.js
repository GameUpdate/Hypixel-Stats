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
        name: "reactionroles",
        aliases: ["rr", "reactrole", `reactionrole`],
        desc: "Reaction roles; add them, remove them or list them via this command",
        usage: [`rr add <role> <emote> <message ID>`, `rr del <emote> <message ID>`, `rr list`],
        admin: true,
    },
    run: async (server, message, args) => {
        const color = server.color

        if (!args[0]) {
            return message.channel.send(`Use this to manage reaction roles; \`${server.bot_prefix}rr add <message ID> <emote>\`, \`${server.bot_prefix}rr del <message ID> <emote>\` or \`${server.bot_prefix}rr list\` to see them all`)
        } else if (["add", "create"].includes(args[0].toLowerCase())) {

            if (!args[1]) return message.channel.send('You need give a role')
            await message.guild.roles.fetch({ query: args[1], limit: 1 })
            const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args[1].toLowerCase())) || message.guild.roles.cache.get(args[1])
            if (!role) return message.channel.send('You need give a role')

            if (!args[2]) return message.channel.send('You need use a valid emoji from this server')
            const emoji = client.emojis.cache.find(e => e.name.toLowerCase().includes(args[2].toLowerCase())) || client.emojis.cache.get(args[2].substring(args[2].length - 19, args[2].length - 1)) || client.emojis.cache.get(args[2]) || message.guild.emojis.cache.find(e => e.name.toLowerCase().includes(args[2].toLowerCase())) || message.guild.emojis.cache.get(args[2])
            if (!emoji) return message.channel.send('You need use a valid emoji from this server')

            if (!args[3]) return message.channel.send('Message ID not found')
            const msg = await message.channel.messages.fetch(args[3] || message.id);
            if (!msg) return message.channel.send('Message not found')

            const rr = {
                message: msg.id,
                channel: msg.channel.id,
                guild: msg.guild.id,
                emote: emoji,
                role: role
            }
            msg.react(emoji)
            server.reactionroles.push(rr)
            server.save().then(() => { return message.channel.send(`Reaction role added`) })

        } else if (["rem", "del", "delete"].includes(args[0].toLowerCase())) {

            if (!args[1]) return message.channel.send('You need use a valid emoji from this server')
            const emoji = client.emojis.cache.find(e => e.name.toLowerCase().includes(args[1].toLowerCase())) || client.emojis.cache.get(args[1].substring(args[1].length - 19, args[1].length - 1)) || client.emojis.cache.get(args[1]) || message.guild.emojis.cache.find(e => e.name.toLowerCase().includes(args[1].toLowerCase())) || message.guild.emojis.cache.get(args[1])
            if (!emoji) return message.channel.send('You need use a valid emoji from this server')

            if (!args[2]) return message.channel.send('Message ID not found')
            const msg = await message.channel.messages.fetch(args[2]);
            if (!msg) return message.channel.send('Message not found.')

            let del = server.reactionroles.find(rr => rr.message === msg.id && rr.emote === emoji.id)
            if (!del) return message.channel.send(`Couldn't find a reaction role for that message ID or emote`)

            try { msg.reactions.cache.get(emoji.id).remove() } catch { }
            server.reactionroles = removeItemOnce(server.reactionroles, del)
            server.save().then(() => { return message.channel.send(`Reaction role deleted`) })

        } else if (["list", "l"].includes(args[0].toLowerCase())) {
            if (!server.reactionroles[0]) return message.channel.send(`No reaction roles have been set up in this server`)
            const FieldsEmbed = new Pagination.FieldsEmbed();
            FieldsEmbed.embed
                .setColor(color)
                .setTitle(`Reaction Roles in ${message.guild.name}`)

            FieldsEmbed.setArray(server.reactionroles)
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .setElementsPerPage(10)
                .formatField("** **", (e) => `[${e.message}](https://discord.com/channels/${e.guild}/${e.channel}/${e.message}) • ${message.guild.emojis.cache.get(e.emote)} ↦ ${message.guild.roles.cache.get(e.role)}`)
                .setDisabledNavigationEmojis(['delete'])
                .setPageIndicator('footer')
            return FieldsEmbed.build();
        }
    }
}