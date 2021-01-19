const utils = require(`../functions/utils.js`)

module.exports = async (client, guild) => {
    if (!guild) return;

    await utils.findOrCreateGuild(guild.id)

    const members = await guild.members.fetch()
    members.forEach(async member => {
        await utils.findOrCreateUser(guild.id, member.user)
    })
}