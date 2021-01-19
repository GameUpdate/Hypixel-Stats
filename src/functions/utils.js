const index = require(`../../index.js`)

const findOrCreateUser = async (guildID, user) => {
  let guild = await client.guilds.fetch(guildID)
  let profile = await Profiles.findOne({ guildID: guildID, userID: user.id })
  if (profile) return profile
  const newProfile = new Profiles({ guildID: guildID, userID: user.id, "pf.firstJoin": new Date(guild.member(user.id).joinedAt).getTime(), tag: user.tag })
  await newProfile.save()
  let pf = await Profiles.findOne({ guildID: guildID, userID: user.id })
  if (pf) return pf
}

const findOrCreateGuild = async (guildID) => {
  let guild = await Guilds.findOne({ guildID: guildID })
  if (guild) return guild
  const newGuild = new Guilds({ guildID: guildID })
  await newProfile.save()
  let g = await Guilds.findOne({ guildID: guildID })
  if (g) return g
}

exports.findOrCreateUser = findOrCreateUser;
exports.findOrCreateGuild = findOrCreateGuild;