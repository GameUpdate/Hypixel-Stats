const index = require(`../../index.js`)
const { readdirSync } = require("fs")
const { MessageEmbed } = require("discord.js")

const findOrCreateUser = async (guildID, user) => {
  let profile = await Profiles.findOne({ guildID: guildID, userID: user.id })
  if (profile) return profile
  const newProfile = new Profiles({ guildID: guildID, userID: user.id, tag: user.tag })
  await newProfile.save()
  let pf = await Profiles.findOne({ guildID: guildID, userID: user.id })
  if (pf) return pf
}

const findOrCreateGuild = async (guildID) => {
  let guild = await Guilds.findOne({ guildID: guildID })
  if (guild) return guild
  const newGuild = new Guilds({ guildID: guildID })
  await newGuild.save()
  let g = await Guilds.findOne({ guildID: guildID })
  if (g) return g
}

const cmdSetup = async () => {
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
}

const eventSetup = async () => {
  const events = readdirSync(`./src/events/`).filter(d => d.endsWith('.js'));
  for (let file of events) {
    const evt = require(`./src/events/${file}`);
    let eName = file.split('.')[0];
    client.on(eName, evt.bind(null, client));
  };
}

exports.findOrCreateUser = findOrCreateUser;
exports.findOrCreateGuild = findOrCreateGuild;
exports.cmdSetup = cmdSetup;
exports.eventSetup = eventSetup;