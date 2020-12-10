const { MessageAttachment } = require("discord.js")
const { Canvas, fillWithEmoji } = require('discord-emoji-canvas')
var numeral = require('numeral');

module.exports = {
    config: {
        name: "profile",
        aliases: ['pf'],
        desc: "Get the profile of someone",
        usage: [`pf <user>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        args[0] ? await message.guild.members.fetch({ query: args.join(" "), limit: 1 }) : await message.guild.members.fetch(message.author.id)
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user

        let profile = await Profile.findOne({ userID: user.id, guildID: message.guild.id })
        const canvas = Canvas.createCanvas(1000, 750)
        const ctx = canvas.getContext('2d')
        const nxtLvl = server.leveling.nxtLevel * (Math.pow(2, profile.lvl.level) - 1);

        let images = ['http://gameupdate.me/0677e6.png',
            'http://gameupdate.me/190655.png',
            'http://gameupdate.me/fd7992.png',
            'http://gameupdate.me/f1167e.png',
            'https://pm1.narvii.com/7208/519ba4a923b2816dba94db84b449df76e264f68cr1-1125-2001v2_00.jpg',
            'http://gameupdate.me/6cca8e.png',
            'http://gameupdate.me/5a7439.png',
            'http://gameupdate.me/492b5c.png',
            'http://gameupdate.me/2919d7.png',
            'http://gameupdate.me/590cc7.png',
            'http://gameupdate.me/97ebc4.png',
            'http://gameupdate.me/83dc03.png',
            'http://gameupdate.me/10339b.png',
            'http://gameupdate.me/957276.png',
            'http://gameupdate.me/2dd8d9.png',
            'http://gameupdate.me/8058e8.png',
            'http://gameupdate.me/8f7dd2.png',
            'http://gameupdate.me/0b567d.png',
            'http://gameupdate.me/d510cb.png']

        const background = await Canvas.loadImage(images[Math.floor(Math.random() * images.length)]);
        ctx.drawImage(background, (canvas.width / 2) + 50, 0, (canvas.width / 2) - 50, canvas.height);

        ctx.beginPath();
        ctx.rect(0, 0, (canvas.width / 2) + 50, canvas.height);
        ctx.stroke();
        ctx.fillStyle = color
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(339, 335, 130, 45);
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
        ctx.fill();
        ctx.closePath();

        ctx.font = '60px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(user.username, 50, 315);

        ctx.font = '35px sans-serif';
        ctx.fillStyle = '#808080';
        ctx.fillText('#' + user.discriminator, 345, 370);

        ctx.font = '50px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('Balance:', 50, 455);

        ctx.font = '50px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        await fillWithEmoji(ctx, "<:Money:759044714853957652>", 290, 410)

        ctx.font = '50px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(numeral(profile.eco.bal).format('0a'), 350, 455);

        ctx.font = '50px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`Messages: ${profile.pf.msgTotal}`, 50, 530);

        ctx.font = '50px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('XP:', 50, 605);

        ctx.font = '50px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        await fillWithEmoji(ctx, `<a:EXP:641247364635688973>`, 140, 560)

        ctx.font = '50px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${profile.lvl.xp.toLocaleString()}/${nxtLvl.toLocaleString()}`, 200, 605);

        ctx.font = '50px sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`Level ${profile.lvl.level}`, 50, 680);

        ctx.beginPath();
        ctx.arc(280, 130, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'jpg' }));
        ctx.drawImage(avatar, 180, 30, 200, 200);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

        message.channel.send(attachment);
    }
}