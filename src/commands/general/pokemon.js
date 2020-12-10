const { MessageEmbed } = require("discord.js")
var Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();

module.exports = {
    config: {
        name: "pokemon",
        desc: "Get more information about a certain pokemon",
        usage: [`pokemon <pokemon name>`]
    },
    run: async (server, message, args) => {
        const color = server.color;

        if (!args[0]) { return message.channel.send("Give me a pokemon to lookup information on") }

        P.getPokemonByName(args.join(" ")) // with Promise
            .then(function (response) {

                let typeList = []
                response.types.forEach(types => {
                    typeList.push(types.type.name)
                })
                let abilitiesList = []
                response.abilities.forEach(abs => {
                    abilitiesList.push(abs.ability.name)
                })
                let baseStats = []
                response.stats.forEach(stat => {
                    baseStats.push(stat.stat.name + ' »  ' + stat.base_stat)
                })
                let games = []
                response.game_indices.forEach(g => {
                    games.push(`\`${g.version.name}\``)
                })


                let gen
                switch (true) {
                    case (response.id <= 151):
                        gen = 'Generation I'
                        break
                    case (response.id <= 251):
                        gen = 'Generation II'
                        break
                    case (response.id <= 386):
                        gen = 'Generation III'
                        break
                    case (response.id <= 493):
                        gen = 'Generation IV'
                        break
                    case (response.id <= 649):
                        gen = 'Generation V'
                        break
                    case (response.id <= 721):
                        gen = 'Generation VI'
                        break
                    case (response.id <= 809):
                        gen = 'Generation VII'
                        break
                    case (response.id <= 898):
                        gen = 'Generation VIII'
                        break
                }

                let noperms = new MessageEmbed()
                    .setColor(color)
                    .setTitle(`${response.name}  |  ${gen}  |  Pokedex ID: ${response.id}`)
                    .setThumbnail(response.sprites.other['official-artwork'].front_default)
                    .setURL(response.sprites.other['official-artwork'].front_default)
                    .addField('Types', typeList.join("\n"), true)
                    .addField('\u200b', '\u200b', true)
                    .addField('Abilities', abilitiesList.join("\n"), true)
                    .addField('Base Stats', `${baseStats.join("\n")}\nexperience »  ${response.base_experience}`, true)
                    .addField('\u200b', '\u200b', true)
                    .addField('Games', games.join(" "), true)
                return message.channel.send(noperms)
            })
            .catch(function (error) { return message.channel.send("Either that pokemon doesn't exist or I just couldn't get its info") });
    }
}