const utils = require(`../functions/utils.js`)

module.exports = async (client, member) => {
    if (!member || member.user.bot) return;

    await utils.findOrCreateUser(member.user)
}