const axios = require('axios')

module.exports = {
    config: {
        name: "profile",
        aliases: ['pf'],
        desc: "Get your minecraft profile",
        usage: [`pf`]
    },
    run: async (server, message, args) => {

        const req = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`, {
        }).then(async au => {
            if (au.status != 200) {
                return message.channel.send('Error, try again later')
            } else {
                return await message.channel.send(`https://visage.surgeplay.com/full/256/${au.data.id}.png`)
            }
        })
    }
}