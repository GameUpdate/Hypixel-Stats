
module.exports = {
    config: {
        name: "joinrole",
        admin: true,
        desc: `Set up a role members will get when joining the discord`,
        usage: [`joinrole`, `joinrole <role>`]
    },
    run: async (server, message, args) => {
        const color = server.color

        if (!args[0]) {
            server.autorole.enabled ? server.autorole.enabled = false : server.autorole.enabled = true
            server.save().then(() => { return message.channel.send(`Join role has been turned ${server.autorole.enabled ? `**ON**` : `**OFF**`}`) })

        } else {
            await message.guild.roles.fetch({ query: args.join(" "), limit: 1 })
            let role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.roles.cache.get(args[0])
            if (!role) return message.channel.send("Couldn't find that role")

            server.autorole.role = role.id
            server.save().then(() => { return message.channel.send(`Join role has been set to the **${role.name}** role`) })
        }
    }
}