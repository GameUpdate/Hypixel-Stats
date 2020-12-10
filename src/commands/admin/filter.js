function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

module.exports = {
    config: {
        name: "filter",
        admin: true,
        desc: `Filter or not a channel from bot messages or see all of them and if they're enabled or not`,
        usage: [`filter <channel>`, `filter list`]
    },
    run: async (server, message, args) => {
        const color = server.color

        if (["l", "list"].includes(args[0].toLowerCase())) {
            if (server.filter.length < 1) return message.channel.send(`No channel is being filtered out in the server atm`)
            const FieldsEmbed = new Pagination.FieldsEmbed();
            FieldsEmbed.embed
                .setColor(color)
                .setTitle(`Filtered out channels in ${message.guild.name}`)

            FieldsEmbed.setArray(server.filter)
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .setElementsPerPage(10)
                .formatField("** **", (e) => `<#${e}> ↦ \`${e}\``)
                .setDisabledNavigationEmojis(['delete'])
                .setPageIndicator('footer')
            return FieldsEmbed.build();
        } else {
            let channel = message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.type === 'text' && c.name.toLowerCase().includes(args[0].toLowerCase())) || message.guild.channels.cache.find(c => c.type === 'text' && c.name.toLowerCase() === args[0].toLowerCase())
            if (!channel) return message.channel.send(`Couldn't find that channel, please use a correct one`)

            let info = await server.filter.find(c => c === channel.id)
            if (info) {
                server.filter = removeItemOnce(server.filter, info)
                server.save().then(() => {
                    return message.channel.send(`${channel.toString()} is **no longer** being filtered out`)
                })
            } else {
                server.filter.push(channel.id)
                server.save().then(() => {
                    return message.channel.send(`${channel.toString()} is **now** being filtered out`)
                })
            }
        }
    }
}