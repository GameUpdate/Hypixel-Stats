const { MessageEmbed } = require("discord.js")
var weather = require('weather-js');
var moment = require('moment');

module.exports = {
    config: {
        name: "weather",
        aliases: ["we"],
        desc: "Get the current temperature somewhere in the world",
        usage: [`weather <area>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) { return message.channel.send("Can't lookup the weather in nowhere") }

        weather.find({ search: args.join(" "), degreeType: 'C' }, function (err, result) {
            if (err || !result[0]) { return message.channel.send("Couldn't get the weather there") }

            var current = result[0].current

            let noperms = new MessageEmbed()
                .setDescription(`**${current.skytext}**`)
                .setAuthor(`Weather forecast for ${result[0].location.name}`)
                .setThumbnail(current.imageUrl)
                .addField('Temperature', `${current.temperature}°`, true)
                .addField('Feels like', `${current.feelslike}°`, true)
                .addField('\u200B', '\u200B', true)
                .addField('Wind', current.winddisplay, true)
                .addField('Humidity', `${current.humidity}%`, true)
                .addField('\u200B', '\u200B', true)
                .addField(`Local time:`, `*${moment(`${current.date} ${current.observationtime}`).format('MMMM Do YYYY, h:mm a')}*`)
                .setColor(color)
            return message.channel.send(noperms)
        });
    }
}