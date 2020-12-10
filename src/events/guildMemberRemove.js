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

module.exports = async (client, member) => {

    const canvas = Canvas.createCanvas(1024, 450),
        ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage("./storage/greetings_background.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = applyText(canvas, member.user.username, 48);
    ctx.fillText(member.user.username, canvas.width - 660, canvas.height - 248);
    ctx.font = applyText(canvas, member.guild.name, 53);
    ctx.fillText(member.guild.name, canvas.width - 690, canvas.height - 65);
    ctx.font = "40px Bold";
    ctx.fillText(member.user.discriminator, canvas.width - 623, canvas.height - 178);
    ctx.font = "22px Bold";
    ctx.fillText(member.guild.memberCount, 40, canvas.height - 50);
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
    avatar = await Canvas.loadImage(member.user.displayAvatarURL(options));
    ctx.drawImage(avatar, 45, 90, 270, 270);
    const attachment = new MessageAttachment(canvas.toBuffer(), "goodbye-image.png");
    const server = await Server.findOne({ guildID: member.guild.id });
    const channel = member.guild.channels.cache.get(server.goodbye.channel);

    if (server.goodbye.enabled) {
        if (channel) {
            let msg = server.welcome.message
            msg = msg.replace(/{member}/g, message.member)
            msg = msg.replace(/{member.name}/g, message.author.username)
            msg = msg.replace(/{member.tag}/g, message.author.tag)
            msg = msg.replace(/{guild}/g, message.guild.name)
            msg = msg.replace(/{guild.members}/g, message.guild.memberCount)
            server.goodbye.image ? channel.send(msg, attachment) : channel.send(msg)
        } else {
            server.goodbye.enabled = !server.goodbye.enabled
            server.save()
        }
    }

    let profile = await Profile.findOne({ guildID: member.guild.id, userID: member.user.id })
    if (!profile) return
    if (parseInt(profile.inviter)) {
        const inviter = await Profile.findOne({ guildID: member.guild.id, userID: profile.inviter })
        inviter.left++
        inviter.invites--
        return inviter.save()
    }
}