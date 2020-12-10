
module.exports = async (client, guild) => {
    if (!guild) return;

    var server = await Server.findOne({ guildID: guild.id });
    if (server) return console.log(`Joined guild: ${guild.name}`)
    const newServer = new Server({ guildID: guild.id, })
    await newServer.save().then(() => console.log(`Joined guild: ${guild.name}`))

    var server = await Server.findOne({ guildID: guild.id });
    readdirSync(`./src/commands/`).forEach(async dirs => {
        const commands = readdirSync(`./src/commands/${dirs}/`).filter(d => d.endsWith('.js'));
        var server = await Server.findOne({ guildID: message.guild.id });
        for (let file of commands) {
            let pull = require(`../../src/commands/${dirs}/${file}`);
            server.cmds.find(c => c[0] === pull.config.name) ? '' : server.cmds.push([pull.config.name, true])
        }
        await server.save()
    })

    guild.fetchInvites().then(guildInvites => {
        client.invites.set(guildInvites, guild.id)
    })

    const members = await guild.members.fetch()
    members.forEach(async member => {
        let user = member.user
        if (user.bot) return
        let profile = await Profile.findOne({ guildID: guild.id, userID: user.id })
        if (profile) return
        const newProfile = new Profile({ guildID: guild.id, userID: user.id, "pf.firstJoin": new Date() })
        newProfile.save().then(() => console.log(`New profile made for: ${user.username}`))
    })
}