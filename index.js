const { Client, Collection, MessageEmbed } = require("discord.js");
const config = require("./storage/config.json");
const roles = require("./storage/roles.json");
const elo = require("./storage/elo.json");
const queues = require("./storage/queues.json");
const { readdirSync } = require("fs")
const mongoose = require('mongoose');

global.totalGames = 0
global.client = new Client();
global.Guilds = require('./storage/newGuild.js')
global.Profiles = require('./storage/newProfile.js')
client.hyp = require('hypixel-api-wrapper')
client.hyp.setKey('207ae7a8-88c7-4154-8e03-d1b80ad08871')
client.config = config
client.roles = roles
client.elo = elo
client.queues = queues
let options = ["commands", "aliases", "memberPerms", "cooldowns", "admin", "desc", "usage"]
options.forEach(x => client[x] = new Collection());

mongoose.connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

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
        pull.config.desc ? client.desc.set(pull.config.name, pull.config.desc) : client.desc.set(pull.config.name, `No description has been set for this command`)
    };
})

const events = readdirSync(`./src/events/`).filter(d => d.endsWith('.js'));
for (let file of events) {
    const evt = require(`./src/events/${file}`);
    let eName = file.split('.')[0];
    client.on(eName, evt.bind(null, client));
};

client.login(config.bot_token);