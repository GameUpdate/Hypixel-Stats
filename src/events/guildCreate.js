const utils = require(`../functions/utils.js`)

module.exports = async (client, guild) => {
    if (!guild) return;

    await utils.findOrCreateGuild(guild.id)
}