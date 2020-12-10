
module.exports = {
    config: {
        name: "emdel",
        aliases: ["emdelete", "emremove", "emrem"],
        desc: "Delete an emote",
        usage: [`emdel <emote>`],
        admin: true,
    },
    run: async (server, message, args) => {
        const color = server.color

        if (!args[0]) return message.channel.send("Did you even give me an emote to delete?")
        let emoji = client.emojis.cache.find(e => e.name.toLowerCase().includes(args.join(" ").toLowerCase())) || client.emojis.cache.get(args[0].substring(args[0].length - 19, args[0].length - 1)) || client.emojis.cache.get(args[0]) || message.guild.emojis.cache.find(e => e.name.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.emojis.cache.get(args[0])
        if (!emoji) return message.channel.send("Couldn't find that emote")

        message.guild.emojis.cache.get(emote.id).delete().then(() => { return message.channel.send(`**${emoji.name}** has been deleted`) })
    }
}