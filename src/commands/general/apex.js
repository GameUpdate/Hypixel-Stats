const { MessageEmbed } = require("discord.js")
const MozambiqueAPI = require('mozambique-api-wrapper');
let mozambiqueClient = new MozambiqueAPI("Z1SgQLVjQUHFKUQfV28q");

module.exports = {
    config: {
        name: "apex",
        desc: "Get Apex Legend servers status or information about a PC player",
        usage: [`apex servers`, `apex <name>`]
    },
    run: async (server, message, args) => {
        const color = server.color;
        
        if (!args[0]) {
            let pf = new MessageEmbed()
                .setTitle('Apex command')
                .addField('Player stats', `${server.bot_prefix}apex <name>`)
                .addField('Server stats', `${server.bot_prefix}apex servers`)
                .setColor(color)
            return message.channel.send(pf)
        } if (args[0].toLowerCase() === 'servers') {
            mozambiqueClient.server()
                .then(function (data) {
                    let origin = data.Origin_login
                    let ea = data.EA_accounts
                    let oauth = data.ApexOauth_PC
                    let cross = data.ApexOauth_Crossplay

                    let o_euw = origin['EU-West'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'
                    let o_eue = origin['EU-East'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'
                    let o_usw = origin['US-West'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'
                    let o_usc = origin['US-Central'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'
                    let o_use = origin['US-East'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'

                    let e_euw = ea['EU-West'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'
                    let e_eue = ea['EU-East'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'
                    let e_usw = ea['US-West'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'
                    let e_usc = ea['US-Central'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'
                    let e_use = ea['US-East'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'

                    let a_euw = oauth['EU-West'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'
                    let a_eue = oauth['EU-East'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'
                    let a_usw = oauth['US-West'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'
                    let a_usc = oauth['US-Central'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'
                    let a_use = oauth['US-East'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'

                    let c_euw = cross['EU-West'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'
                    let c_eue = cross['EU-East'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'
                    let c_usw = cross['US-West'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'
                    let c_usc = cross['US-Central'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'
                    let c_use = cross['US-East'].Status === 'UP' ? '<:online:759044009900376104>' : '<:dnd:759044009854631966>'

                    let pf = new MessageEmbed()
                        .setTitle('Server status')
                        .addField('Origin Login', `${o_euw} **EU-West:** \`${origin['EU-West'].ResponseTime}ms\`\n${o_eue} **EU-East:** \`${origin['EU-East'].ResponseTime}ms\`\n${o_usw} **US-West:** \`${origin['US-West'].ResponseTime}ms\`\n${o_usc} **US-Central:** \`${origin['US-Central'].ResponseTime}ms\`\n${o_use} **US-East:** \`${origin['US-East'].ResponseTime}ms\``, true)
                        .addField('EA Accounts', `${e_euw} **EU-West:** \`${ea['EU-West'].ResponseTime}ms\`\n${e_eue} **EU-East:** \`${ea['EU-East'].ResponseTime}ms\`\n${e_usw} **US-West:** \`${ea['US-West'].ResponseTime}ms\`\n${e_usc} **US-Central:** \`${ea['US-Central'].ResponseTime}ms\`\n${e_use} **US-East:** \`${ea['US-East'].ResponseTime}ms\``, true)
                        .addField('\u200b', '\u200b', true)
                        .addField('Apex Oath PC', `${a_euw} **EU-West:** \`${oauth['EU-West'].ResponseTime}ms\`\n${a_eue} **EU-East:** \`${oauth['EU-East'].ResponseTime}ms\`\n${a_usw} **US-West:** \`${oauth['US-West'].ResponseTime}ms\`\n${a_usc} **US-Central:** \`${oauth['US-Central'].ResponseTime}ms\`\n${a_use} **US-East:** \`${oauth['US-East'].ResponseTime}ms\``, true)
                        .addField('Apex Oath Crossplay', `${c_euw} **EU-West:** \`${cross['EU-West'].ResponseTime}ms\`\n${c_eue} **EU-East:** \`${cross['EU-East'].ResponseTime}ms\`\n${c_usw} **US-West:** \`${cross['US-West'].ResponseTime}ms\`\n${c_usc} **US-Central:** \`${cross['US-Central'].ResponseTime}ms\`\n${c_use} **US-East:** \`${cross['US-East'].ResponseTime}ms\``, true)
                        .addField('\u200b', '\u200b', true)
                        .setThumbnail('https://i.pinimg.com/564x/ce/70/9e/ce709ea00c14c59f05fda449e8fa2f16.jpg')
                        .setColor(color)
                    return message.channel.send(pf)

                }).catch(err => { return message.channel.send("Couldn't get Apex servers status") })
        } else {
            mozambiqueClient.search({
                "platform": "PC",
                "player": args.join(" ")
            })
                .then(function (data) {
                    let glob = data.global

                    let score
                    let online = data.realtime.isInGame ? 'Yes' : 'No'
                    let full = data.realtime.partyFull ? 'Yes' : 'No'

                    switch (glob.rank.rankName.toLowerCase()) {
                        case 'bronze':
                            switch (glob.rank.rankDiv) {
                                case 1:
                                    score = glob.rank.rankScore + '/1200'
                                    break
                                case 2:
                                    score = glob.rank.rankScore + '/900'
                                    break
                                case 3:
                                    score = glob.rank.rankScore + '/600'
                                    break
                                case 4:
                                    score = glob.rank.rankScore + '/300'
                                    break
                            }
                            break
                        case 'silver':
                            switch (glob.rank.rankDiv) {
                                case 1:
                                    score = glob.rank.rankScore + '/2800'
                                    break
                                case 2:
                                    score = glob.rank.rankScore + '/2400'
                                    break
                                case 3:
                                    score = glob.rank.rankScore + '/2000'
                                    break
                                case 4:
                                    score = glob.rank.rankScore + '/1600'
                                    break
                            }
                            break
                        case 'gold':
                            switch (glob.rank.rankDiv) {
                                case 1:
                                    score = glob.rank.rankScore + '/4800'
                                    break
                                case 2:
                                    score = glob.rank.rankScore + '/4300'
                                    break
                                case 3:
                                    score = glob.rank.rankScore + '/3800'
                                    break
                                case 4:
                                    score = glob.rank.rankScore + '/3300'
                                    break
                            }
                            break
                        case 'platinum':
                            switch (glob.rank.rankDiv) {
                                case 1:
                                    score = glob.rank.rankScore + '/7200'
                                    break
                                case 2:
                                    score = glob.rank.rankScore + '/6600'
                                    break
                                case 3:
                                    score = glob.rank.rankScore + '/6000'
                                    break
                                case 4:
                                    score = glob.rank.rankScore + '/5400'
                                    break
                            }
                            break
                        case 'diamond':
                            switch (glob.rank.rankDiv) {
                                case 1:
                                    score = glob.rank.rankScore + '/1000'
                                    break
                                case 2:
                                    score = glob.rank.rankScore + '/9300'
                                    break
                                case 3:
                                    score = glob.rank.rankScore + '/8900'
                                    break
                                case 4:
                                    score = glob.rank.rankScore + '/7900'
                                    break
                            }
                            break
                        default:
                            score = glob.rank.rankScore
                            break
                    }

                    let tr1 = data.legends.selected.data[0] ? data.legends.selected.data[0].name : '- '
                    let tr2 = data.legends.selected.data[1] ? data.legends.selected.data[1].name : '- '
                    let tr3 = data.legends.selected.data[2] ? data.legends.selected.data[2].name : '- '
                    let tr11 = data.legends.selected.data[0] ? data.legends.selected.data[0].value : '-'
                    let tr21 = data.legends.selected.data[1] ? data.legends.selected.data[1].value : '-'
                    let tr31 = data.legends.selected.data[2] ? data.legends.selected.data[2].value : '-'
                    let pf = new MessageEmbed()
                        .setTitle(glob.name)
                        .addField('Stats', `Level: ${glob.level}\n Next Level: ${100 - glob.toNextLevelPercent}%`, true)
                        .addField('\u200b', '\u200b', true)
                        .addField('Ranked Status', `Rank: ${glob.rank.rankName} ${glob.rank.rankDiv}\nScore: ${score}`, true)
                        .addField('Current Status', `Legend: ${data.realtime.selectedLegend}\nIngame: ${online}\nFull Party: ${full}`, true)
                        .addField('\u200b', '\u200b', true)
                        .addField('Trackers', `${tr1}: ${tr11}\n${tr2}: ${tr21}\n${tr3}: ${tr31}`, true)
                        .setThumbnail(glob.rank.rankImg)
                        .setColor(color)
                    glob.rank.rankName.toLowerCase() === 'master' ? (glob.rank.rankScore > 14500 ? pf.setThumbnail(`https://trackercdn.com/cdn/apex.tracker.gg/ranks/apex.png`) : pf.setThumbnail(`https://trackercdn.com/cdn/apex.tracker.gg/ranks/master.png`)) : pf.setThumbnail(glob.rank.rankImg)
                    return message.channel.send(pf)

                }).catch(err => { return message.channel.send("Couldn't find that player on PC") })
        }
    }
}