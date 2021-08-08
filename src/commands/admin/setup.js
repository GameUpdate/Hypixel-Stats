const utils = require('../../functions/utils');

module.exports = {
    config: {
        name: `setup`,
        admin: true,
    },
    run: async (server, message, args) => {

        let members = await message.guild.members.fetch()
        members.forEach(async (member) => {
            await utils.findOrCreateUser(message.guild.id, member.user)
        })
    }
}