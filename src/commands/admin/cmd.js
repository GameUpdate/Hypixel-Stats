function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

module.exports = {
    config: {
        name: "cmd",
        admin: true,
        desc: `Toggle commands to enable them or not in your server or see all of them and if they're enabled or not`,
        usage: [`cmd <command>`, `cmd list`]
    },
    run: async (server, message, args) => {
        const color = server.color

        if (["l", "list"].includes(args[0].toLowerCase())) {
            const FieldsEmbed = new Pagination.FieldsEmbed();
            FieldsEmbed.embed
                .setColor(color)
                .setTitle(`Commands in ${message.guild.name}`)

            FieldsEmbed.setArray(server.cmds)
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .setElementsPerPage(10)
                .formatField("** **", (e) => `${e[1] === 'true' ? '<:yess:759043247791276072>' : '<:noo:759043247888138300>'} ▸ ${server.bot_prefix}${e[0]}`)
                .setDisabledNavigationEmojis(['delete'])
                .setPageIndicator('footer')
            return FieldsEmbed.build();
        } else {
            let command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]) || client.commands.get(args[0].toLowerCase()));
            if (!command) return message.channel.send(`Couldn't find that command, please use a correct one`)

            let info = await server.cmds.find(c => c[0] === command.config.name)
            info[1] === 'true' ? status = true : status = false
            const newS = !status
            server.cmds = removeItemOnce(server.cmds, info)
            server.save().then(() => {
                server.cmds.push([command.config.name, newS])
                server.save().then(() => {
                    return message.channel.send(`The \`${command.config.name}\` command has been toggled ${newS ? '**ON**' : '**OFF**'}`)
                })
            })
        }
    }
}