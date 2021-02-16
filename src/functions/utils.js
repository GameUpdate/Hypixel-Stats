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

const eloChecker = async (profile) => {
  let member = await client.guilds.cache.get(profile.guildID).member(profile.userID)
  const current = member.roles.cache.filter(r => Object.values(client.roles.ranked).includes(r.id))
  current.forEach(r => member.roles.remove(r.id))
  switch (true) {
    case (profile.elo < 100):
      member.roles.add(client.roles.ranked.coal1)
      break
    case (profile.elo < 150):
      member.roles.add(client.roles.ranked.coal2)
      break
    case (profile.elo < 200):
      member.roles.add(client.roles.ranked.coal3)
      break
    case (profile.elo < 250):
      member.roles.add(client.roles.ranked.coal4)
      break
    case (profile.elo < 325):
      member.roles.add(client.roles.ranked.iron1)
      break
    case (profile.elo < 400):
      member.roles.add(client.roles.ranked.iron2)
      break
    case (profile.elo < 475):
      member.roles.add(client.roles.ranked.iron3)
      break
    case (profile.elo < 550):
      member.roles.add(client.roles.ranked.iron4)
      break
    case (profile.elo < 650):
      member.roles.add(client.roles.ranked.gold1)
      break
    case (profile.elo < 750):
      member.roles.add(client.roles.ranked.gold2)
      break
    case (profile.elo < 850):
      member.roles.add(client.roles.ranked.gold3)
      break
    case (profile.elo < 950):
      member.roles.add(client.roles.ranked.gold4)
      break
    case (profile.elo < 1075):
      member.roles.add(client.roles.ranked.plat1)
      break
    case (profile.elo < 1200):
      member.roles.add(client.roles.ranked.plat2)
      break
    case (profile.elo < 1325):
      member.roles.add(client.roles.ranked.plat3)
      break
    case (profile.elo < 1450):
      member.roles.add(client.roles.ranked.plat4)
      break
    case (profile.elo < 1700):
      member.roles.add(client.roles.ranked.emerald)
      break
    case (profile.elo < 2500):
      member.roles.add(client.roles.ranked.diamond)
      break
    case (profile.elo >= 2500):
      member.roles.add(client.roles.ranked.obsidian)
      break
  }
  return
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

const gameSetup = async (vc) => {
  let members = vc.members.array()
  const guild = await findOrCreateGuild(vc.guild.id)
  const gamesCat = vc.guild.channels.cache.get('809762815585943583')
  let team1 = []; let team2 = []
  team1[0] = members[Math.floor(Math.random() * members.length)]
  team2[0] = members[Math.floor(Math.random() * members.length)]
  while (team1[0] === team2[0]) {
    team2[0] = members[Math.floor(Math.random() * members.length)]
  }
  vc.guild.channels.create(`game ${totalGames++}`, {
    parent: gamesCat,
    topic: `${vc.name} queue game`,
    permissionOverwrites: [
      {
        id: vc.guild.roles.everyone.id,
        deny: ['VIEW_CHANNEL'],
      },
      {
        id: members[0].id,
        allow: [`VIEW_CHANNEL`]
      },
      {
        id: members[1].id,
        allow: [`VIEW_CHANNEL`]
      }
    ]
  }).then(async c => {
    let t1m = []; let t2m = []
    c.send(members.join(` `))
    members = removeItemOnce(members, team1[0])
    members = removeItemOnce(members, team2[0])
    let picker = team1[0]
    let teamSetup = new MessageEmbed()
      .setColor(client.config.color)
      .addField(`Team 1`, `**Leader:**\n${team1[0]}\n\n**Members:**\n${t1m[0] ? t1m.join(`\n`) : `No one`}`)
      .addField(`Team 2`, `**Leader:**\n${team2[0]}\n\n**Members:**\n${t2m[0] ? t2m.join(`\n`) : `No one`}`)
    await c.send(teamSetup)
    let picking = new MessageEmbed()
      .setColor(client.config.color)
      .setDescription(`${picker} it is your turn to pick a team member`)
      .addField(`Players available:`, members.join(`\n`))
      .setFooter(`Use ${guild.bot_prefix}pick {user} to choose someone for your team`)
    await c.send(picking)
    let filter = m => (m.content.startsWith(`${guild.bot_prefix}pick`) || m.content.startsWith(`${guild.bot_prefix}p`)) && m.author.id === picker.id;
    let collector = c.createMessageCollector(filter);
    collector.on('collect', async m => {
      if (m.mentions.members) var member = m.mentions.members.first()
      if (!member || !members.some(m => m.id === member.id)) { c.send(`That user is not an available player, try again`) }
      else {
        c.send(`You picked **${member.displayName}**`)
        collector.stop()
        picker = team2[0]
        members = removeItemOnce(members, member)
        await t1m.push(member)
        teamSetup.fields.length = 0; picking.fields.length = 0
        teamSetup.addField(`Team 1`, `**Leader:**\n${team1[0]}\n\n**Members:**\n${t1m[0] ? t1m.join(`\n`) : `No one`}`)
        teamSetup.addField(`Team 2`, `**Leader:**\n${team2[0]}\n\n**Members:**\n${t2m[0] ? t2m.join(`\n`) : `No one`}`)
        picking.setDescription(`${picker} it is your turn to pick a team member`)
        picking.addField(`Players available:`, members.join(`\n`))
        await c.send(teamSetup)
        await c.send(picking)

        let filter = m => (m.content.startsWith(`${guild.bot_prefix}pick`) || m.content.startsWith(`${guild.bot_prefix}p`)) && m.author.id === picker.id;
        let collector = c.createMessageCollector(filter);
        collector.on('collect', async m => {
          if (m.mentions.members) var member = m.mentions.members.first()
          if (!member || !members.some(m => m.id === member.id)) { c.send(`That user is not an available player, try again`) }
          else {
            c.send(`You picked **${member.displayName}**`)
            collector.stop()
            picker = team1[0]
            members = removeItemOnce(members, member)
            await t2m.push(member)
            teamSetup.fields.length = 0; picking.fields.length = 0
            teamSetup.addField(`Team 1`, `**Leader:**\n${team1[0]}\n\n**Members:**\n${t1m[0] ? t1m.join(`\n`) : `No one`}`)
            teamSetup.addField(`Team 2`, `**Leader:**\n${team2[0]}\n\n**Members:**\n${t2m[0] ? t2m.join(`\n`) : `No one`}`)
            picking.setDescription(`${picker} it is your turn to pick a team member`)
            picking.addField(`Players available:`, members.join(`\n`))
            await c.send(teamSetup)
            await c.send(picking)

            let filter = m => (m.content.startsWith(`${guild.bot_prefix}pick`) || m.content.startsWith(`${guild.bot_prefix}p`)) && m.author.id === picker.id;
            let collector = c.createMessageCollector(filter);
            collector.on('collect', async m => {
              if (m.mentions.members) var member = m.mentions.members.first()
              if (!member || !members.some(m => m.id === member.id)) { c.send(`That user is not an available player, try again`) }
              else {
                c.send(`You picked **${member.displayName}**`)
                collector.stop()
                picker = team2[0]
                members = removeItemOnce(members, member)
                await t1m.push(member)
                teamSetup.fields.length = 0; picking.fields.length = 0
                teamSetup.addField(`Team 1`, `**Leader:**\n${team1[0]}\n\n**Members:**\n${t1m[0] ? t1m.join(`\n`) : `No one`}`)
                teamSetup.addField(`Team 2`, `**Leader:**\n${team2[0]}\n\n**Members:**\n${t2m[0] ? t2m.join(`\n`) : `No one`}`)
                picking.setDescription(`${picker} it is your turn to pick a team member`)
                picking.addField(`Players available:`, members.join(`\n`))
                await c.send(teamSetup)
                await c.send(picking)

                let filter = m => (m.content.startsWith(`${guild.bot_prefix}pick`) || m.content.startsWith(`${guild.bot_prefix}p`)) && m.author.id === picker.id;
                let collector = c.createMessageCollector(filter);
                collector.on('collect', async m => {
                  if (m.mentions.members) var member = m.mentions.members.first()
                  if (!member || !members.some(m => m.id === member.id)) { c.send(`That user is not an available player, try again`) }
                  else {
                    c.send(`You picked **${member.displayName}**`)
                    collector.stop()
                    picker = team1[0]
                    members = removeItemOnce(members, member)
                    await t2m.push(member)
                    teamSetup.fields.length = 0; picking.fields.length = 0
                    teamSetup.addField(`Team 1`, `**Leader:**\n${team1[0]}\n\n**Members:**\n${t1m[0] ? t1m.join(`\n`) : `No one`}`)
                    teamSetup.addField(`Team 2`, `**Leader:**\n${team2[0]}\n\n**Members:**\n${t2m[0] ? t2m.join(`\n`) : `No one`}`)
                    picking.setDescription(`${picker} it is your turn to pick a team member`)
                    picking.addField(`Players available:`, members.join(`\n`))
                    await c.send(teamSetup)
                    await c.send(picking)

                    let filter = m => (m.content.startsWith(`${guild.bot_prefix}pick`) || m.content.startsWith(`${guild.bot_prefix}p`)) && m.author.id === picker.id;
                    let collector = c.createMessageCollector(filter);
                    collector.on('collect', async m => {
                      if (m.mentions.members) var member = m.mentions.members.first()
                      if (!member || !members.some(m => m.id === member.id)) { c.send(`That user is not an available player, try again`) }
                      else {
                        c.send(`You picked **${member.displayName}**`)
                        collector.stop()
                        members = removeItemOnce(members, member)
                        await t1m.push(member)
                        await t2m.push(members[0])
                        teamSetup.fields.length = 0; picking.fields.length = 0
                        teamSetup.addField(`Team 1`, `**Leader:**\n${team1[0]}\n\n**Members:**\n${t1m[0] ? t1m.join(`\n`) : `No one`}`)
                        teamSetup.addField(`Team 2`, `**Leader:**\n${team2[0]}\n\n**Members:**\n${t2m[0] ? t2m.join(`\n`) : `No one`}`)
                        await c.send(teamSetup)

                        c.send(`Teams have been chosen, now onto map selection`)
                        team1.concat(t1m); team2.concat(t2m)
                        const vcCat = vc.guild.channels.cache.get('810589886918819842')
                        vc.guild.channels.create(`🟢 Team - Game ${totalGames}`, {
                          parent: vcCat,
                          type: `voice`,
                          permissionOverwrites: [
                            {
                              id: vc.guild.roles.everyone.id,
                              deny: ['VIEW_CHANNEL'],
                            },
                            {
                              id: t1m[0].id,
                              allow: [`VIEW_CHANNEL`]
                            },
                            {
                              id: t1m[1].id,
                              allow: [`VIEW_CHANNEL`]
                            },
                            {
                              id: t1m[2].id,
                              allow: [`VIEW_CHANNEL`]
                            },
                            {
                              id: t1m[3].id,
                              allow: [`VIEW_CHANNEL`]
                            }
                          ]
                        }).then(async t1vc => {
                          t1m[0].voice.setChannel(t1vc)
                          t1m[1].voice.setChannel(t1vc)
                          t1m[2].voice.setChannel(t1vc)
                          t1m[3].voice.setChannel(t1vc)
                          vc.guild.channels.create(`🔴 Team - Game ${totalGames}`, {
                            parent: vcCat,
                            type: `voice`,
                            permissionOverwrites: [
                              {
                                id: vc.guild.roles.everyone.id,
                                deny: ['VIEW_CHANNEL'],
                              },
                              {
                                id: t2m[0].id,
                                allow: [`VIEW_CHANNEL`]
                              },
                              {
                                id: t2m[1].id,
                                allow: [`VIEW_CHANNEL`]
                              },
                              {
                                id: t2m[2].id,
                                allow: [`VIEW_CHANNEL`]
                              },
                              {
                                id: t2m[3].id,
                                allow: [`VIEW_CHANNEL`]
                              }
                            ]
                          }).then(async t2vc => {
                            t2m[0].voice.setChannel(t2vc)
                            t2m[1].voice.setChannel(t2vc)
                            t2m[2].voice.setChannel(t2vc)
                            t2m[3].voice.setChannel(t2vc)

                            


                          })
                        })
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  })
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
exports.eloChecker = eloChecker;
exports.gameSetup = gameSetup;
exports.cmdSetup = cmdSetup;
exports.eventSetup = eventSetup;