const { MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton } = require("discord.js");
const moment = require("moment");
const utils = require("../../functions/utils.js");
const axios = require('axios');

module.exports = {
    config: {
        name: "stats",
        aliases: ['statistics'],
        description: "Get a statistics page for a player",
    },
    run: async (server, message, args, pf) => {

        var player
        var stat
        var rbw
        var ign

        if (!args[0] && !pf.ign) {

            return message.channel.send(`No IGN has been given\nYou can link to one with \`${server.prefix}link <ign>\``);

        } else if (!args[0] && pf.ign) {

            player = await hypixel.player(pf.ign)
            stat = await hypixel.status(pf.ign)
            ign = pf.ign.toLowerCase()
            rbw = await axios.get(`https://api.rankedbedwars.org/profile/username/${pf.ign}`).catch(e => { })
        } else {

            player = await hypixel.player(args[0])
            stat = await hypixel.status(args[0])
            ign = args[0].toLowerCase()
            rbw = await axios.get(`https://api.rankedbedwars.org/profile/username/${args[0]}`).catch(e => { })
        }

        if (!player || !stat) {

            return message.channel.send(`Couldn't retrieve stats for that player`);

        } else if (!player.socialMedia) {
            const embed = new MessageEmbed()
                .setColor(pf.color)
                .setAuthor(player.displayname, `https://crafatar.com/renders/head/${player.uuid}?overlay`)
                .setThumbnail(`https://static.wikia.nocookie.net/minecraft_gamepedia/images/c/cd/Barrier_%28held%29_JE1_BE1.png`)
                .setDescription(`That player is **banned** or not on the Hypixel API`)

            return message.channel.send({ content: '\u200b', embeds: [embed] });
        }

        const bwstats = player.stats.Bedwars
        const skystats = player.stats.SkyWars
        const duelstats = player.stats.Duels

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId(`gamemode-${ign}`)
                    .setPlaceholder(`Select a gamemode`)
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions([{
                        label: 'Home',
                        value: 'home',
                        description: `Check their Network info`,
                        emoji: '873544037641109564',
                        default: true,
                    }, {
                        label: 'RBW',
                        value: 'rbw',
                        description: `Check their Ranked Bedwars stats`,
                        emoji: '876837427388502088'
                    }, {
                        label: 'SkyWars',
                        value: 'SkyWars',
                        description: `Check their SkyWars stats`,
                        emoji: '873519470533021706'
                    }, {
                        label: 'Bedwars',
                        value: 'Bedwars',
                        description: `Check their Bedwars stats`,
                        emoji: '873519470583365673'
                    }, {
                        label: 'Duels',
                        value: 'Duels',
                        description: `Check their Duels stats`,
                        emoji: '877610948117037067'
                    }])
            );

        const embed = new MessageEmbed()
            .setColor(pf.color)
            .setAuthor(player.displayname, `https://crafatar.com/renders/head/${player.uuid}?overlay`)
            .setThumbnail(await utils.findRank(player))
            .setDescription((stat.online ? `<:online:873552699885502504> ${stat.mode === `LOBBY` ? `Currently in **${stat.gameType.toLowerCase()}** lobby` : `Currently playing **${stat.gameType.toLowerCase()}**`}` : `<:offline:873552917922217984> Offline`) + `\n\nHypixel Level: **${Math.floor((Math.sqrt(player.networkExp + 15312.5) - 125 / Math.sqrt(2)) / (25 * Math.sqrt(2)))}**\nKarma: **${player.karma}**\nLast Login: **${moment(player.lastLogin).fromNow()}**\nLast Logout: **${moment(player.lastLogout).fromNow()}**\nNameMC Profile: [Click here](https://namemc.com/profile/${player.displayname})`)
            .addField(`\u200b`, `<:twitter:873544037590794270> ${player.socialMedia.links.TWITTER ? `[Click here](${player.socialMedia.links.TWITTER})` : `None`}\n<:youtube:873544037284605952> ${player.socialMedia.links.YOUTUBE ? `[Click here](${player.socialMedia.links.YOUTUBE})` : `None`}\n<:instagram:873544037708226590> ${player.socialMedia.links.INSTAGRAM ? `[Click here](${player.socialMedia.links.INSTAGRAM})` : `None`}`, true)
            .addField(`\u200b`, `\u200b`, true)
            .addField(`\u200b`, `<:twitch:873544036970037268> ${player.socialMedia.links.TWITCH ? `[Click here](https://${player.socialMedia.links.TWITCH})` : `None`}\n<:discord:873544037074866246> ${player.socialMedia.links.DISCORD ? player.socialMedia.links.DISCORD : `None`}\n<:hypixel:873544037641109564> ${player.socialMedia.links.HYPIXEL ? `[Click here](${player.socialMedia.links.HYPIXEL})` : `None`}`, true)

        await message.channel.send({ content: '\u200b', embeds: [embed], components: [row] });


        client.on('interactionCreate', async interaction => {
            if (interaction.isSelectMenu()) {
                if (interaction.customId.includes('gamemode') && interaction.customId.includes(ign) && interaction.user.id === message.author.id) {

                    if (interaction.values[0] == 'home') {

                        const embed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(player.displayname, `https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setThumbnail(await utils.findRank(player))
                            .setDescription((stat.online ? `<:online:873552699885502504> ${stat.mode === `LOBBY` ? `Currently in **${stat.gameType.toLowerCase()}** lobby` : `Currently playing **${stat.gameType.toLowerCase()}**`}` : `<:offline:873552917922217984> Offline`) + `\n\nHypixel Level: **${Math.floor((Math.sqrt(player.networkExp + 15312.5) - 125 / Math.sqrt(2)) / (25 * Math.sqrt(2)))}**\nKarma: **${player.karma}**\nLast Login: **${moment(player.lastLogin).format(`LL`)}**\nLast Logout: **${moment(player.lastLogout).format('LL')}**\nNameMC Profile: [Click here](https://namemc.com/profile/${player.displayname})`)
                            .addField(`\u200b`, `<:twitter:873544037590794270> ${player.socialMedia.links.TWITTER ? `[Click here](${player.socialMedia.links.TWITTER})` : `None`}\n<:youtube:873544037284605952> ${player.socialMedia.links.YOUTUBE ? `[Click here](${player.socialMedia.links.YOUTUBE})` : `None`}\n<:instagram:873544037708226590> ${player.socialMedia.links.INSTAGRAM ? `[Click here](${player.socialMedia.links.INSTAGRAM})` : `None`}`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `<:twitch:873544036970037268> ${player.socialMedia.links.TWITCH ? `[Click here](https://${player.socialMedia.links.TWITCH})` : `None`}\n<:discord:873544037074866246> ${player.socialMedia.links.DISCORD ? player.socialMedia.links.DISCORD : `None`}\n<:hypixel:873544037641109564> ${player.socialMedia.links.HYPIXEL ? `[Click here](${player.socialMedia.links.HYPIXEL})` : `None`}`, true)

                        row.components.length = 0
                        row.addComponents(
                            new MessageSelectMenu()
                                .setCustomId(`gamemode-${ign}`)
                                .setPlaceholder(`Select a gamemode`)
                                .setMinValues(1)
                                .setMaxValues(1)
                                .addOptions([{
                                    label: 'Home',
                                    value: 'home',
                                    description: `Check their Network info`,
                                    emoji: '873544037641109564',
                                    default: true,
                                }, {
                                    label: 'RBW',
                                    value: 'rbw',
                                    description: `Check their Ranked Bedwars stats`,
                                    emoji: '876837427388502088'
                                }, {
                                    label: 'SkyWars',
                                    value: 'SkyWars',
                                    description: `Check their SkyWars stats`,
                                    emoji: '873519470533021706'
                                }, {
                                    label: 'Bedwars',
                                    value: 'Bedwars',
                                    description: `Check their Bedwars stats`,
                                    emoji: '873519470583365673'
                                }, {
                                    label: 'Duels',
                                    value: 'Duels',
                                    description: `Check their Duels stats`,
                                    emoji: '877610948117037067'
                                }])
                        );
                        interaction.message.edit({ content: '\u200b', embeds: [embed], components: [row] });
                        interaction.deferUpdate()

                    } else if (interaction.values[0] == 'rbw') {

                        if (!rbw) {
                            const infoembed = new MessageEmbed()
                                .setColor(pf.color)
                                .setAuthor(`RBW | ${player.displayname}`)
                                .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                                .setDescription(`Couldn't find their RBW profile`)

                            row.components.length = 0
                            row.addComponents(
                                new MessageSelectMenu()
                                    .setCustomId(`gamemode-${ign}`)
                                    .setPlaceholder(`Select a gamemode`)
                                    .setMinValues(1)
                                    .setMaxValues(1)
                                    .addOptions([{
                                        label: 'Home',
                                        value: 'home',
                                        description: `Check their Network info`,
                                        emoji: '873544037641109564',
                                    }, {
                                        label: 'RBW',
                                        value: 'rbw',
                                        description: `Check their Ranked Bedwars stats`,
                                        emoji: '876837427388502088',
                                        default: true,
                                    }, {
                                        label: 'SkyWars',
                                        value: 'SkyWars',
                                        description: `Check their SkyWars stats`,
                                        emoji: '873519470533021706'
                                    }, {
                                        label: 'Bedwars',
                                        value: 'Bedwars',
                                        description: `Check their Bedwars stats`,
                                        emoji: '873519470583365673'
                                    }, {
                                        label: 'Duels',
                                        value: 'Duels',
                                        description: `Check their Duels stats`,
                                        emoji: '877610948117037067'
                                    }])
                            );
                            interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row] });
                            return interaction.deferUpdate()
                        }


                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`RBW | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .addField(`\u200b`, `Experience: **${await utils.checkValues(rbw.data.experience)}**\nCoins: **${await utils.checkValues(rbw.data.coins)}**\nPrestige: **${await utils.checkValues(rbw.data.prestige)}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Nickname: **\`${rbw.data.nickname ? rbw.data.nickname : `None`}\`**\nInvites: **${await utils.checkValues(rbw.data.invites)}**\nStrikes: **${await utils.checkValues(rbw.data.strikes)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`rbwgeneral-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`General`),
                                new MessageButton()
                                    .setCustomId(`rbwunranked-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Unranked`),
                                new MessageButton()
                                    .setCustomId(`rbwranked-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Ranked`),
                            ])
                        row.components.length = 0
                        row.addComponents(
                            new MessageSelectMenu()
                                .setCustomId(`gamemode-${ign}`)
                                .setPlaceholder(`Select a gamemode`)
                                .setMinValues(1)
                                .setMaxValues(1)
                                .addOptions([{
                                    label: 'Home',
                                    value: 'home',
                                    description: `Check their Network info`,
                                    emoji: '873544037641109564',
                                }, {
                                    label: 'RBW',
                                    value: 'rbw',
                                    description: `Check their Ranked Bedwars stats`,
                                    emoji: '876837427388502088',
                                    default: true,
                                }, {
                                    label: 'SkyWars',
                                    value: 'SkyWars',
                                    description: `Check their SkyWars stats`,
                                    emoji: '873519470533021706',
                                }, {
                                    label: 'Bedwars',
                                    value: 'Bedwars',
                                    description: `Check their Bedwars stats`,
                                    emoji: '873519470583365673'
                                }, {
                                    label: 'Duels',
                                    value: 'Duels',
                                    description: `Check their Duels stats`,
                                    emoji: '877610948117037067'
                                }])
                        );
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()

                    } else if (interaction.values[0] == 'SkyWars') {
                        let wlr = await utils.checkValues((skystats.wins / skystats.losses).toFixed(2))
                        let kdr = await utils.checkValues((skystats.kills / skystats.deaths).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`SkyWars | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * skystats.losses - skystats.wins)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * skystats.deaths - skystats.kills)}**`)
                            .addField(`\u200b`, `Level: **${await utils.checkValues(skystats.levelFormatted.substr(2))}**\n\nWins: **${await utils.checkValues(skystats.wins)}**\nLosses: **${await utils.checkValues(skystats.losses)}**\nW/L Ratio: **${wlr}**\n\nKills: **${await utils.checkValues(skystats.kills)}**\nDeaths: **${await utils.checkValues(skystats.deaths)}**\nK/D Ratio: **${kdr}**\nQuits: **${await utils.checkValues(skystats.quits)}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Melee Kills: **${await utils.checkValues(skystats.melee_kills)}**\nBow Kills: **${await utils.checkValues(skystats.bow_kills)}**\nVoid Kills: **${await utils.checkValues(skystats.void_kills)}**\n\nArrows Shot: **${await utils.checkValues(skystats.arrows_shot)}**\nArrows Hit: **${await utils.checkValues(skystats.arrows_hit)}**\n\nChests Opened: **${await utils.checkValues(skystats.chests_opened)}**\nEnderpearls Thrown: **${await utils.checkValues(skystats.enderpearls_thrown)}**\nSouls Gathered: **${await utils.checkValues(skystats.souls_gathered)}**\nHeads: **${await utils.checkValues(skystats.heads)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`stotal-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`ssolo-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`sdoubles-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Doubles`),
                            ])
                        row.components.length = 0
                        row.addComponents(
                            new MessageSelectMenu()
                                .setCustomId(`gamemode-${ign}`)
                                .setPlaceholder(`Select a gamemode`)
                                .setMinValues(1)
                                .setMaxValues(1)
                                .addOptions([{
                                    label: 'Home',
                                    value: 'home',
                                    description: `Check their Network info`,
                                    emoji: '873544037641109564',
                                }, {
                                    label: 'RBW',
                                    value: 'rbw',
                                    description: `Check their Ranked Bedwars stats`,
                                    emoji: '876837427388502088'
                                }, {
                                    label: 'SkyWars',
                                    value: 'SkyWars',
                                    description: `Check their SkyWars stats`,
                                    emoji: '873519470533021706',
                                    default: true,
                                }, {
                                    label: 'Bedwars',
                                    value: 'Bedwars',
                                    description: `Check their Bedwars stats`,
                                    emoji: '873519470583365673'
                                }, {
                                    label: 'Duels',
                                    value: 'Duels',
                                    description: `Check their Duels stats`,
                                    emoji: '877610948117037067'
                                }])
                        );
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()

                    } else if (interaction.values[0] == 'Bedwars') {
                        let wlr = await utils.checkValues((bwstats.wins_bedwars / bwstats.losses_bedwars).toFixed(2))
                        let kdr = await utils.checkValues((bwstats.kills_bedwars / bwstats.deaths_bedwars).toFixed(2))
                        let blr = await utils.checkValues((bwstats.beds_broken_bedwars / bwstats.beds_lost_bedwars).toFixed(2))
                        let fkdr = await utils.checkValues((bwstats.final_kills_bedwars / bwstats.final_deaths_bedwars).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Bedwars | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * bwstats.losses_bedwars - bwstats.wins_bedwars)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * bwstats.deaths_bedwars - bwstats.kills_bedwars)}**\nBeds broken to **${await utils.checkValues(Math.ceil(blr))}** BB/BL Ratio: **${await utils.checkValues(Math.ceil(blr) * bwstats.beds_lost_bedwars - bwstats.beds_broken_bedwars)}**\nFinal kills to **${await utils.checkValues(Math.ceil(fkdr))}** Final K/D Ratio: **${await utils.checkValues(Math.ceil(fkdr) * bwstats.final_deaths_bedwars - bwstats.final_kills_bedwars)}**`)
                            .addField(`\u200b`, `Level: **${await utils.checkValues(player.achievements.bedwars_level)}**\nCoins: **${await utils.checkValues(bwstats.coins)}**\nWinstreak: **${await utils.checkValues(bwstats.winstreak)}**\n\nBeds Broken: **${await utils.checkValues(bwstats.beds_broken_bedwars)}**\nBeds Lost: **${await utils.checkValues(bwstats.beds_lost_bedwars)}**\nBB/BL Ratio: **${blr}**\n\nKills: **${await utils.checkValues(bwstats.kills_bedwars)}**\nDeaths: **${await utils.checkValues(bwstats.deaths_bedwars)}**\nK/D Ratio: **${kdr}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Final Kills: **${await utils.checkValues(bwstats.final_kills_bedwars)}**\nFinal Deaths: **${await utils.checkValues(bwstats.final_deaths_bedwars)}**\nFinal K/D Ratio: **${fkdr}**\n\nWins: **${await utils.checkValues(bwstats.wins_bedwars)}**\nLosses: **${await utils.checkValues(bwstats.losses_bedwars)}**\nW/L Ratio: **${wlr}**\n\nEmeralds Collected: **${await utils.checkValues(bwstats.emerald_resources_collected_bedwars)}**\nDiamonds Collected: **${await utils.checkValues(bwstats.diamond_resources_collected_bedwars)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`btotal-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`bsolo-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`bdoubles-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Doubles`),
                                new MessageButton()
                                    .setCustomId(`btrios-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`3s`),
                                new MessageButton()
                                    .setCustomId(`bfours-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`4s`)
                            ])
                        row.components.length = 0
                        row.addComponents(
                            new MessageSelectMenu()
                                .setCustomId(`gamemode-${ign}`)
                                .setPlaceholder(`Select a gamemode`)
                                .setMinValues(1)
                                .setMaxValues(1)
                                .addOptions([{
                                    label: 'Home',
                                    value: 'home',
                                    description: `Check their Network info`,
                                    emoji: '873544037641109564',
                                }, {
                                    label: 'RBW',
                                    value: 'rbw',
                                    description: `Check their Ranked Bedwars stats`,
                                    emoji: '876837427388502088'
                                }, {
                                    label: 'SkyWars',
                                    value: 'SkyWars',
                                    description: `Check their SkyWars stats`,
                                    emoji: '873519470533021706'
                                }, {
                                    label: 'Bedwars',
                                    value: 'Bedwars',
                                    description: `Check their Bedwars stats`,
                                    emoji: '873519470583365673',
                                    default: true,
                                }, {
                                    label: 'Duels',
                                    value: 'Duels',
                                    description: `Check their Duels stats`,
                                    emoji: '877610948117037067'
                                }])
                        );
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()

                    } else if (interaction.values[0] == 'Duels') {
                        let wlr = await utils.checkValues((duelstats.wins / duelstats.losses).toFixed(2))
                        let kdr = await utils.checkValues((duelstats.kills / duelstats.deaths).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Duels | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * duelstats.losses - duelstats.wins)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * duelstats.deaths - duelstats.kills)}**`)
                            .addField(`\u200b`, `Coins: **${await utils.checkValues(duelstats.coins)}**\n\nWins: **${await utils.checkValues(duelstats.wins)}**\nLosses: **${await utils.checkValues(duelstats.losses)}**\nW/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * duelstats.losses - duelstats.wins)}**\n\nArrows Shot: **${duelstats.bow_shots}**\nArrows Hit: **${duelstats.bow_hits}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Kills: **${await utils.checkValues(duelstats.kills)}**\nDeaths: **${await utils.checkValues(duelstats.deaths)}**\nK/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * duelstats.kills - duelstats.deaths)}**\n\nMelee Swings: **${duelstats.melee_swings}**\nMelee Hits: **${duelstats.melee_hits}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`dtotal-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`duhc-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`UHC 1v1`),
                                new MessageButton()
                                    .setCustomId(`dsumo-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Sumo`),
                                new MessageButton()
                                    .setCustomId(`dop-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`OP`),
                            ])

                        const row3 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`dclassic-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Classic`),
                                new MessageButton()
                                    .setCustomId(`dbridge-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Bridge 1v1`),
                                new MessageButton()
                                    .setCustomId(`dbteams-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Bridge Teams`),
                            ])

                        row.components.length = 0
                        row.addComponents(
                            new MessageSelectMenu()
                                .setCustomId(`gamemode-${ign}`)
                                .setPlaceholder(`Select a gamemode`)
                                .setMinValues(1)
                                .setMaxValues(1)
                                .addOptions([{
                                    label: 'Home',
                                    value: 'home',
                                    description: `Check their Network info`,
                                    emoji: '873544037641109564',
                                }, {
                                    label: 'RBW',
                                    value: 'rbw',
                                    description: `Check their Ranked Bedwars stats`,
                                    emoji: '876837427388502088'
                                }, {
                                    label: 'SkyWars',
                                    value: 'SkyWars',
                                    description: `Check their SkyWars stats`,
                                    emoji: '873519470533021706'
                                }, {
                                    label: 'Bedwars',
                                    value: 'Bedwars',
                                    description: `Check their Bedwars stats`,
                                    emoji: '873519470583365673',
                                }, {
                                    label: 'Duels',
                                    value: 'Duels',
                                    description: `Check their Duels stats`,
                                    emoji: '877610948117037067',
                                    default: true,
                                }])
                        );
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row3, row] });
                        interaction.deferUpdate()
                    }
                }




            } else if (interaction.isButton()) {
                if (interaction.user.id === message.author.id) {
                    if (interaction.customId.includes('rbwgeneral') && interaction.customId.includes(ign)) {

                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`RBW | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .addField(`\u200b`, `Experience: **${await utils.checkValues(rbw.data.experience)}**\nCoins: **${await utils.checkValues(rbw.data.coins)}**\nPrestige: **${await utils.checkValues(rbw.data.prestige)}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Nickname: **\`${rbw.data.nickname ? rbw.data.nickname : `None`}\`**\nInvites: **${await utils.checkValues(rbw.data.invites)}**\nStrikes: **${await utils.checkValues(rbw.data.strikes)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`rbwgeneral-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`General`),
                                new MessageButton()
                                    .setCustomId(`rbwunranked-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Unranked`),
                                new MessageButton()
                                    .setCustomId(`rbwranked-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Ranked`),
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    } else if (interaction.customId.includes('rbwunranked') && interaction.customId.includes(ign)) {
                        let wlr = await utils.checkValues((rbw.data.profiles.unranked.wins / rbw.data.profiles.unranked.losses).toFixed(2))
                        let kdr = await utils.checkValues((rbw.data.profiles.unranked.kills / rbw.data.profiles.unranked.deaths).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`RBW | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * rbw.data.profiles.unranked.losses - rbw.data.profiles.unranked.wins)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * rbw.data.profiles.unranked.deaths - rbw.data.profiles.unranked.kills)}**`)
                            .addField(`\u200b`, `Elo: **${await utils.checkValues(rbw.data.profiles.unranked.rating)}**\nHighest Elo: **${await utils.checkValues(rbw.data.profiles.unranked.high)}**\n\nWins: **${await utils.checkValues(rbw.data.profiles.unranked.wins)}**\nLosses: **${await utils.checkValues(rbw.data.profiles.unranked.losses)}**\nW/L Ratio: **${wlr}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `MVPs: **${await utils.checkValues(rbw.data.profiles.unranked.mvps)}**\nWin Streak: **${await utils.checkValues(rbw.data.profiles.unranked.winstreak)}**\nLose Streak: **${await utils.checkValues(rbw.data.profiles.unranked.losestreak)}**\n\nKills: **${await utils.checkValues(rbw.data.profiles.unranked.kills)}**\nDeaths: **${await utils.checkValues(rbw.data.profiles.unranked.deaths)}**\nK/D Ratio: **${kdr}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`rbwgeneral-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`General`),
                                new MessageButton()
                                    .setCustomId(`rbwunranked-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Unranked`),
                                new MessageButton()
                                    .setCustomId(`rbwranked-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Ranked`),
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    } else if (interaction.customId.includes('rbwranked') && interaction.customId.includes(ign)) {
                        let wlr = await utils.checkValues((rbw.data.profiles.ranked.wins / rbw.data.profiles.ranked.losses).toFixed(2))
                        let kdr = await utils.checkValues((rbw.data.profiles.ranked.kills / rbw.data.profiles.ranked.deaths).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`RBW | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * rbw.data.profiles.ranked.losses - rbw.data.profiles.ranked.wins)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * rbw.data.profiles.ranked.deaths - rbw.data.profiles.ranked.kills)}**`)
                            .addField(`\u200b`, `Elo: **${await utils.checkValues(rbw.data.profiles.ranked.rating)}**\nHighest Elo: **${await utils.checkValues(rbw.data.profiles.ranked.high)}**\n\nWins: **${await utils.checkValues(rbw.data.profiles.ranked.wins)}**\nLosses: **${await utils.checkValues(rbw.data.profiles.ranked.losses)}**\nW/L Ratio: **${wlr}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `MVPs: **${await utils.checkValues(rbw.data.profiles.ranked.mvps)}**\nWin Streak: **${await utils.checkValues(rbw.data.profiles.ranked.winstreak)}**\nLose Streak: **${await utils.checkValues(rbw.data.profiles.ranked.losestreak)}**\n\nKills: **${await utils.checkValues(rbw.data.profiles.ranked.kills)}**\nDeaths: **${await utils.checkValues(rbw.data.profiles.ranked.deaths)}**\nK/D Ratio: **${kdr}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`rbwgeneral-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`General`),
                                new MessageButton()
                                    .setCustomId(`rbwunranked-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Unranked`),
                                new MessageButton()
                                    .setCustomId(`rbwranked-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Ranked`),
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    } else if (interaction.customId.includes('stotal') && interaction.customId.includes(ign)) {
                        let wlr = await utils.checkValues((skystats.wins / skystats.losses).toFixed(2))
                        let kdr = await utils.checkValues((skystats.kills / skystats.deaths).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`SkyWars | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * skystats.losses - skystats.wins)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * skystats.deaths - skystats.kills)}**`)
                            .addField(`\u200b`, `Level: **${await utils.checkValues(skystats.levelFormatted.substr(2))}**\n\nWins: **${await utils.checkValues(skystats.wins)}**\nLosses: **${await utils.checkValues(skystats.losses)}**\nW/L Ratio: **${wlr}**\n\nKills: **${await utils.checkValues(skystats.kills)}**\nDeaths: **${await utils.checkValues(skystats.deaths)}**\nK/D Ratio: **${kdr}**\nQuits: **${await utils.checkValues(skystats.quits)}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Melee Kills: **${await utils.checkValues(skystats.melee_kills)}**\nBow Kills: **${await utils.checkValues(skystats.bow_kills)}**\nVoid Kills: **${await utils.checkValues(skystats.void_kills)}**\n\nArrows Shot: **${await utils.checkValues(skystats.arrows_shot)}**\nArrows Hit: **${await utils.checkValues(skystats.arrows_hit)}**\n\nChests Opened: **${await utils.checkValues(skystats.chests_opened)}**\nEnderpearls Thrown: **${await utils.checkValues(skystats.enderpearls_thrown)}**\nSouls Gathered: **${await utils.checkValues(skystats.souls_gathered)}**\nHeads: **${await utils.checkValues(skystats.heads)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`stotal-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`ssolo-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`sdoubles-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Doubles`),
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    } else if (interaction.customId.includes('ssolo') && interaction.customId.includes(ign)) {
                        let wlr = await utils.checkValues((skystats.wins_solo / skystats.losses_solo).toFixed(2))
                        let kdr = await utils.checkValues((skystats.kills_solo / skystats.deaths_solo).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`SkyWars Solo | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * skystats.losses_solo - skystats.wins_solo)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * skystats.deaths_solo - skystats.kills_solo)}**`)
                            .addField(`\u200b`, `Wins: **${await utils.checkValues(skystats.wins_solo)}**\nLosses: **${await utils.checkValues(skystats.losses_solo)}**\nW/L Ratio: **${wlr}**\n\nKills: **${await utils.checkValues(skystats.kills_solo)}**\nDeaths: **${await utils.checkValues(skystats.deaths_solo)}**\nK/D Ratio: **${kdr}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Melee Kills: **${await utils.checkValues(skystats.melee_kills_solo)}**\nBow Kills: **${await utils.checkValues(skystats.bow_kills_solo)}**\nVoid Kills: **${await utils.checkValues(skystats.void_kills_solo)}**\n\nArrows Shot: **${await utils.checkValues(skystats.arrows_shot_solo)}**\nArrows Hit: **${await utils.checkValues(skystats.arrows_hit_solo)}**\n\nChests Opened: **${await utils.checkValues(skystats.chests_opened_solo)}**\nHeads: **${await utils.checkValues(skystats.heads_solo)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`stotal-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`ssolo-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`sdoubles-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Doubles`),
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    } else if (interaction.customId.includes('sdoubles') && interaction.customId.includes(ign)) {
                        let wlr = await utils.checkValues((skystats.wins_team / skystats.losses_team).toFixed(2))
                        let kdr = await utils.checkValues((skystats.kills_team / skystats.deaths_team).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`SkyWars Doubles | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * skystats.losses_team - skystats.wins_team)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * skystats.deaths_team - skystats.kills_team)}**`)
                            .addField(`\u200b`, `Wins: **${await utils.checkValues(skystats.wins_team)}**\nLosses: **${await utils.checkValues(skystats.losses_team)}**\nW/L Ratio: **${wlr}**\n\nKills: **${await utils.checkValues(skystats.kills_team)}**\nDeaths: **${await utils.checkValues(skystats.deaths_team)}**\nK/D Ratio: **${kdr}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Melee Kills: **${await utils.checkValues(skystats.melee_kills_team)}**\nBow Kills: **${await utils.checkValues(skystats.bow_kills_team)}**\nVoid Kills: **${await utils.checkValues(skystats.void_kills_team)}**\n\nArrows Shot: **${await utils.checkValues(skystats.arrows_shot_team)}**\nArrows Hit: **${await utils.checkValues(skystats.arrows_hit_team)}**\n\nChests Opened: **${await utils.checkValues(skystats.chests_opened_team)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`stotal-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`ssolo-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`sdoubles-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Doubles`),
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    } else if (interaction.customId.includes('btotal') && interaction.customId.includes(ign)) {
                        let wlr = await utils.checkValues((bwstats.wins_bedwars / bwstats.losses_bedwars).toFixed(2))
                        let kdr = await utils.checkValues((bwstats.kills_bedwars / bwstats.deaths_bedwars).toFixed(2))
                        let blr = await utils.checkValues((bwstats.beds_broken_bedwars / bwstats.beds_lost_bedwars).toFixed(2))
                        let fkdr = await utils.checkValues((bwstats.final_kills_bedwars / bwstats.final_deaths_bedwars).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Bedwars | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * bwstats.losses_bedwars - bwstats.wins_bedwars)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * bwstats.deaths_bedwars - bwstats.kills_bedwars)}**\nBeds broken to **${await utils.checkValues(Math.ceil(blr))}** BB/BL Ratio: **${await utils.checkValues(Math.ceil(blr) * bwstats.beds_lost_bedwars - bwstats.beds_broken_bedwars)}**\nFinal kills to **${await utils.checkValues(Math.ceil(fkdr))}** Final K/D Ratio: **${await utils.checkValues(Math.ceil(fkdr) * bwstats.final_deaths_bedwars - bwstats.final_kills_bedwars)}**`)
                            .addField(`\u200b`, `Level: **${await utils.checkValues(player.achievements.bedwars_level)}**\nCoins: **${await utils.checkValues(bwstats.coins)}**\nWinstreak: **${await utils.checkValues(bwstats.winstreak)}**\n\nBeds Broken: **${await utils.checkValues(bwstats.beds_broken_bedwars)}**\nBeds Lost: **${await utils.checkValues(bwstats.beds_lost_bedwars)}**\nBB/BL Ratio: **${blr}**\n\nKills: **${await utils.checkValues(bwstats.kills_bedwars)}**\nDeaths: **${await utils.checkValues(bwstats.deaths_bedwars)}**\nK/D Ratio: **${kdr}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Final Kills: **${await utils.checkValues(bwstats.final_kills_bedwars)}**\nFinal Deaths: **${await utils.checkValues(bwstats.final_deaths_bedwars)}**\nFinal K/D Ratio: **${fkdr}**\n\nWins: **${await utils.checkValues(bwstats.wins_bedwars)}**\nLosses: **${await utils.checkValues(bwstats.losses_bedwars)}**\nW/L Ratio: **${wlr}**\n\nEmeralds Collected: **${await utils.checkValues(bwstats.emerald_resources_collected_bedwars)}**\nDiamonds Collected: **${await utils.checkValues(bwstats.diamond_resources_collected_bedwars)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`btotal-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`bsolo-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`bdoubles-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Doubles`),
                                new MessageButton()
                                    .setCustomId(`btrios-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`3s`),
                                new MessageButton()
                                    .setCustomId(`bfours-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`4s`)
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    } else if (interaction.customId.includes('bsolo') && interaction.customId.includes(ign)) {
                        let wlr = await utils.checkValues((bwstats.eight_one_wins_bedwars / bwstats.eight_one_losses_bedwars).toFixed(2))
                        let kdr = await utils.checkValues((bwstats.eight_one_kills_bedwars / bwstats.eight_one_deaths_bedwars).toFixed(2))
                        let blr = await utils.checkValues((bwstats.eight_one_beds_broken_bedwars / bwstats.eight_one_beds_lost_bedwars).toFixed(2))
                        let fkdr = await utils.checkValues((bwstats.eight_one_final_kills_bedwars / bwstats.eight_one_final_deaths_bedwars).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Bedwars Solo | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * bwstats.eight_one_losses_bedwars - bwstats.eight_one_wins_bedwars)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * bwstats.eight_one_deaths_bedwars - bwstats.eight_one_kills_bedwars)}**\nBeds broken to **${await utils.checkValues(Math.ceil(blr))}** BB/BL Ratio: **${await utils.checkValues(Math.ceil(blr) * bwstats.eight_one_beds_lost_bedwars - bwstats.eight_one_beds_broken_bedwars)}**\nFinal kills to **${await utils.checkValues(Math.ceil(fkdr))}** Final K/D Ratio: **${await utils.checkValues(Math.ceil(fkdr) * bwstats.eight_one_final_deaths_bedwars - bwstats.eight_one_final_kills_bedwars)}**`)
                            .addField(`\u200b`, `Kills: **${await utils.checkValues(bwstats.eight_one_kills_bedwars)}**\nDeaths: **${await utils.checkValues(bwstats.eight_one_deaths_bedwars)}**\nK/D Ratio: **${kdr}**\n\nBeds Broken: **${await utils.checkValues(bwstats.eight_one_beds_broken_bedwars)}**\nBeds Lost: **${await utils.checkValues(bwstats.eight_one_beds_lost_bedwars)}**\nBB/BL Ratio: **${blr}**\n\nEmeralds Collected: **${await utils.checkValues(bwstats.eight_one_emerald_resources_collected_bedwars)}**\nDiamonds Collected: **${await utils.checkValues(bwstats.eight_one_diamond_resources_collected_bedwars)}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Final Kills: **${await utils.checkValues(bwstats.eight_one_final_kills_bedwars)}**\nFinal Deaths: **${await utils.checkValues(bwstats.eight_one_final_deaths_bedwars)}**\nFinal K/D Ratio: **${fkdr}**\n\nWins: **${await utils.checkValues(bwstats.eight_one_wins_bedwars)}**\nLosses: **${await utils.checkValues(bwstats.eight_one_losses_bedwars)}**\nW/L Ratio: **${wlr}**\n\nWinstreak: **${await utils.checkValues(bwstats.eight_one_winstreak)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`btotal-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`bsolo-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`bdoubles-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Doubles`),
                                new MessageButton()
                                    .setCustomId(`btrios-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`3s`),
                                new MessageButton()
                                    .setCustomId(`bfours-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`4s`)
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    } else if (interaction.customId.includes('bdoubles') && interaction.customId.includes(ign)) {
                        let wlr = await utils.checkValues((bwstats.eight_two_wins_bedwars / bwstats.eight_two_losses_bedwars).toFixed(2))
                        let kdr = await utils.checkValues((bwstats.eight_two_kills_bedwars / bwstats.eight_two_deaths_bedwars).toFixed(2))
                        let blr = await utils.checkValues((bwstats.eight_two_beds_broken_bedwars / bwstats.eight_two_beds_lost_bedwars).toFixed(2))
                        let fkdr = await utils.checkValues((bwstats.eight_two_final_kills_bedwars / bwstats.eight_two_final_deaths_bedwars).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Bedwars Doubles | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * bwstats.eight_two_losses_bedwars - bwstats.eight_two_wins_bedwars)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * bwstats.eight_two_deaths_bedwars - bwstats.eight_two_kills_bedwars)}**\nBeds broken to **${await utils.checkValues(Math.ceil(blr))}** BB/BL Ratio: **${await utils.checkValues(Math.ceil(blr) * bwstats.eight_two_beds_lost_bedwars - bwstats.eight_two_beds_broken_bedwars)}**\nFinal kills to **${await utils.checkValues(Math.ceil(fkdr))}** Final K/D Ratio: **${await utils.checkValues(Math.ceil(fkdr) * bwstats.eight_two_final_deaths_bedwars - bwstats.eight_two_final_kills_bedwars)}**`)
                            .addField(`\u200b`, `Kills: **${await utils.checkValues(bwstats.eight_two_kills_bedwars)}**\nDeaths: **${await utils.checkValues(bwstats.eight_two_deaths_bedwars)}**\nK/D Ratio: **${kdr}**\n\nBeds Broken: **${await utils.checkValues(bwstats.eight_two_beds_broken_bedwars)}**\nBeds Lost: **${await utils.checkValues(bwstats.eight_two_beds_lost_bedwars)}**\nBB/BL Ratio: **${blr}**\n\nEmeralds Collected: **${await utils.checkValues(bwstats.eight_two_emerald_resources_collected_bedwars)}**\nDiamonds Collected: **${await utils.checkValues(bwstats.eight_two_diamond_resources_collected_bedwars)}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Final Kills: **${await utils.checkValues(bwstats.eight_two_final_kills_bedwars)}**\nFinal Deaths: **${await utils.checkValues(bwstats.eight_two_final_deaths_bedwars)}**\nFinal K/D Ratio: **${fkdr}**\n\nWins: **${await utils.checkValues(bwstats.eight_two_wins_bedwars)}**\nLosses: **${await utils.checkValues(bwstats.eight_two_losses_bedwars)}**\nW/L Ratio: **${wlr}**\n\nWinstreak: **${await utils.checkValues(bwstats.eight_two_winstreak)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`btotal-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`bsolo-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`bdoubles-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Doubles`),
                                new MessageButton()
                                    .setCustomId(`btrios-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`3s`),
                                new MessageButton()
                                    .setCustomId(`bfours-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`4s`)
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    } else if (interaction.customId.includes('btrios') && interaction.customId.includes(ign)) {
                        let wlr = await utils.checkValues((bwstats.four_three_wins_bedwars / bwstats.four_three_losses_bedwars).toFixed(2))
                        let kdr = await utils.checkValues((bwstats.four_three_kills_bedwars / bwstats.four_three_deaths_bedwars).toFixed(2))
                        let blr = await utils.checkValues((bwstats.four_three_beds_broken_bedwars / bwstats.four_three_beds_lost_bedwars).toFixed(2))
                        let fkdr = await utils.checkValues((bwstats.four_three_final_kills_bedwars / bwstats.four_three_final_deaths_bedwars).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Bedwars 3s | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * bwstats.four_three_losses_bedwars - bwstats.four_three_wins_bedwars)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * bwstats.four_three_deaths_bedwars - bwstats.four_three_kills_bedwars)}**\nBeds broken to **${await utils.checkValues(Math.ceil(blr))}** BB/BL Ratio: **${await utils.checkValues(Math.ceil(blr) * bwstats.four_three_beds_lost_bedwars - bwstats.four_three_beds_broken_bedwars)}**\nFinal kills to **${await utils.checkValues(Math.ceil(fkdr))}** Final K/D Ratio: **${await utils.checkValues(Math.ceil(fkdr) * bwstats.four_three_final_deaths_bedwars - bwstats.four_three_final_kills_bedwars)}**`)
                            .addField(`\u200b`, `Kills: **${await utils.checkValues(bwstats.four_three_kills_bedwars)}**\nDeaths: **${await utils.checkValues(bwstats.four_three_deaths_bedwars)}**\nK/D Ratio: **${kdr}**\n\nBeds Broken: **${await utils.checkValues(bwstats.four_three_beds_broken_bedwars)}**\nBeds Lost: **${await utils.checkValues(bwstats.four_three_beds_lost_bedwars)}**\nBB/BL Ratio: **${blr}**\n\nEmeralds Collected: **${await utils.checkValues(bwstats.four_three_emerald_resources_collected_bedwars)}**\nDiamonds Collected: **${await utils.checkValues(bwstats.four_three_diamond_resources_collected_bedwars)}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Final Kills: **${await utils.checkValues(bwstats.four_three_final_kills_bedwars)}**\nFinal Deaths: **${await utils.checkValues(bwstats.four_three_final_deaths_bedwars)}**\nFinal K/D Ratio: **${fkdr}**\n\nWins: **${await utils.checkValues(bwstats.four_three_wins_bedwars)}**\nLosses: **${await utils.checkValues(bwstats.four_three_losses_bedwars)}**\nW/L Ratio: **${wlr}**\n\nWinstreak: **${await utils.checkValues(bwstats.four_three_winstreak)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`btotal-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`bsolo-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`bdoubles-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Doubles`),
                                new MessageButton()
                                    .setCustomId(`btrios-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`3s`),
                                new MessageButton()
                                    .setCustomId(`bfours-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`4s`)
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    } else if (interaction.customId.includes('bfours') && interaction.customId.includes(ign)) {
                        let wlr = await utils.checkValues((bwstats.four_four_wins_bedwars / bwstats.four_four_losses_bedwars).toFixed(2))
                        let kdr = await utils.checkValues((bwstats.four_four_kills_bedwars / bwstats.four_four_deaths_bedwars).toFixed(2))
                        let blr = await utils.checkValues((bwstats.four_four_beds_broken_bedwars / bwstats.four_four_beds_lost_bedwars).toFixed(2))
                        let fkdr = await utils.checkValues((bwstats.four_four_final_kills_bedwars / bwstats.four_four_final_deaths_bedwars).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Bedwars 4s | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * bwstats.four_four_losses_bedwars - bwstats.four_four_wins_bedwars)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * bwstats.four_four_deaths_bedwars - bwstats.four_four_kills_bedwars)}**\nBeds broken to **${await utils.checkValues(Math.ceil(blr))}** BB/BL Ratio: **${await utils.checkValues(Math.ceil(blr) * bwstats.four_four_beds_lost_bedwars - bwstats.four_four_beds_broken_bedwars)}**\nFinal kills to **${await utils.checkValues(Math.ceil(fkdr))}** Final K/D Ratio: **${await utils.checkValues(Math.ceil(fkdr) * bwstats.four_four_final_deaths_bedwars - bwstats.four_four_final_kills_bedwars)}**`)
                            .addField(`\u200b`, `Kills: **${await utils.checkValues(bwstats.four_four_kills_bedwars)}**\nDeaths: **${await utils.checkValues(bwstats.four_four_deaths_bedwars)}**\nK/D Ratio: **${kdr}**\n\nBeds Broken: **${await utils.checkValues(bwstats.four_four_beds_broken_bedwars)}**\nBeds Lost: **${await utils.checkValues(bwstats.four_four_beds_lost_bedwars)}**\nBB/BL Ratio: **${blr}**\n\nEmeralds Collected: **${await utils.checkValues(bwstats.four_four_emerald_resources_collected_bedwars)}**\nDiamonds Collected: **${await utils.checkValues(bwstats.four_four_diamond_resources_collected_bedwars)}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Final Kills: **${await utils.checkValues(bwstats.four_four_final_kills_bedwars)}**\nFinal Deaths: **${await utils.checkValues(bwstats.four_four_final_deaths_bedwars)}**\nFinal K/D Ratio: **${fkdr}**\n\nWins: **${await utils.checkValues(bwstats.four_four_wins_bedwars)}**\nLosses: **${await utils.checkValues(bwstats.four_four_losses_bedwars)}**\nW/L Ratio: **${wlr}**\n\nWinstreak: **${await utils.checkValues(bwstats.four_four_winstreak)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`btotal-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`bsolo-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`bdoubles-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Doubles`),
                                new MessageButton()
                                    .setCustomId(`btrios-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`3s`),
                                new MessageButton()
                                    .setCustomId(`bfours-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`4s`)
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    } else if (interaction.customId.includes('dtotal') && interaction.customId.includes(ign)) {
                        let wlr = await utils.checkValues((duelstats.wins / duelstats.losses).toFixed(2))
                        let kdr = await utils.checkValues((duelstats.kills / duelstats.deaths).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Duels | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * duelstats.losses - duelstats.wins)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * duelstats.deaths - duelstats.kills)}**`)
                            .addField(`\u200b`, `Coins: **${await utils.checkValues(duelstats.coins)}**\n\nWins: **${await utils.checkValues(duelstats.wins)}**\nLosses: **${await utils.checkValues(duelstats.losses)}**\nW/L Ratio: **${wlr}**\n\nArrows Shot: **${duelstats.bow_shots}**\nArrows Hit: **${duelstats.bow_hits}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Kills: **${await utils.checkValues(duelstats.kills)}**\nDeaths: **${await utils.checkValues(duelstats.deaths)}**\nK/D Ratio: **${kdr}**\n\nMelee Swings: **${duelstats.melee_swings}**\nMelee Hits: **${duelstats.melee_hits}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`dtotal-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`duhc-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`UHC 1v1`),
                                new MessageButton()
                                    .setCustomId(`dsumo-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Sumo`),
                                new MessageButton()
                                    .setCustomId(`dop-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`OP`),
                            ])

                        const row3 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`dclassic-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Classic`),
                                new MessageButton()
                                    .setCustomId(`dbridge-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Bridge 1v1`),
                                new MessageButton()
                                    .setCustomId(`dbteams-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Bridge Teams`),
                            ])

                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row3, row] });
                        interaction.deferUpdate()

                    } else if (interaction.customId.includes('duhc') && interaction.customId.includes(ign)) {
                        let wlr = await utils.checkValues((duelstats.uhc_duel_wins / duelstats.uhc_duel_losses).toFixed(2))
                        let kdr = await utils.checkValues((duelstats.uhc_duel_kills / duelstats.uhc_duel_deaths).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Duels | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * duelstats.uhc_duel_losses - duelstats.uhc_duel_wins)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * duelstats.uhc_duel_deaths - duelstats.uhc_duel_kills)}**`)
                            .addField(`\u200b`, `Wins: **${await utils.checkValues(duelstats.uhc_duel_wins)}**\nLosses: **${await utils.checkValues(duelstats.uhc_duel_losses)}**\nW/L Ratio: **${wlr}**\n\nArrows Shot: **${duelstats.uhc_duel_bow_shots}**\nArrows Hit: **${duelstats.uhc_duel_bow_hits}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Kills: **${await utils.checkValues(duelstats.uhc_duel_kills)}**\nDeaths: **${await utils.checkValues(duelstats.uhc_duel_deaths)}**\nK/D Ratio: **${kdr}**\n\nMelee Swings: **${duelstats.uhc_duel_melee_swings}**\nMelee Hits: **${duelstats.uhc_duel_melee_hits}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`dtotal-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`duhc-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`UHC 1v1`),
                                new MessageButton()
                                    .setCustomId(`dsumo-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Sumo`),
                                new MessageButton()
                                    .setCustomId(`dop-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`OP`),
                            ])

                        const row3 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`dclassic-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Classic`),
                                new MessageButton()
                                    .setCustomId(`dbridge-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Bridge 1v1`),
                                new MessageButton()
                                    .setCustomId(`dbteams-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Bridge Teams`),
                            ])

                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row3, row] });
                        interaction.deferUpdate()

                    } else if (interaction.customId.includes('dsumo') && interaction.customId.includes(ign)) {
                        let wlr = await utils.checkValues((duelstats.sumo_duel_wins / duelstats.sumo_duel_losses).toFixed(2))
                        let kdr = await utils.checkValues((duelstats.sumo_duel_kills / duelstats.sumo_duel_deaths).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Duels | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * duelstats.sumo_duel_losses - duelstats.sumo_duel_wins)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * duelstats.sumo_duel_deaths - duelstats.sumo_duel_kills)}**`)
                            .addField(`\u200b`, `Wins: **${await utils.checkValues(duelstats.sumo_duel_wins)}**\nLosses: **${await utils.checkValues(duelstats.sumo_duel_losses)}**\nW/L Ratio: **${wlr}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Kills: **${await utils.checkValues(duelstats.sumo_duel_kills)}**\nDeaths: **${await utils.checkValues(duelstats.sumo_duel_deaths)}**\nK/D Ratio: **${kdr}**\n\nMelee Swings: **${duelstats.sumo_duel_melee_swings}**\nMelee Hits: **${duelstats.sumo_duel_melee_hits}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`dtotal-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`duhc-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`UHC 1v1`),
                                new MessageButton()
                                    .setCustomId(`dsumo-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Sumo`),
                                new MessageButton()
                                    .setCustomId(`dop-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`OP`),
                            ])

                        const row3 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`dclassic-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Classic`),
                                new MessageButton()
                                    .setCustomId(`dbridge-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Bridge 1v1`),
                                new MessageButton()
                                    .setCustomId(`dbteams-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Bridge Teams`),
                            ])

                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row3, row] });
                        interaction.deferUpdate()

                    } else if (interaction.customId.includes('dop') && interaction.customId.includes(ign)) {
                        let wlr = await utils.checkValues((duelstats.op_duel_wins / duelstats.op_duel_losses).toFixed(2))
                        let kdr = await utils.checkValues((duelstats.op_duel_kills / duelstats.op_duel_deaths).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Duels | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * duelstats.op_duel_losses - duelstats.op_duel_wins)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * duelstats.op_duel_deaths - duelstats.op_duel_kills)}**`)
                            .addField(`\u200b`, `Wins: **${await utils.checkValues(duelstats.op_duel_wins)}**\nLosses: **${await utils.checkValues(duelstats.op_duel_losses)}**\nW/L Ratio: **${wlr}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Kills: **${await utils.checkValues(duelstats.op_duel_kills)}**\nDeaths: **${await utils.checkValues(duelstats.op_duel_deaths)}**\nK/D Ratio: **${kdr}**\n\nMelee Swings: **${duelstats.op_duel_melee_swings}**\nMelee Hits: **${duelstats.op_duel_melee_hits}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`dtotal-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`duhc-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`UHC 1v1`),
                                new MessageButton()
                                    .setCustomId(`dsumo-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Sumo`),
                                new MessageButton()
                                    .setCustomId(`dop-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`OP`),
                            ])

                        const row3 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`dclassic-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Classic`),
                                new MessageButton()
                                    .setCustomId(`dbridge-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Bridge 1v1`),
                                new MessageButton()
                                    .setCustomId(`dbteams-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Bridge Teams`),
                            ])

                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row3, row] });
                        interaction.deferUpdate()

                    } else if (interaction.customId.includes('dclassic') && interaction.customId.includes(ign)) {
                        let wlr = await utils.checkValues((duelstats.classic_duel_wins / duelstats.classic_duel_losses).toFixed(2))
                        let kdr = await utils.checkValues((duelstats.classic_duel_kills / duelstats.classic_duel_deaths).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Duels | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * duelstats.classic_duel_losses - duelstats.classic_duel_wins)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * duelstats.classic_duel_deaths - duelstats.classic_duel_kills)}**`)
                            .addField(`\u200b`, `Wins: **${await utils.checkValues(duelstats.classic_duel_wins)}**\nLosses: **${await utils.checkValues(duelstats.classic_duel_losses)}**\nW/L Ratio: **${wlr}**\n\nArrows Shot: **${duelstats.classic_duel_bow_shots}**\nArrows Hit: **${duelstats.classic_duel_bow_hits}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Kills: **${await utils.checkValues(duelstats.classic_duel_kills)}**\nDeaths: **${await utils.checkValues(duelstats.classic_duel_deaths)}**\nK/D Ratio: **${kdr}**\n\nMelee Swings: **${duelstats.classic_duel_melee_swings}**\nMelee Hits: **${duelstats.classic_duel_melee_hits}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`dtotal-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`duhc-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`UHC 1v1`),
                                new MessageButton()
                                    .setCustomId(`dsumo-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Sumo`),
                                new MessageButton()
                                    .setCustomId(`dop-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`OP`),
                            ])

                        const row3 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`dclassic-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Classic`),
                                new MessageButton()
                                    .setCustomId(`dbridge-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Bridge 1v1`),
                                new MessageButton()
                                    .setCustomId(`dbteams-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Bridge Teams`),
                            ])

                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row3, row] });
                        interaction.deferUpdate()

                    } else if (interaction.customId.includes('dbridge') && interaction.customId.includes(ign)) {
                        let wlr = await utils.checkValues((duelstats.bridge_duel_wins / duelstats.bridge_duel_losses).toFixed(2))
                        let kdr = await utils.checkValues((duelstats.bridge_duel_kills / duelstats.bridge_duel_deaths).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Duels | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * duelstats.bridge_duel_losses - duelstats.bridge_duel_wins)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * duelstats.bridge_duel_deaths - duelstats.bridge_duel_kills)}**`)
                            .addField(`\u200b`, `Wins: **${await utils.checkValues(duelstats.bridge_duel_wins)}**\nLosses: **${await utils.checkValues(duelstats.bridge_duel_losses)}**\nW/L Ratio: **${wlr}**\n\nArrows Shot: **${duelstats.bridge_duel_bow_shots}**\nArrows Hit: **${duelstats.bridge_duel_bow_hits}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Kills: **${await utils.checkValues(duelstats.bridge_duel_kills)}**\nDeaths: **${await utils.checkValues(duelstats.bridge_duel_deaths)}**\nK/D Ratio: **${kdr}**\n\nMelee Swings: **${duelstats.bridge_duel_melee_swings}**\nMelee Hits: **${duelstats.bridge_duel_melee_hits}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`dtotal-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`duhc-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`UHC 1v1`),
                                new MessageButton()
                                    .setCustomId(`dsumo-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Sumo`),
                                new MessageButton()
                                    .setCustomId(`dop-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`OP`),
                            ])

                        const row3 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`dclassic-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Classic`),
                                new MessageButton()
                                    .setCustomId(`dbridge-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Bridge 1v1`),
                                new MessageButton()
                                    .setCustomId(`dbteams-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Bridge Teams`),
                            ])

                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row3, row] });
                        interaction.deferUpdate()

                    } else if (interaction.customId.includes('dbteams') && interaction.customId.includes(ign)) {
                        let wlr = await utils.checkValues((duelstats.bridge_four_wins / duelstats.bridge_four_losses).toFixed(2))
                        let kdr = await utils.checkValues((duelstats.bridge_four_kills / duelstats.bridge_four_deaths).toFixed(2))
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Duels | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .setDescription(`Wins to **${await utils.checkValues(Math.ceil(wlr))}** W/L Ratio: **${await utils.checkValues(Math.ceil(wlr) * duelstats.bridge_four_losses - duelstats.bridge_four_wins)}**\nKills to **${await utils.checkValues(Math.ceil(kdr))}** K/D Ratio: **${await utils.checkValues(Math.ceil(kdr) * duelstats.bridge_four_deaths - duelstats.bridge_four_kills)}**`)
                            .addField(`\u200b`, `Wins: **${await utils.checkValues(duelstats.bridge_four_wins)}**\nLosses: **${await utils.checkValues(duelstats.bridge_four_losses)}**\nW/L Ratio: **${wlr}**\n\nArrows Shot: **${duelstats.bridge_four_bow_shots}**\nArrows Hit: **${duelstats.bridge_four_bow_hits}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Kills: **${await utils.checkValues(duelstats.bridge_four_kills)}**\nDeaths: **${await utils.checkValues(duelstats.bridge_four_deaths)}**\nK/D Ratio: **${kdr}**\n\nMelee Swings: **${duelstats.bridge_four_melee_swings}**\nMelee Hits: **${duelstats.bridge_four_melee_hits}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`dtotal-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`duhc-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`UHC 1v1`),
                                new MessageButton()
                                    .setCustomId(`dsumo-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Sumo`),
                                new MessageButton()
                                    .setCustomId(`dop-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`OP`),
                            ])

                        const row3 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`dclassic-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Classic`),
                                new MessageButton()
                                    .setCustomId(`dbridge-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Bridge 1v1`),
                                new MessageButton()
                                    .setCustomId(`dbteams-${ign}`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Bridge Teams`),
                            ])

                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row3, row] });
                        interaction.deferUpdate()
                    }
                } else {
                    interaction.deferUpdate()
                }
            }
        });
    }
}