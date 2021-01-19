const utils = require('../../functions/utils');

module.exports = {
    config: {
        name: `setup`,
    },
    run: async (server, profile, message, args) => {
        const color = server.color;

        let members = await message.guild.members.fetch()
        members.forEach(async (member) => {
            await utils.findOrCreateUser(message.guild.id, member.user)
        })
    }
}