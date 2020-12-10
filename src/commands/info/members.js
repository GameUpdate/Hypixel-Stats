const { MessageEmbed } = require("discord.js")
Pagination = require("discord-paginationembed");

module.exports = {
    config: {
        name: "members",
        aliases: ['mm', 'member'],
        desc: "List all the members in the server, or the ones with a certain role",
        usage: [`mm list`, `mm <role>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) {
            return message.channel.send(`Members command, use \`${server.bot_prefix}members list\` or \`${server.bot_prefix}members <role>\` to see all server members or only the ones with a specific role`)
        } else if (args[0].toLowerCase() === 'list' || args[0].toLowerCase() === 'l') {
            const mm = message.guild.members.cache.array();
            const filtered = await mm.sort(function (a, b) {
                return (a.displayName.toUpperCase() < b.displayName.toUpperCase()) ? -1 : (a.displayName.toUpperCase() > b.displayName.toUpperCase()) ? 1 : 0;
            });
            const FieldsEmbed = new Pagination.FieldsEmbed();
            FieldsEmbed.embed
                .setColor(color)
                .setTitle(`Members in ${message.guild.name}`)

            FieldsEmbed.setArray(filtered[0] ? filtered : [])
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .setElementsPerPage(10)
                .formatField("** **", (m) => `${m} • ${m.id}`)
                .setDisabledNavigationEmojis(['delete'])
                .setPageIndicator('footer')
            return FieldsEmbed.build();
        } else {
            await message.guild.roles.fetch({ query: args.join(" "), limit: 1 })
            let role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args.join(" ").toLowerCase())) || message.guild.roles.cache.get(args[0])
            if (!role) return message.channel.send("Couldn't find that role")

            const mm = role.members.array();
            const filtered = await mm.sort(function (a, b) {
                return (a.displayName.toUpperCase() < b.displayName.toUpperCase()) ? -1 : (a.displayName.toUpperCase() > b.displayName.toUpperCase()) ? 1 : 0;
            });
            let pages = []
            function createEmbed(start) {
                const current = filtered.slice(start * 10, (start * 10) + 10);
                let num;
                if (typeof (start) === "string") {
                    num = parseInt(start, 10);
                } else {
                    num = start + 1;
                }
                const mapped = current.map(m => `${m} • ${m.id}`).join("\n");
                page = new MessageEmbed()
                    .setTitle(`Members with the ${role.name} role`)
                    .setDescription(`**Total Amount:** \`${role.members.size}\`\n${mapped}`)
                    .setColor(color)
                return pages[i] = page
            }
            for (i = 0; i < Math.floor(role.members.size / 10) + 1; i++) {
                createEmbed(i)
            }
            return message.channel.send(paginationEmbed(message, pages))
        }
    }
}