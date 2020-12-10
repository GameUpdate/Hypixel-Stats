const { MessageEmbed, MessageAttachment } = require("discord.js")
const math = require("mathjs");

module.exports = {
    config: {
        name: "calc",
        aliases: ["cal", "calculate", "math"],
        desc: "Solve a math equation",
        usage: [`calc <math problem>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) return message.channel.send(`Give a math problem for me to solve`)
        let result;
        try {
            result = math.evaluate(args.join(" ").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/"));
        } catch (e) {
            return message.channel.send(`Can't solve that`)
        }

        return message.channel.send(`\`\`\`${result}\`\`\``);
    }
}