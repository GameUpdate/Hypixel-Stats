
module.exports = {
    config: {
        name: "emadd",
        aliases: ["emcreate"],
        desc: "Add or steal an emote",
        usage: [`emadd yoink <emote>`, `emadd steal <emote>`, `emadd <image link> <name>`],
        admin: true,
    },
    run: async (server, message, args) => {
        const color = server.color

        if (args[0].toLowerCase() === 'add' || args[0].toLowerCase() === 'create') {

            if (/(jpg|gif|png|JPG|GIF|PNG|JPEG|jpeg)$/.test(args[1])) {

                if (!args[2]) {
                    name = args[1].split("/").pop().split(".")[0]
                } else {
                    name = args[2]
                }

                message.guild.emojis.create(args[1], name).then(emoji => {
                    return message.channel.send(`${emoji} has been made, use \`:${emoji.name}:\``)
                })

            } else { return message.channel.send(`Use a link that ends with a file extension (like .png or .gif)`) }

        } else if (args[0].toLowerCase() === 'yoink' || args[0].toLowerCase() === 'steal') {

            args.shift()
            if (!args[0]) return message.channel.send("Did you even give me an emote for me to steal?")
            let emoji = client.emojis.cache.find(e => e.name.toLowerCase().includes(args.join(" ").toLowerCase())) || client.emojis.cache.get(args[0].substring(args[0].length - 19, args[0].length - 1)) || client.emojis.cache.get(args[0])
            if (!emoji) return message.channel.send("Couldn't find that emote")

            message.guild.emojis.create(emote.url, emote.name).then(emoji => {
                return message.channel.send(`${emoji} has been made, use \`:${emoji.name}:\``)
            })
        }
    }
}