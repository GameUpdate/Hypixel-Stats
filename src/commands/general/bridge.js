const { MessageEmbed } = require("discord.js")

module.exports = {
    config: {
        name: "bridge",
        desc: "Bridge against others for money!",
        usage: [`bridge`]
    },
    run: async (server, message, args) => {

        function sleep(milliseconds) {
            const date = Date.now();
            let currentDate = null;
            do {
                currentDate = Date.now();
            } while (currentDate - date < milliseconds);
        }

        let bridger = new MessageEmbed()
        const red = client.emojis.cache.get('836282098553323570')
        const redS = client.emojis.cache.get('836272131171549224')
        const yellow = client.emojis.cache.get('836282098531696690')
        const yellowS = client.emojis.cache.get('836272131544318052')
        const green = client.emojis.cache.get('836282098468782121')
        const greenS = client.emojis.cache.get('836272131427926097')
        const pink = client.emojis.cache.get('836282098528550963')
        const pinkS = client.emojis.cache.get('836272131641311232')
        const blue = client.emojis.cache.get('836282098545066024')
        const blueS = client.emojis.cache.get('836272131507355658')
        let race = [red]
        let race1 = [yellow]
        let race2 = [green]
        let race3 = [pink]
        let race4 = [blue]

        async function addOne() {
            await sleep(3000)
            race.unshift(redS)
            race1.unshift(yellowS)
            race2.unshift(greenS)
            race3.unshift(pinkS)
            race4.unshift(blueS)
            return bridger.setDescription(`${race.join('')}\n${race1.join('')}\n${race2.join('')}\n${race3.join('')}\n${race4.join('')}`)
        }

        bridger.setColor(server.color)
        bridger.setDescription(`${race.join('')}\n${race1.join('')}\n${race2.join('')}\n${race3.join('')}\n${race4.join('')}`)

        message.channel.send(bridger).then(async msg => {
            await addOne()
            await msg.edit(bridger)
            await addOne()
            await msg.edit(bridger)
            await addOne()
            await msg.edit(bridger)
            await addOne()
            await msg.edit(bridger)
            await addOne()
            await msg.edit(bridger)
            await addOne()
            await msg.edit(bridger)
            await addOne()
            await msg.edit(bridger)
            await sleep(3000)
            race.splice(-1); race.push(redS);
            race1.splice(-1); race1.push(yellowS);
            race2.splice(-1); race2.push(greenS);
            race3.splice(-1); race3.push(pinkS);
            race4.splice(-1); race4.push(blueS);
            bridger.setDescription(`${race.join('')}\n${race1.join('')}\n${race2.join('')}\n${race3.join('')}\n${race4.join('')}`)
            await msg.edit(bridger)
        })

    }
}