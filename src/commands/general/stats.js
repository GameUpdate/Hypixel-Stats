const { MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton } = require("discord.js");
const moment = require("moment");
const utils = require("../../functions/utils.js");

module.exports = {
    config: {
        name: "stats",
        aliases: ['statistics'],
        desc: "Get a statistics page for a player",
        usage: [`stats <ign>`]
    },
    run: async (server, message, args, pf) => {

        var player
        var stat

        if (!args[0] && !pf.ign) {

            return message.channel.send(`No IGN has been given\nYou can link to one with \`${server.prefix}link <ign>\``);

        } else if (!args[0] && pf.ign) {

            player = await hypixel.player(pf.ign) 
            stat = await hypixel.status(pf.ign) 
        } else {

            player = await hypixel.player(args[0]) 
            stat = await hypixel.status(args[0]) 
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

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId(`gamemode`)
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
                        label: 'SkyWars',
                        value: 'SkyWars',
                        description: `Check their SkyWars stats`,
                        emoji: '873519470533021706'
                    }, {
                        label: 'Bedwars',
                        value: 'Bedwars',
                        description: `Check their Bedwars stats`,
                        emoji: '873519470583365673'
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
                if (interaction.customId.includes('gamemode') && interaction.user.id === message.author.id) {

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
                                .setCustomId(`gamemode`)
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
                                    label: 'SkyWars',
                                    value: 'SkyWars',
                                    description: `Check their SkyWars stats`,
                                    emoji: '873519470533021706',
                                }, {
                                    label: 'Bedwars',
                                    value: 'Bedwars',
                                    description: `Check their Bedwars stats`,
                                    emoji: '873519470583365673'
                                }])
                        );
                        interaction.message.edit({ content: '\u200b', embeds: [embed], components: [row] });
                        interaction.deferUpdate()
                    } else if (interaction.values[0] == 'SkyWars') {
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`SkyWars | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .addField(`\u200b`, `Level: **${await utils.checkValues(skystats.levelFormatted.substr(2))}**\n\nWins: **${await utils.checkValues(skystats.wins)}**\nLosses: **${await utils.checkValues(skystats.losses)}**\nW/L Ratio: **${await utils.checkValues((skystats.wins / skystats.losses).toFixed(2))}**\n\nKills: **${await utils.checkValues(skystats.kills)}**\nDeaths: **${await utils.checkValues(skystats.deaths)}**\nK/D Ratio: **${await utils.checkValues((skystats.kills / skystats.deaths).toFixed(2))}**\nQuits: **${await utils.checkValues(skystats.quits)}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Melee Kills: **${await utils.checkValues(skystats.melee_kills)}**\nBow Kills: **${await utils.checkValues(skystats.bow_kills)}**\nVoid Kills: **${await utils.checkValues(skystats.void_kills)}**\n\nArrows Shot: **${await utils.checkValues(skystats.arrows_shot)}**\nArrows Hit: **${await utils.checkValues(skystats.arrows_hit)}**\n\nChests Opened: **${await utils.checkValues(skystats.chests_opened)}**\nEnderpearls Thrown: **${await utils.checkValues(skystats.enderpearls_thrown)}**\nSouls Gathered: **${await utils.checkValues(skystats.souls_gathered)}**\nHeads: **${await utils.checkValues(skystats.heads)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`stotal`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`ssolo`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`sdoubles`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Doubles`),
                            ])
                        row.components.length = 0
                        row.addComponents(
                            new MessageSelectMenu()
                                .setCustomId(`gamemode`)
                                .setPlaceholder(`Select a gamemode`)
                                .setMinValues(1)
                                .setMaxValues(1)
                                .addOptions([{
                                    label: 'Home',
                                    value: 'home',
                                    description: `Check their Network info`,
                                    emoji: '873544037641109564',
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
                                }])
                        );
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()

                    } else if (interaction.values[0] == 'Bedwars') {
                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Bedwars | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .addField(`\u200b`, `Level: **${await utils.checkValues(player.achievements.bedwars_level)}**\nCoins: **${await utils.checkValues(bwstats.coins)}**\nWinstreak: **${await utils.checkValues(bwstats.winstreak)}**\n\nBeds Broken: **${await utils.checkValues(bwstats.beds_broken_bedwars)}**\nBeds Lost: **${await utils.checkValues(bwstats.beds_lost_bedwars)}**\n\nKills: **${await utils.checkValues(bwstats.kills_bedwars)}**\nDeaths: **${await utils.checkValues(bwstats.deaths_bedwars)}**\nK/D Ratio: **${await utils.checkValues((bwstats.kills_bedwars / bwstats.deaths_bedwars).toFixed(2))}**\n\n`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Final Kills: **${await utils.checkValues(bwstats.final_kills_bedwars)}**\nFinal Deaths: **${await utils.checkValues(bwstats.final_deaths_bedwars)}**\nFinal K/D Ratio: **${await utils.checkValues((bwstats.final_kills_bedwars / bwstats.final_deaths_bedwars).toFixed(2))}**\n\nWins: **${await utils.checkValues(bwstats.wins_bedwars)}**\nLosses: **${await utils.checkValues(bwstats.losses_bedwars)}**\nW/L Ratio: **${await utils.checkValues((bwstats.wins_bedwars / bwstats.losses_bedwars).toFixed(2))}**\n\nEmeralds Collected: **${await utils.checkValues(bwstats.emerald_resources_collected_bedwars)}**\nDiamonds Collected: **${await utils.checkValues(bwstats.diamond_resources_collected_bedwars)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`btotal`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`bsolo`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`bdoubles`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Doubles`),
                                new MessageButton()
                                    .setCustomId(`btrios`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`3s`),
                                new MessageButton()
                                    .setCustomId(`bfours`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`4s`)
                            ])
                        row.components.length = 0
                        row.addComponents(
                            new MessageSelectMenu()
                                .setCustomId(`gamemode`)
                                .setPlaceholder(`Select a gamemode`)
                                .setMinValues(1)
                                .setMaxValues(1)
                                .addOptions([{
                                    label: 'Home',
                                    value: 'home',
                                    description: `Check their Network info`,
                                    emoji: '873544037641109564',
                                }, {
                                    label: 'SkyWars',
                                    value: 'SkyWars',
                                    description: `Check their SkyWars stats`,
                                    emoji: '873519470533021706',
                                }, {
                                    label: 'Bedwars',
                                    value: 'Bedwars',
                                    description: `Check their Bedwars stats`,
                                    emoji: '873519470583365673',
                                    default: true,
                                }])
                        );
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    }
                }




            } else if (interaction.isButton()) {
                if (interaction.user.id === message.author.id) {
                    if (interaction.customId === 'stotal') {

                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`SkyWars | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .addField(`\u200b`, `Level: **${await utils.checkValues(skystats.levelFormatted.substr(2))}**\n\nWins: **${await utils.checkValues(skystats.wins)}**\nLosses: **${await utils.checkValues(skystats.losses)}**\nW/L Ratio: **${await utils.checkValues((skystats.wins / skystats.losses).toFixed(2))}**\n\nKills: **${await utils.checkValues(skystats.kills)}**\nDeaths: **${await utils.checkValues(skystats.deaths)}**\nK/D Ratio: **${await utils.checkValues((skystats.kills / skystats.deaths).toFixed(2))}**\nQuits: **${await utils.checkValues(skystats.quits)}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Melee Kills: **${await utils.checkValues(skystats.melee_kills)}**\nBow Kills: **${await utils.checkValues(skystats.bow_kills)}**\nVoid Kills: **${await utils.checkValues(skystats.void_kills)}**\n\nArrows Shot: **${await utils.checkValues(skystats.arrows_shot)}**\nArrows Hit: **${await utils.checkValues(skystats.arrows_hit)}**\n\nChests Opened: **${await utils.checkValues(skystats.chests_opened)}**\nEnderpearls Thrown: **${await utils.checkValues(skystats.enderpearls_thrown)}**\nSouls Gathered: **${await utils.checkValues(skystats.souls_gathered)}**\nHeads: **${await utils.checkValues(skystats.heads)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`stotal`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`ssolo`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`sdoubles`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Doubles`),
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    } else if (interaction.customId === 'ssolo') {

                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`SkyWars Solo | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .addField(`\u200b`, `Wins: **${await utils.checkValues(skystats.wins_solo)}**\nLosses: **${await utils.checkValues(skystats.losses_solo)}**\nW/L Ratio: **${await utils.checkValues((skystats.wins_solo / skystats.losses_solo).toFixed(2))}**\n\nKills: **${await utils.checkValues(skystats.kills_solo)}**\nDeaths: **${await utils.checkValues(skystats.deaths_solo)}**\nK/D Ratio: **${await utils.checkValues((skystats.kills_solo / skystats.deaths_solo).toFixed(2))}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Melee Kills: **${await utils.checkValues(skystats.melee_kills_solo)}**\nBow Kills: **${await utils.checkValues(skystats.bow_kills_solo)}**\nVoid Kills: **${await utils.checkValues(skystats.void_kills_solo)}**\n\nArrows Shot: **${await utils.checkValues(skystats.arrows_shot_solo)}**\nArrows Hit: **${await utils.checkValues(skystats.arrows_hit_solo)}**\n\nChests Opened: **${await utils.checkValues(skystats.chests_opened_solo)}**\nHeads: **${await utils.checkValues(skystats.heads_solo)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`stotal`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`ssolo`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`sdoubles`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Doubles`),
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    } else if (interaction.customId === 'sdoubles') {

                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`SkyWars Doubles | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .addField(`\u200b`, `Wins: **${await utils.checkValues(skystats.wins_team)}**\nLosses: **${await utils.checkValues(skystats.losses_team)}**\nW/L Ratio: **${await utils.checkValues((skystats.wins_team / skystats.losses_team).toFixed(2))}**\n\nKills: **${await utils.checkValues(skystats.kills_team)}**\nDeaths: **${await utils.checkValues(skystats.deaths_team)}**\nK/D Ratio: **${await utils.checkValues((skystats.kills_team / skystats.deaths_team).toFixed(2))}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Melee Kills: **${await utils.checkValues(skystats.melee_kills_team)}**\nBow Kills: **${await utils.checkValues(skystats.bow_kills_team)}**\nVoid Kills: **${await utils.checkValues(skystats.void_kills_team)}**\n\nArrows Shot: **${await utils.checkValues(skystats.arrows_shot_team)}**\nArrows Hit: **${await utils.checkValues(skystats.arrows_hit_team)}**\n\nChests Opened: **${await utils.checkValues(skystats.chests_opened_team)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`stotal`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`ssolo`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`sdoubles`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Doubles`),
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    } else if (interaction.customId === 'btotal') {

                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Bedwars | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .addField(`\u200b`, `Level: **${await utils.checkValues(player.achievements.bedwars_level)}**\nCoins: **${await utils.checkValues(bwstats.coins)}**\nWinstreak: **${await utils.checkValues(bwstats.winstreak)}**\n\nBeds Broken: **${await utils.checkValues(bwstats.beds_broken_bedwars)}**\nBeds Lost: **${await utils.checkValues(bwstats.beds_lost_bedwars)}**\n\nKills: **${await utils.checkValues(bwstats.kills_bedwars)}**\nDeaths: **${await utils.checkValues(bwstats.deaths_bedwars)}**\nK/D Ratio: **${await utils.checkValues((bwstats.kills_bedwars / bwstats.deaths_bedwars).toFixed(2))}**\n\n`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Final Kills: **${await utils.checkValues(bwstats.final_kills_bedwars)}**\nFinal Deaths: **${await utils.checkValues(bwstats.final_deaths_bedwars)}**\nFinal K/D Ratio: **${await utils.checkValues((bwstats.final_kills_bedwars / bwstats.final_deaths_bedwars).toFixed(2))}**\n\nWins: **${await utils.checkValues(bwstats.wins_bedwars)}**\nLosses: **${await utils.checkValues(bwstats.losses_bedwars)}**\nW/L Ratio: **${await utils.checkValues((bwstats.wins_bedwars / bwstats.losses_bedwars).toFixed(2))}**\n\nEmeralds Collected: **${await utils.checkValues(bwstats.emerald_resources_collected_bedwars)}**\nDiamonds Collected: **${await utils.checkValues(bwstats.diamond_resources_collected_bedwars)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`btotal`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`bsolo`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`bdoubles`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Doubles`),
                                new MessageButton()
                                    .setCustomId(`btrios`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`3s`),
                                new MessageButton()
                                    .setCustomId(`bfours`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`4s`)
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    } else if (interaction.customId === 'bsolo') {

                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Bedwars Solo | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .addField(`\u200b`, `Kills: **${await utils.checkValues(bwstats.eight_one_kills_bedwars)}**\nDeaths: **${await utils.checkValues(bwstats.eight_one_deaths_bedwars)}**\nK/D Ratio: **${await utils.checkValues((bwstats.eight_one_kills_bedwars / bwstats.eight_one_deaths_bedwars).toFixed(2))}**\n\nBeds Broken: **${await utils.checkValues(bwstats.eight_one_beds_broken_bedwars)}**\nBeds Lost: **${await utils.checkValues(bwstats.eight_one_beds_lost_bedwars)}**\n\nEmeralds Collected: **${await utils.checkValues(bwstats.eight_one_emerald_resources_collected_bedwars)}**\nDiamonds Collected: **${await utils.checkValues(bwstats.eight_one_diamond_resources_collected_bedwars)}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Final Kills: **${await utils.checkValues(bwstats.eight_one_final_kills_bedwars)}**\nFinal Deaths: **${await utils.checkValues(bwstats.eight_one_final_deaths_bedwars)}**\nFinal K/D Ratio: **${await utils.checkValues((bwstats.eight_one_final_kills_bedwars / bwstats.eight_one_final_deaths_bedwars).toFixed(2))}**\n\nWins: **${await utils.checkValues(bwstats.eight_one_wins_bedwars)}**\nLosses: **${await utils.checkValues(bwstats.eight_one_losses_bedwars)}**\nW/L Ratio: **${await utils.checkValues((bwstats.eight_one_wins_bedwars / bwstats.eight_one_losses_bedwars).toFixed(2))}**\n\nWinstreak: **${await utils.checkValues(bwstats.eight_one_winstreak)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`btotal`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`bsolo`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`bdoubles`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Doubles`),
                                new MessageButton()
                                    .setCustomId(`btrios`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`3s`),
                                new MessageButton()
                                    .setCustomId(`bfours`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`4s`)
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    } else if (interaction.customId === 'bdoubles') {

                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Bedwars Doubles | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .addField(`\u200b`, `Kills: **${await utils.checkValues(bwstats.eight_two_kills_bedwars)}**\nDeaths: **${await utils.checkValues(bwstats.eight_two_deaths_bedwars)}**\nK/D Ratio: **${await utils.checkValues((bwstats.eight_two_kills_bedwars / bwstats.eight_two_deaths_bedwars).toFixed(2))}**\n\nBeds Broken: **${await utils.checkValues(bwstats.eight_two_beds_broken_bedwars)}**\nBeds Lost: **${await utils.checkValues(bwstats.eight_two_beds_lost_bedwars)}**\n\nEmeralds Collected: **${await utils.checkValues(bwstats.eight_two_emerald_resources_collected_bedwars)}**\nDiamonds Collected: **${await utils.checkValues(bwstats.eight_two_diamond_resources_collected_bedwars)}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Final Kills: **${await utils.checkValues(bwstats.eight_two_final_kills_bedwars)}**\nFinal Deaths: **${await utils.checkValues(bwstats.eight_two_final_deaths_bedwars)}**\nFinal K/D Ratio: **${await utils.checkValues((bwstats.eight_two_final_kills_bedwars / bwstats.eight_two_final_deaths_bedwars).toFixed(2))}**\n\nWins: **${await utils.checkValues(bwstats.eight_two_wins_bedwars)}**\nLosses: **${await utils.checkValues(bwstats.eight_two_losses_bedwars)}**\nW/L Ratio: **${await utils.checkValues((bwstats.eight_two_wins_bedwars / bwstats.eight_two_losses_bedwars).toFixed(2))}**\n\nWinstreak: **${await utils.checkValues(bwstats.eight_two_winstreak)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`btotal`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`bsolo`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`bdoubles`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`Doubles`),
                                new MessageButton()
                                    .setCustomId(`btrios`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`3s`),
                                new MessageButton()
                                    .setCustomId(`bfours`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`4s`)
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    } else if (interaction.customId === 'btrios') {

                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Bedwars 3s | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .addField(`\u200b`, `Kills: **${await utils.checkValues(bwstats.four_three_kills_bedwars)}**\nDeaths: **${await utils.checkValues(bwstats.four_three_deaths_bedwars)}**\nK/D Ratio: **${await utils.checkValues((bwstats.four_three_kills_bedwars / bwstats.four_three_deaths_bedwars).toFixed(2))}**\n\nBeds Broken: **${await utils.checkValues(bwstats.four_three_beds_broken_bedwars)}**\nBeds Lost: **${await utils.checkValues(bwstats.four_three_beds_lost_bedwars)}**\n\nEmeralds Collected: **${await utils.checkValues(bwstats.four_three_emerald_resources_collected_bedwars)}**\nDiamonds Collected: **${await utils.checkValues(bwstats.four_three_diamond_resources_collected_bedwars)}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Final Kills: **${await utils.checkValues(bwstats.four_three_final_kills_bedwars)}**\nFinal Deaths: **${await utils.checkValues(bwstats.four_three_final_deaths_bedwars)}**\nFinal K/D Ratio: **${await utils.checkValues((bwstats.four_three_final_kills_bedwars / bwstats.four_three_final_deaths_bedwars).toFixed(2))}**\n\nWins: **${await utils.checkValues(bwstats.four_three_wins_bedwars)}**\nLosses: **${await utils.checkValues(bwstats.four_three_losses_bedwars)}**\nW/L Ratio: **${await utils.checkValues((bwstats.four_three_wins_bedwars / bwstats.four_three_losses_bedwars).toFixed(2))}**\n\nWinstreak: **${await utils.checkValues(bwstats.four_three_winstreak)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`btotal`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`bsolo`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`bdoubles`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Doubles`),
                                new MessageButton()
                                    .setCustomId(`btrios`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`3s`),
                                new MessageButton()
                                    .setCustomId(`bfours`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`4s`)
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    } else if (interaction.customId === 'bfours') {

                        const infoembed = new MessageEmbed()
                            .setColor(pf.color)
                            .setAuthor(`Bedwars 4s | ${player.displayname}`)
                            .setThumbnail(`https://crafatar.com/renders/head/${player.uuid}?overlay`)
                            .addField(`\u200b`, `Kills: **${await utils.checkValues(bwstats.four_four_kills_bedwars)}**\nDeaths: **${await utils.checkValues(bwstats.four_four_deaths_bedwars)}**\nK/D Ratio: **${await utils.checkValues((bwstats.four_four_kills_bedwars / bwstats.four_four_deaths_bedwars).toFixed(2))}**\n\nBeds Broken: **${await utils.checkValues(bwstats.four_four_beds_broken_bedwars)}**\nBeds Lost: **${await utils.checkValues(bwstats.four_four_beds_lost_bedwars)}**\n\nEmeralds Collected: **${await utils.checkValues(bwstats.four_four_emerald_resources_collected_bedwars)}**\nDiamonds Collected: **${await utils.checkValues(bwstats.four_four_diamond_resources_collected_bedwars)}**`, true)
                            .addField(`\u200b`, `\u200b`, true)
                            .addField(`\u200b`, `Final Kills: **${await utils.checkValues(bwstats.four_four_final_kills_bedwars)}**\nFinal Deaths: **${await utils.checkValues(bwstats.four_four_final_deaths_bedwars)}**\nFinal K/D Ratio: **${await utils.checkValues((bwstats.four_four_final_kills_bedwars / bwstats.four_four_final_deaths_bedwars).toFixed(2))}**\n\nWins: **${await utils.checkValues(bwstats.four_four_wins_bedwars)}**\nLosses: **${await utils.checkValues(bwstats.four_four_losses_bedwars)}**\nW/L Ratio: **${await utils.checkValues((bwstats.four_four_wins_bedwars / bwstats.four_four_losses_bedwars).toFixed(2))}**\n\nWinstreak: **${await utils.checkValues(bwstats.four_four_winstreak)}**`, true)
                            .setFooter(`∅ ➝ Couldn't retrieve value`)

                        const row2 = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId(`btotal`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Total`),
                                new MessageButton()
                                    .setCustomId(`bsolo`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Solo`),
                                new MessageButton()
                                    .setCustomId(`bdoubles`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`Doubles`),
                                new MessageButton()
                                    .setCustomId(`btrios`)
                                    .setStyle('PRIMARY')
                                    .setLabel(`3s`),
                                new MessageButton()
                                    .setCustomId(`bfours`)
                                    .setStyle('PRIMARY')
                                    .setDisabled(true)
                                    .setLabel(`4s`)
                            ])
                        interaction.message.edit({ content: '\u200b', embeds: [infoembed], components: [row2, row] });
                        interaction.deferUpdate()
                    }
                } else {
                    interaction.deferUpdate()
                }
            }
        });
    }
}