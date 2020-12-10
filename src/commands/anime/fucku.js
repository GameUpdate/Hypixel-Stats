const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "fucku",
        desc: "Flip someone off",
        usage: [`fucku <user>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        args[0] ? await message.guild.members.fetch({ query: args.join(" "), limit: 1 }) : await message.guild.members.fetch(message.author.id)
        let user = args[0] ? message.mentions.members.first() || message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.find(m => m.displayName.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.members.cache.get(args[0]) : message.member
        if (!user) { return message.channel.send("Couldn't find that user") } user = user.user

        let noperms = new MessageEmbed()
            .setColor(color)

        if (user === message.author) {
            return message.channel.send("You can't flip yourself off that's just weird!")
        } else {
            noperms.setDescription(`${message.member} flipped off ${user}!`)
        }

        let gifs = ['https://media1.tenor.com/images/846f7e556ae60999a3338817fa48ab46/tenor.gif?itemid=12865065',
            'https://media1.tenor.com/images/e881f89be843ec48d1eedccf9cbdf25f/tenor.gif?itemid=5354490',
            'https://media1.tenor.com/images/595b35652cd9fc1993223d772387982a/tenor.gif?itemid=14043799',
            'https://media1.tenor.com/images/0dcb84c900e10b6272152cd759eb1eab/tenor.gif?itemid=15151786',
            'https://media1.tenor.com/images/fb6869a93348d71bfb84fe7324d7baa7/tenor.gif?itemid=11874957',
            'https://media1.tenor.com/images/4b5dc6ffafb63a150cda6f88e47c5b91/tenor.gif?itemid=7354612',
            'https://media1.tenor.com/images/934f383359063560e616b30151b5c72b/tenor.gif?itemid=15818202',
            'https://media1.tenor.com/images/a66298daaffa7ec1dd7491fe1c2f9691/tenor.gif?itemid=17917760',
            'https://media1.tenor.com/images/e26e7f6a37f4d9c1f2a14e0a3add3d45/tenor.gif?itemid=17126275',
            'https://media1.tenor.com/images/242564b1eb05a66d12fe6103a715144f/tenor.gif?itemid=14453117',
            'https://media1.tenor.com/images/929e4ec8501a58395e59f496bba13d46/tenor.gif?itemid=15308749',
            'https://media1.tenor.com/images/6a8bb6d23c60d60824f850c556439271/tenor.gif?itemid=17334551',
            'https://media1.tenor.com/images/7159134854993425b650f787aec1654b/tenor.gif?itemid=16459891',
            'https://media1.tenor.com/images/64f545a4097ba81029a11ac4c15b7429/tenor.gif?itemid=17352788',
        ]

        noperms.setImage(gifs[Math.floor(Math.random() * gifs.length)])
        return message.channel.send(noperms)
    }
}