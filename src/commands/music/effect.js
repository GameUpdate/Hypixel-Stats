const { MessageEmbed } = require("discord.js")
FiltersList = require("../../../storage/filters.json");

module.exports = {
    config: {
        name: "effect",
        aliases: ["eff", "effects"],
        desc: "Toggle an effect to the music or see which ones are on",
        usage: [`eff list`, `eff <effect>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        const queue = client.player.getQueue(message);
        const voice = message.member.voice.channel;
        if (!voice) {
            return message.channel.send(`You're not in a voice channel`)
        }

        if (!queue) {
            return message.channel.send(`I'm not playing anything atm`);
        }

        const filter = args[0];
        if (!filter) return message.channel.send(`To see a list of effects do \`${server.bot_prefix}eff l\` and toggle them with \`${server.bot_prefix}eff <effect>\``);

        if (['l', 'list'].includes(filter.toLowerCase())) {
            const filtersStatuses = [[], []];

            Object.keys(FiltersList).forEach((filterName) => {
                const array = filtersStatuses[0].length > filtersStatuses[1].length ? filtersStatuses[1] : filtersStatuses[0];
                array.push(FiltersList[filterName] + " : " + (client.player.getQueue(message).filters[filterName] ? '<:yess:759043247791276072>' : '<:noo:759043247888138300>'));
            });

            const list = new MessageEmbed()
                .addField(`Effects`, filtersStatuses[0].join("\n"), true)
                .addField("** **", filtersStatuses[1].join("\n"), true)
                .setColor(color);

            return message.channel.send(list);
        }
        const filterToUpdate = Object.values(FiltersList).find((f) => f.toLowerCase() === filter.toLowerCase());
        if (!filterToUpdate) return message.channel.send(`Couldn't find that effect`);

        const filterRealName = Object.keys(FiltersList).find((f) => FiltersList[f] === filterToUpdate);

        const queueFilters = client.player.getQueue(message).filters;
        const filtersUpdated = {};
        filtersUpdated[filterRealName] = queueFilters[filterRealName] ? false : true;
        client.player.setFilters(message, filtersUpdated);

        if (filtersUpdated[filterRealName]) message.channel.send(`Added an effect`);
        else message.channel.send(`Removed an effect`);
    }
}