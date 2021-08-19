const { Client, Collection } = require("discord.js");
const config = require("./storage/config.json");
const utils = require("./src/functions/utils.js");
const { readdirSync } = require("fs")
const mongoose = require('mongoose');
const { HypixelAPI } = require('hypixel-api-v2');

global.hypixel = new HypixelAPI(['fb40444b-995c-4a2e-a4a3-220c7effb647', '32c6fb49-9b0b-4b1a-97fa-2633b18cd2eb']);
global.client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] })
global.Guilds = require('./storage/newGuild.js')
global.Profiles = require('./storage/newProfile.js')
global.cmdTotal = 0
global.msgsTotal = 0
client.config = config
let cmdList = []
let options = ["commands", "aliases", "memberPerms", "cooldowns", "admin", "description", "usage"]
options.forEach(x => client[x] = new Collection());

mongoose.connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true });

readdirSync(`./src/commands/`).forEach(dirs => {
    const commands = readdirSync(`./src/commands/${dirs}/`).filter(d => d.endsWith('.js'));
    for (let file of commands) {
        let pull = require(`./src/commands/${dirs}/${file}`);
        cmdList.push(pull.config)
        client.commands.set(pull.config.name, pull);
        if (pull.config.aliases) pull.config.aliases.forEach(a => client.aliases.set(a, pull.config.name))
        if (pull.config.memberPerms) pull.config.memberPerms.forEach(a => client.memberPerms.set(pull.config.name, a))
        client.cooldowns.set(pull.config.name, new Collection())
        pull.config.admin ? client.admin.set(pull.config.name, pull.config.admin) : client.admin.set(pull.config.name, false)
        if (pull.config.usage) pull.config.usage.forEach(a => client.usage.set(pull.config.name, a))
        pull.config.description ? client.description.set(pull.config.name, pull.config.description) : client.description.set(pull.config.name, `No description has been set for this command`)
    };
})

const events = readdirSync(`./src/events/`).filter(d => d.endsWith('.js'));
for (let file of events) {
    const evt = require(`./src/events/${file}`);
    let eName = file.split('.')[0];
    client.on(eName, evt.bind(null, client));
};

client.login(config.bot_token);