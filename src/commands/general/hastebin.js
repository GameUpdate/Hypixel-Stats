const { MessageEmbed, MessageAttachment } = require("discord.js")
const fetch = require("node-fetch");

module.exports = {
    config: {
        name: "hastebin",
        aliases: ["haste", "hb", "pastebin", "pb"],
        desc: "Save text onto a hastebin/pastebin document",
        usage: [`hb <text>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) return message.channel.send(`Give a url to render into a qr code`)
        const content = args.join(" ");
        try {
            const res = await fetch("https://hasteb.in/documents", {
                method: "POST",
                body: content,
                headers: { "Content-Type": "text/plain" }
            });

            const json = await res.json();
            if (!json.key) return message.channel.send(`An error occured, try again`)
            const url = "https://hasteb.in/" + json.key + ".js";

            return message.channel.send(url);
        } catch (e) {
            return message.channel.send(`An error occured, try again`)
        }
    }
}