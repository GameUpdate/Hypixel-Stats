const { MessageEmbed } = require("discord.js")
const { readdirSync } = require("fs")

module.exports = {
    config: {
        name: "help",
        aliases: ['h'],
        desc: "See all the available commands and more information on certain ones",
        usage: [`help`, `help <command>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) {
            let pf = new MessageEmbed()
                .setTitle(client.user.username)
                .setDescription(`*That girl playing with your feelings all day xo*\nInvite me to your server or get support with \`${server.bot_prefix}bot\`\nUse \`${server.bot_prefix}help <command>\` to get more info on a command\nCurrent prefix: \`${server.bot_prefix}\``)
                .setColor(color)

            var total = 0
            const load = dirs => {
                const commands = readdirSync(`./src/commands/${dirs}/`).filter(d => d.endsWith('.js'));
                let info = commands.map(c => `\`${c.substr(0, c.length - 3)}\``)
                pf.addField(`${dirs.charAt(0).toUpperCase() + dirs.slice(1)} commands`, info.join(' | '))
                total += commands.length
            };
            readdirSync(`./src/commands/`).forEach(x => load(x));

            pf.setFooter(`Made by Game#0005 | Total: ${total} commands`)
            return message.channel.send(pf)
        } else {
            let commandfile = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]) || client.commands.get(args[0].toLowerCase()));
            if (!commandfile) return message.channel.send(`Couldn't find that command, please use a correct one`)

            let aliases = client.aliases.get(args[0]) ? `\`` + server.bot_prefix + commandfile.config.aliases.join(`\` | \`${server.bot_prefix}`) + '\`' : `\`None\``
            let usage = client.usage.get(commandfile.config.name) ? '```' + server.bot_prefix + commandfile.config.usage.join(`\n${server.bot_prefix}`) + '```' : `\`None\``
            let memP = client.memberPerms.get(commandfile.config.name) ? commandfile.config.memberPerms.join(`\` | \``) : `DEFAULT`

            let pf = new MessageEmbed()
                .setAuthor(`${server.bot_prefix}${commandfile.config.name}${client.nsfw.get(commandfile.config.name) ? ' ▸ 🔞' : ''}`, server.cmds.find(c => c[0] === commandfile.config.name)[1] === 'true' ? 'https://cdn.discordapp.com/emojis/759043247791276072.png?v=1' : 'https://cdn.discordapp.com/emojis/759043247888138300.png?v=1')
                .setDescription(`${client.desc.get(commandfile.config.name)}\n\n**Usage:** ${usage}\n**Aliases:** ${aliases}\n**Cooldown:** \`${commandfile.config.cooldown ? `${commandfile.config.cooldown}s` : 'None'}\` | **Admin only:** ${client.admin.get(commandfile.config.name) ? '<:yess:759043247791276072>' : '<:noo:759043247888138300>'} | **NSFW:** ${client.nsfw.get(commandfile.config.name) ? '<:yess:759043247791276072>' : '<:noo:759043247888138300>'}`)
                .addField(`User Permissions Needed:`, `\`${memP}\``)
                .setColor(color)
            return message.channel.send(pf)
        }
    }
}