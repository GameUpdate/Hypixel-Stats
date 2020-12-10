const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "play",
        aliases: ['p'],
        desc: "Play a song or playlist from Youtube or SoundCloud",
        usage: [`p <url or song name>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        const voice = message.member.voice.channel;
        if (!voice) {
            return message.channel.send(`You're not in a voice channel`)
        }

        const perms = voice.permissionsFor(client.user);
		if(!perms.has("CONNECT") || !perms.has("SPEAK")){
			return message.channel.send(`I don't have perms to join that channel`)
        }
        
        if (!args[0]) return message.channel.send(`Please enter a song url or title to search`)

        return client.player.play(message, args.join(" "))
    }
}