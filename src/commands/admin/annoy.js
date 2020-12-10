
module.exports = {
    config: {
        name: "annoy",
        admin: true,
        desc: `Makes the bot join a voice channel for a couple seconds to scare edaters with face cams on`,
        usage: [`annoy <channel ID>`]
    },
    run: async (server, message, args) => {

        message.delete()
        let channel = message.guild.channels.cache.find(c => c.type === 'voice' && c.name.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.channels.cache.get(args[0])
        if (!channel) return

        channel.join()
        return setTimeout(function () { channel.leave() }, 3000)
    }
}