const { Client, Collection, MessageEmbed } = require("discord.js");
const config = require("./storage/config.json");
const { readdirSync } = require("fs")
const mongoose = require('mongoose');
const { Player } = require("discord-player");
const { GiveawaysManager } = require("discord-giveaways");

global.client = new Client();
global.Server = require('./storage/newGuild.js')
global.Profile = require('./storage/newProfile.js')
global.cmdTotal = 0
global.msgsTotal = 0
client.config = config
let options = ["commands", "aliases", "memberPerms", "cooldowns", "admin", "enabled", "nsfw", "desc", "invites", "usage"]
options.forEach(x => client[x] = new Collection());

mongoose.connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.collections.users.updateMany({ "lvl.canXP": false }, { $set: { "lvl.canXP": true } }, { multi: true });
db.collections.users.updateMany({ "rooms.open": true }, { $set: { "rooms.open": false } }, { multi: true });

readdirSync(`./src/commands/`).forEach(dirs => {
    const commands = readdirSync(`./src/commands/${dirs}/`).filter(d => d.endsWith('.js'));
    for (let file of commands) {
        let pull = require(`./src/commands/${dirs}/${file}`);
        client.commands.set(pull.config.name, pull);
        if (pull.config.aliases) pull.config.aliases.forEach(a => client.aliases.set(a, pull.config.name))
        if (pull.config.memberPerms) pull.config.memberPerms.forEach(a => client.memberPerms.set(pull.config.name, a))
        client.cooldowns.set(pull.config.name, new Collection())
        pull.config.admin ? client.admin.set(pull.config.name, pull.config.admin) : client.admin.set(pull.config.name, false)
        if (pull.config.usage) pull.config.usage.forEach(a => client.usage.set(pull.config.name, a))
        pull.config.nsfw ? client.nsfw.set(pull.config.name, pull.config.nsfw) : client.nsfw.set(pull.config.name, false)
        pull.config.desc ? client.desc.set(pull.config.name, pull.config.desc) : client.desc.set(pull.config.name, `No description has been set for this command`)
    };
})

const events = readdirSync(`./src/events/`).filter(d => d.endsWith('.js'));
for (let file of events) {
    const evt = require(`./src/events/${file}`);
    let eName = file.split('.')[0];
    client.on(eName, evt.bind(null, client));
};

process.on('unhandledRejection', error => {
    if (error.message.includes('Unknown Channel')) return
});

const player = new Player(client);
client.player = player;
client.player
    .on("trackStart", (message, track) => {
        message.channel.send(`Now playing: \`${track.title}\``)
    })
    .on("playlistStart", (message, queue, playlist, track) => {
        message.channel.send(`Now playing: \`${track.title}\``)
    })
    .on("searchResults", (message, query, tracks) => {
        if (tracks.length > 20) tracks = tracks.slice(0, 20);
        const embed = new MessageEmbed()
            .setDescription(tracks.map((t, i) => `**${++i} -** ${t.title}`).join("\n"))
            .setFooter(`Pick a song using a track number`)
            .setColor(`#2F3136`);
        message.channel.send(embed);
    })
    .on("searchInvalidResponse", (message, query, tracks) => {
        message.channel.send(`Couldn't find that song, try a number between **1** and **${tracks.length}**`)
    })
    .on("searchCancel", (message) => {
        message.channel.send(`Time's up, too late`)
    })
    .on("botDisconnect", (message) => {
        message.channel.send(`I left the call`)
    })
    .on("noResults", (message) => {
        message.channel.send(`Couldn't find anything`)
    })
    .on("queueEnd", (message) => {
        message.channel.send(`Queue is over`)
    })
    .on("playlistAdd", (message, queue, playlist) => {
        message.channel.send(`Added **${playlist.tracks.length}** songs from playlist \`${playlist.title}\``)
    })
    .on("trackAdd", (message, queue, track) => {
        message.channel.send(`Added \`${track.title}\``)
    })
    .on("channelEmpty", () => {
        // do nothing, leaveOnEmpty is not enabled
    })
    .on("error", (message, error) => {
        switch (error) {
            case "NotConnected":
                message.channel.send(`You're not in a voice channel`)
                break;
            case "UnableToJoin":
                message.channel.send(`Can't join that channel`);
                break;
            case "NotPlaying":
                message.channel.send(`I'm not playing anything atm`);
                break;
        }
    });

giveawaysManager = new GiveawaysManager(client, {
    storage: "./storage/jsons/giveaways.json",
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
        embedColor: "#2F3136",
        embedColorEnd: "#2F3136",
        reaction: "🎉"
    }
});
client.gaManager = giveawaysManager

client.login(config.bot_token);