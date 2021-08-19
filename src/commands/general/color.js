const { MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
    config: {
        name: "color",
        aliases: ['c'],
        description: "Change your embed color",
    },
    run: async (server, message, args, pf) => {

        if (!args[0]) {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`color`)
                        .setPlaceholder(`Select a color`)
                        .setMinValues(1)
                        .setMaxValues(1)
                        .addOptions([{
                            label: 'Cobalt Blue',
                            value: 'blue',
                            description: `Make your embeds blue!`,
                            emoji: '873893344307200040',
                        }, {
                            label: 'Hunter Green',
                            value: 'green',
                            description: `Make your embeds green!`,
                            emoji: '873893343954886667',
                        }, {
                            label: 'Mindaro',
                            value: 'yellow',
                            description: `Make your embeds yellow!`,
                            emoji: '873893344521109524',
                        }, {
                            label: 'Safety Orange',
                            value: 'orange',
                            description: `Make your embeds orange!`,
                            emoji: '873893344491757568',
                        }, {
                            label: 'Auburn',
                            value: 'red',
                            description: `Make your embeds red!`,
                            emoji: '873893344558846012',
                        }, {
                            label: 'Razzmatazz',
                            value: 'pink',
                            description: `Make your embeds pink!`,
                            emoji: '873893344512733194',
                        }, {
                            label: 'Misty Rose',
                            value: 'white',
                            description: `Make your embeds white!`,
                            emoji: '873893344479154227',
                        }, {
                            label: 'Invis',
                            value: 'invis',
                            description: `Make your embeds invis!`,
                            emoji: '873893344424644638',
                        }, {
                            label: 'Custom',
                            value: 'custom',
                            description: `Put your own hex color code!`,
                        }])
                );

            await message.channel.send({ content: 'Select a color for your embeds!', components: [row] });

            client.on('interactionCreate', async interaction => {
                if (interaction.isSelectMenu()) {
                    if (interaction.customId.includes('color') && interaction.user.id === message.author.id) {
                        switch (interaction.values[0]) {
                            case 'blue':
                                pf.color = '18499d'
                                await pf.save()
                                interaction.deferUpdate()
                                return message.channel.send(`You have set your embed color to \`Cobalt Blue\``)
                            case 'green':
                                pf.color = '355e3b'
                                await pf.save()
                                interaction.deferUpdate()
                                return message.channel.send(`You have set your embed color to \`Hunter Green\``)
                            case 'yellow':
                                pf.color = 'e3f988'
                                await pf.save()
                                interaction.deferUpdate()
                                return message.channel.send(`You have set your embed color to \`Mindaro\``)
                            case 'orange':
                                pf.color = 'ff6700'
                                await pf.save()
                                interaction.deferUpdate()
                                return message.channel.send(`You have set your embed color to \`Safety Orange\``)
                            case 'red':
                                pf.color = 'a41e25'
                                await pf.save()
                                interaction.deferUpdate()
                                return message.channel.send(`You have set your embed color to \`Auburn\``)
                            case 'pink':
                                pf.color = 'e3256b'
                                await pf.save()
                                interaction.deferUpdate()
                                return message.channel.send(`You have set your embed color to \`Razzmatazz\``)
                            case 'white':
                                pf.color = 'ffe4e1'
                                await pf.save()
                                interaction.deferUpdate()
                                return message.channel.send(`You have set your embed color to \`Misty Rose\``)
                            case 'invis':
                                pf.color = '36393F'
                                await pf.save()
                                interaction.deferUpdate()
                                return message.channel.send(`You have set your embed color to \`Invis\``)
                            case 'custom':
                                await interaction.reply(`What hex color would you like to you? *(Without the #)*`)
                                interaction.deferUpdate()
                                const filter = m => m.content.length === 6 && m.author.id === message.author.id;
                                message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
                                    .then(collected => {
                                        pf.color = collected.first().content
                                        pf.save()
                                        return message.channel.send(`You have set your embed color to \`#${collected.first().content}\``)
                                    })
                        }
                    }
                }
            })
        } else if (args[0].length === 6) {
            pf.color = args[0]
            await pf.save()
            return message.channel.send(`You have set your embed color to \`#${args[0]}\``)
        } else {
            return message.channel.send(`Invalid hex color code`)
        }
    }
}