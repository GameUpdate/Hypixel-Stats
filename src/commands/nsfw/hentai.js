const { MessageEmbed } = require("discord.js")
const akaneko = require('akaneko');

module.exports = {
    config: {
        name: "hentai",
        nsfw: true,
        desc: `Get random hentai`,
        usage: [`hentai`],
    },
    run: async (server, message, args) => {
        const color = server.color;

        let noperms = new MessageEmbed()
            .setColor(color)

        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }

        let img
        switch (getRandomInt(11)) {
            case 0:
                img = akaneko.nsfw.ass()
                noperms.setTitle(`:hot_face: Ass pic`)
                noperms.setURL(img)
                noperms.setImage(img)
                break
            case 1:
                img = akaneko.nsfw.bdsm()
                noperms.setTitle(`:hot_face: BDSM pic`)
                noperms.setURL(img)
                noperms.setImage(img)
                break
            case 2:
                img = akaneko.nsfw.blowjob()
                noperms.setTitle(`:hot_face: Blowjob pic`)
                noperms.setURL(img)
                noperms.setImage(img)
                break
            case 3:
                img = akaneko.nsfw.cum()
                noperms.setTitle(`:hot_face: Cum pic`)
                noperms.setURL(img)
                noperms.setImage(img)
                break
            case 4:
                img = akaneko.nsfw.hentai()
                noperms.setTitle(`:hot_face: Random hentai pic`)
                noperms.setURL(img)
                noperms.setImage(img)
                break
            case 5:
                img = akaneko.nsfw.netorare()
                noperms.setTitle(`:hot_face: Netorare pic`)
                noperms.setURL(img)
                noperms.setImage(img)
                break
            case 6:
                img = akaneko.nsfw.maid()
                noperms.setTitle(`:hot_face: Maid pic`)
                noperms.setURL(img)
                noperms.setImage(img)
                break
            case 7:
                img = akaneko.nsfw.orgy()
                noperms.setTitle(`:hot_face: Orgy pic`)
                noperms.setURL(img)
                noperms.setImage(img)
                break
            case 8:
                img = akaneko.nsfw.pussy()
                noperms.setTitle(`:hot_face: Pussy pic`)
                noperms.setURL(img)
                noperms.setImage(img)
                break
            case 9:
                img = akaneko.nsfw.uniform()
                noperms.setTitle(`:hot_face: Uniform pic`)
                noperms.setURL(img)
                noperms.setImage(img)
                break
            case 10:
                img = akaneko.nsfw.gifs()
                while (!img.includes('.gif')) {
                    img = akaneko.nsfw.gifs()
                }
                noperms.setURL(img)
                noperms.setTitle(`:hot_face: Hentai gif`)
                noperms.setImage(img)
                break
        }
        return message.channel.send(noperms)
    }
}