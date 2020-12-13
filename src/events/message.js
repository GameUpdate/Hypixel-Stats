const { readdirSync } = require("fs")

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') {
        dude = await client.users.fetch(client.config.ownerID);
        return dude.send(`DMed by: \`${message.author.tag}\`\nContent: \`\`\`${message.content}\`\`\``)
    }
    if (!message.guild) return

    const server = await Server.findOne({ guildID: message.guild.id });
    const args = message.content.slice(server.bot_prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const now = Date.now();

    readdirSync(`./src/commands/`).forEach(async dirs => {
        const commands = readdirSync(`./src/commands/${dirs}/`).filter(d => d.endsWith('.js'));
        const server = await Server.findOne({ guildID: message.guild.id });
        for (let file of commands) {
            let pull = require(`../../src/commands/${dirs}/${file}`);
            server.cmds.find(c => c[0] === pull.config.name) ? '' : server.cmds.push([pull.config.name, true])
        }
        await server.save()
    })

    message.guild.fetchInvites().then(guildInvites => {
        client.invites.set(guildInvites, message.guild.id)
    })

    const members = await message.guild.members.fetch()
    members.forEach(async member => {
        let user = member.user
        if (user.bot) return
        let profile = await Profile.findOne({ guildID: message.guild.id, userID: user.id })
        if (profile) return
        const newProfile = new Profile({ guildID: message.guild.id, userID: user.id, "pf.firstJoin": new Date(message.member.joinedAt) })
        newProfile.save().then(() => console.log(`New profile made for: ${user.username}`))
    })

    var profile = await Profile.findOne({ guildID: message.guild.id, userID: message.author.id });
    if (profile.lvl.canXP) {
        const nxtLvl = server.leveling.nxtLevel * (Math.pow(2, profile.lvl.level) - 1);
        profile.lvl.xp += (Math.floor(Math.random() * Math.floor(server.leveling.xpMax)) + server.leveling.xpMin)
        profile.lvl.canXP = !profile.lvl.canXP

        if (profile.lvl.xp >= nxtLvl) {
            profile.lvl.level++
            if (server.logs.enabled) {
                let channel = message.guild.channels.cache.get(server.logs.channel)
                if (!channel) return
                channel.send(`GG! ${message.author} leveled up to level ${profile.lvl.level}`)
            }
            const id = server.xprole.find(r => r.key === `${profile.lvl.level}`)
            if (id) {
                const role = await message.guild.roles.fetch(role)
                if (role) {
                    message.member.roles.add(role)
                }
            }
        }

        profile.pf.msgTotal++
        profile.save().then(() => {
            setTimeout(function () {
                profile.lvl.canXP = !profile.lvl.canXP
                profile.save()
            }, 60 * 1000)
        })
    } else {
        profile.pf.msgTotal++
        profile.save()
    }

    msgsTotal++
    if (message.author.id != client.config.ownerID && message.author.id != message.guild.ownerID && server.filter.includes(message.channel.id)) return
    const botWasMentioned = (message.content === `<@!${client.user.id}>` || message.content === `<@!${client.user.id}>` || message.content === `<@${client.user.id}>` || message.content === `<@${client.user.id}> `)
    if (botWasMentioned) return message.channel.send(`Hi my prefix is \`${server.bot_prefix}\`\nUse \`${server.bot_prefix}help\` to see all available commands`)

    if (!message.content.startsWith(server.bot_prefix)) return;
    let commandfile = client.commands.get(command) || client.commands.get(client.aliases.get(command) || client.commands.get(command.toLowerCase()));
    if (!commandfile) return
    cmdTotal++

    if (server.cmds.find(c => c[0] === commandfile.config.name)[1] === 'false') return message.channel.send(`The \`${commandfile.config.name}\` command has been disabled by the server owner.`);
    if (message.author.id != client.config.ownerID) {
        if (client.admin.get(commandfile.config.name) && !message.member.permissions.has(`ADMINISTRATOR`)) return message.channel.send(`Only admins of the server can use the \`${commandfile.config.name}\` command.`);
    }
    if (client.nsfw.get(commandfile.config.name) && !message.channel.nsfw) return message.channel.send(`You can only use the \`${commandfile.config.name}\` command in an NSFW channel.`);
    try {
        if (client.memberPerms.get(commandfile.config.name).forEach(perm => !message.member.permissions.includes(perm))) return message.channel.send(`You do not have the required perms to run the \`${commandfile.config.name}\` command.`);
    } catch { }

    const timestamps = client.cooldowns.get(commandfile.config.name);
    const cooldownAmount = (commandfile.config.cooldown || 0) * 1000;

    if (message.author.id != client.config.ownerID) {
        if (!message.member.permissions.has(`ADMINISTRATOR`)) {
            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.channel.send(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandfile.config.name}\` command.`);
                }
            }
        }
    }

    commandfile.run(server, message, args);
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    return
}