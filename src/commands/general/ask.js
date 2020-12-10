const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "ask",
        aliases: ['ball'],
        desc: "Ask me about anything and I shall answer",
        usage: [`ask <question>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) { return message.channel.send("Can't give you an answer if you don't have a question") }
        let answers = ['As I see it, yes.'
            , 'Ask again later.'
            , 'Better not tell you now.'
            , 'Cannot predict now.'
            , 'Concentrate and ask again.'
            , 'Don’t count on it.'
            , 'It is certain.'
            , 'It is decidedly so.'
            , 'Most likely.'
            , 'My reply is no.'
            , 'My sources say no.'
            , 'Outlook not so good.'
            , 'Outlook good.'
            , 'Reply hazy, try again.'
            , 'Signs point to yes.'
            , 'Very doubtful.'
            , 'Without a doubt.'
            , 'Yes.'
            , 'Yes – definitely.'
            , 'You may rely on it.']

        return message.channel.send(answers[Math.floor(Math.random() * answers.length)])
    }
}