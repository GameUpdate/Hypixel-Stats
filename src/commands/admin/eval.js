
module.exports = {
    config: {
        name: "eval",
        description: "Evaluate code through the console [Only for the bot creator]",
        admin: true
    },
    run: async (server, message, args) => {

        const clean = text => {
            if (typeof (text) === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }

        if (message.author.id != client.config.ownerID) return message.channel.send(`Fuck off`)
        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            if (clean(evaled).length >= 1990)
                return message.channel.send(`${clean(evaled).substr(0, 1980)}...`, { code: "xl" });
            return message.channel.send(clean(evaled), { code: "xl" });
        } catch (err) {
            if (clean(err).length >= 1990)
                return message.channel.send(`${clean(err).substr(0, 1980)}...`, { code: "xl" });
            return message.channel.send(clean(err), { code: "xl" });
        }
    }
}