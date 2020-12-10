const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "beg",
        aliases: ['money'],
        cooldown: 86400,
        desc: "Beg for money every day",
        usage: [`beg`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        let profile = await Profile.findOne({ userID: message.author.id, guildID: message.guild.id })
        function num() {
            return (Math.floor(Math.random() * Math.floor(5000)) + 10000)
        }

        won = num(); profile.eco.bal += won;
        profile.eco.bal_changes.push(profile.eco.bal)
        profile.save().catch(e => console.log(e)).then(() => {
            return message.channel.send('Heres some money for you babe\nYou got <:Money:759044714853957652>**' + won.toLocaleString() + '**')
        })
    }
}