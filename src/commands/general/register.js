const { findOrCreateUser, eloChecker } = require("../../functions/utils");
const minecraftPlayer = require("minecraft-player");

module.exports = {
    config: {
        name: "register",
        desc: "Register and link your discord to a minecraft account to gain access to all the RBW features.",
        usage: [`register <ign>`],
        aliases: [`reg`]
    },
    run: async (server, message, args) => {

        if (!message.member.roles.cache.has(client.roles.unregistered)) return message.channel.send(`You are missing the **Unregistered** role and therefore cannot register`)
        const pf = await findOrCreateUser(message.guild.id, message.author).catch(err => message.channel.send(`Error getting player info`))
        if (pf.ign) return message.channel.send(`You have already registered with an account`)
        if (!args[0]) return message.channel.send(`Give an IGN to link your discord to`)
        var info = await minecraftPlayer(args[0])
        const search = await client.hyp.player(info.uuid).catch(err => message.channel.send(`Error getting player info`))
        if (!search.player.socialMedia || !search.player.socialMedia.links || !search.player.socialMedia.links.DISCORD) return message.channel.send(`**${search.player.displayname}** does not have a discord account linked`)
        if (search.player.socialMedia.links.DISCORD != message.author.tag) return message.channel.send(`**${search.player.displayname}** is already linked to another discord account`)
        pf.ign = search.player.displayname
        if (pf.totalGames < 10) { message.member.roles.add(client.roles.unranked) } else { await eloChecker(pf) }
        await pf.save()
        await message.member.roles.remove(client.roles.unregistered)
        await message.member.roles.add(client.roles.registered)
        await message.member.setNickname(`[${pf.elo === 0 ? 'X' : pf.elo}] ${pf.ign}`)
        return message.channel.send(`Success! Your account has been linked to the ign: **${search.player.displayname}**`)
    }
}