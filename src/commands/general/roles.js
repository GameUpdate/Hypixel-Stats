const { findOrCreateUser, eloChecker } = require("../../functions/utils");

module.exports = {
    config: {
        name: "roles",
        desc: "Fix your rank roles if they bugged out.",
        usage: [`roles`],
    },
    run: async (server, message, args) => {

        const pf = await findOrCreateUser(message.guild.id, message.author).catch(err => message.channel.send(`Error getting player info`))
        if (pf.ign) { message.member.roles.add(client.roles.registered) }
        else if (!message.member.roles.cache.has(client.roles.registered)) return message.channel.send(`You are missing the **Registered** role and therefore cannot have any ranked roles`)
        await message.member.setNickname(`[${pf.elo === 0 ? 'X' : pf.elo}] ${pf.ign}`)
        await message.member.roles.remove(client.roles.unregistered)
        if (pf.totalGames < 10) { message.member.roles.add(client.roles.unranked) } else { await eloChecker(pf) }
        return message.channel.send(`Your roles have been checked`)
    }
}