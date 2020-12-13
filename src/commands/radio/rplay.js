const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "rplay",
        desc: "Play the radio",
        usage: [`rplay <type>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        const voice = message.member.voice.channel;
        if (!voice) {
            return message.channel.send(`You're not in a voice channel`)
        }

        const perms = voice.permissionsFor(client.user);
        if (!perms.has("CONNECT") || !perms.has("SPEAK")) {
            return message.channel.send(`I don't have perms to join that channel`)
        }

        if (!args[0]) {
            return message.channel.send(`Play the radio, use \`${server.bot_prefix}rplay <top | rock | dance | country | classic | hiphop>\``)
        } else if (args[0].toLowerCase() === 'top') {
            client.radio.tune_radio("s142771").then(function (result) {
                message.member.voice.channel.join().then(function (connection) {
                    connection.play(result.body[0].url.replace(".m3u", ""))
                })
                return message.channel.send(`Now playing Top radio`)
            }).catch(function (err) {
                return message.channel.send(`Couldn't get radio information`)
            });
        } else if (args[0].toLowerCase() === 'rock') {
            client.radio.tune_radio("s30377").then(function (result) {
                message.member.voice.channel.join().then(function (connection) {
                    connection.play(result.body[0].url.replace(".m3u", ""))
                })
                return message.channel.send(`Now playing Rock radio`)
            }).catch(function (err) {
                return message.channel.send(`Couldn't get radio information`)
            });
        } else if (args[0].toLowerCase() === 'dance') {
            client.radio.tune_radio("s307749").then(function (result) {
                message.member.voice.channel.join().then(function (connection) {
                    connection.play(result.body[0].url.replace(".m3u", ""))
                })
                return message.channel.send(`Now playing Dance radio`)
            }).catch(function (err) {
                return message.channel.send(`Couldn't get radio information`)
            });
        } else if (args[0].toLowerCase() === 'country') {
            client.radio.tune_radio("s126270").then(function (result) {
                message.member.voice.channel.join().then(function (connection) {
                    connection.play(result.body[0].url.replace(".m3u", ""))
                })
                return message.channel.send(`Now playing Country radio`)
            }).catch(function (err) {
                return message.channel.send(`Couldn't get radio information`)
            });
        } else if (args[0].toLowerCase() === 'classic') {
            client.radio.tune_radio("s31824").then(function (result) {
                message.member.voice.channel.join().then(function (connection) {
                    connection.play(result.body[0].url.replace(".m3u", ""))
                })
                return message.channel.send(`Now playing Classic radio`)
            }).catch(function (err) {
                return message.channel.send(`Couldn't get radio information`)
            });
        } else if (args[0].toLowerCase() === 'hiphop') {
            client.radio.tune_radio("s213411").then(function (result) {
                message.member.voice.channel.join().then(function (connection) {
                    connection.play(result.body[0].url.replace(".m3u", ""))
                })
                return message.channel.send(`Now playing Hip Hop radio`)
            }).catch(function (err) {
                return message.channel.send(`Couldn't get radio information`)
            });
        } else if (parseInt(args[0].substr(1))) {
            client.radio.tune_radio(args[0]).then(function (result) {
                if (result.body[0].url.includes(".pls")) return message.channel.send(`Can't play that station sorry`)
                message.member.voice.channel.join().then(function (connection) {
                    connection.play(result.body[0].url.replace(".m3u", ""))
                })
                return message.channel.send(`Now playing the radio`)
            }).catch(function (err) {
                return message.channel.send(`Couldn't get radio information`)
            });
        }
    }
}