const { MessageAttachment } = require("discord.js")
const canvacord = require("canvacord");
const Gradient = require("javascript-color-gradient")
var randomColor = require('randomcolor');

module.exports = {
    config: {
        name: "lvl",
        aliases: ['rank', 'level', 'xp'],
        desc: "See someone's xp information",
        usage: [`lvl <user>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        args[0] ? await message.guild.members.fetch({ query: args.join(" "), limit: 1 }) : await message.guild.members.fetch(message.author.id)
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user

        let profile = await Profile.findOne({ userID: user.id, guildID: message.guild.id })
        const nxtLvl = server.leveling.nxtLevel * (Math.pow(2, profile.lvl.level) - 1);
        Profile.find({ "lvl.level": { $exists: true }, guildID: { $eq: message.guild.id } }).sort({ "lvl.level": -1 }).then(async lb => {
            const me = await lb.find(function (info, index) {
                if (info.userID === message.author.id) return true;
            })

            const colorGradient = new Gradient();
            colorGradient.setGradient(randomColor(), randomColor());

            const rank = new canvacord.Rank()
                .setBackground("COLOR", "#2c2f33")
                .setOverlay('#2c2f33', 0.5, false)
                .setAvatar(user.displayAvatarURL({ format: "png" }))
                .setCurrentXP(profile.lvl.xp)
                .renderEmojis(true)
                .setRequiredXP(nxtLvl)
                .setLevel(profile.lvl.level)
                .setRank(lb.indexOf(me) + 1)
                .setLevelColor(colorGradient.getColor(1), colorGradient.getColor(1))
                .setCustomStatusColor(colorGradient.getColor(1))
                .setProgressBar(colorGradient.getArray(), "GRADIENT")
                .setUsername(user.username)
                .setDiscriminator(user.discriminator);

            rank.build()
                .then(buffer => {
                    const attachment = new MessageAttachment(buffer, "RankCard.png");
                    message.channel.send(attachment);
                });
        })
    }
}