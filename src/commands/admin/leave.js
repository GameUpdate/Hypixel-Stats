const Canvas = require("canvas")
const { MessageAttachment } = require("discord.js");
const { resolve } = require("path");
Canvas.registerFont(resolve("./storage/fonts/theboldfont.ttf"), { family: "Bold" });
Canvas.registerFont(resolve("./storage/fonts/SketchMatch.ttf"), { family: "SketchMatch" });

const applyText = (canvas, text, defaultFontSize) => {
    const ctx = canvas.getContext("2d");
    do {
        ctx.font = `${defaultFontSize -= 10}px Bold`;
    } while (ctx.measureText(text).width > 600);
    return ctx.font;
};

module.exports = {
    config: {
        name: "leave",
        admin: true,
        desc: `Set up what happens when a new member leaves and test what you have`,
        usage: [`leave`, `leave image`, `leave channel <channel>`, `leave message <message>`, `leave message var`, `leave test`]
    },
    run: async (server, message, args) => {
        const color = server.color

        if (!args[0]) {
            server.goodbye.enabled ? server.goodbye.enabled = false : server.goodbye.enabled = true
            server.save().then(() => { return message.channel.send(`Leave message has been turned ${server.goodbye.enabled ? `**ON**` : `**OFF**`}`) })

        } else if (args[0].toLowerCase() === 'image') {
            server.goodbye.image ? server.goodbye.image = false : server.goodbye.image = true
            server.save().then(() => { return message.channel.send(`Leave message image has been turned ${server.goodbye.image ? `**ON**` : `**OFF**`}`) })

        } else if (["channel", "chan"].includes(args[0].toLowerCase())) {
            if (!args[1]) return message.channel.send(`Couldn't find that channel, please use a correct one`)
            let channel = message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find(c => c.type === 'text' && c.name.toLowerCase().includes(args[1].toLowerCase())) || message.guild.channels.cache.find(c => c.type === 'text' && c.name.toLowerCase() === args[1].toLowerCase())
            if (!channel) return message.channel.send(`Couldn't find that channel, please use a correct one`)

            server.goodbye.channel = channel.id
            server.save().then(() => { return message.channel.send(`Leave message channel has been set to ${channel.toString()}`) })

        } else if (["message", "msg"].includes(args[0].toLowerCase())) {
            if (!args[1]) return message.channel.send(`No message has been found, try again.`)

            if (args[1].toLowerCase() != 'var') {
                args.shift()
                server.goodbye.message = args.leave(" ")
                server.save().then(() => { return message.channel.send(`Leave message has been set to \`\`\`${args.leave(" ")}\`\`\``) })
            } else {
                return message.channel.send(`\`\`\`{member} - Tags the member\n{member.name} - The member's username\n{member.tag} - The member's discord tag (ex: Game#0005)\n\n{guild} - The server's name\n{guild.members} - The amount of members in the server\`\`\``)
            }
        } else if (args[0].toLowerCase() === 'test') {
            const canvas = Canvas.createCanvas(1024, 450),
                ctx = canvas.getContext("2d");

            const background = await Canvas.loadImage("./storage/greetings_background.png");
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#ffffff";
            ctx.font = applyText(canvas, message.member.user.username, 48);
            ctx.fillText(message.member.user.username, canvas.width - 660, canvas.height - 248);
            ctx.font = applyText(canvas, message.member.guild.name, 53);
            ctx.fillText(message.member.guild.name, canvas.width - 690, canvas.height - 65);
            ctx.font = "40px Bold";
            ctx.fillText(message.member.user.discriminator, canvas.width - 623, canvas.height - 178);
            ctx.font = "22px Bold";
            ctx.fillText(message.member.guild.memberCount, 40, canvas.height - 50);
            ctx.fillStyle = "#44d14a";
            ctx.font = "75px SketchMatch";
            ctx.fillText("#", canvas.width - 690, canvas.height - 165);
            ctx.font = "90px Bold";
            ctx.strokeStyle = "#1d2124";
            ctx.lineWidth = 15;
            ctx.strokeText('Goodbye', canvas.width - 620, canvas.height - 330);
            var gradient = ctx.createLinearGradient(canvas.width - 780, 0, canvas.width - 30, 0);
            gradient.addColorStop(0, "#e15500");
            gradient.addColorStop(1, "#e7b121");
            ctx.fillStyle = gradient;
            ctx.fillText('Goodbye', canvas.width - 620, canvas.height - 330);

            ctx.beginPath();
            ctx.lineWidth = 10;
            ctx.strokeStyle = "#03A9F4";
            ctx.arc(180, 225, 135, 0, Math.PI * 2, true);
            ctx.stroke();
            ctx.closePath();
            ctx.clip();

            const options = { format: "png", size: 512 }
            avatar = await Canvas.loadImage(message.member.user.displayAvatarURL(options));
            ctx.drawImage(avatar, 45, 90, 270, 270);
            const attachment = new MessageAttachment(canvas.toBuffer(), "goodbye-image.png");

            let msg = server.goodbye.message
            msg = msg.replace(/{member}/g, message.member)
            msg = msg.replace(/{member.name}/g, message.author.username)
            msg = msg.replace(/{member.tag}/g, message.author.tag)
            msg = msg.replace(/{guild}/g, message.guild.name)
            msg = msg.replace(/{guild.members}/g, message.guild.memberCount)

            return message.channel.send(msg, attachment)
        }
    }
}