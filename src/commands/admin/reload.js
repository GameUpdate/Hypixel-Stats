
module.exports = {
    config: {
        name: "reload",
        desc: "Reload a command [Only for the bot creator]",
        usage: ["reload <command>"],
        admin: true
    },
    run: async (server, message, args) => {

        if (message.author.id != client.config.ownerID) return message.channel.send(`Fuck off`)

        let commandfile = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]) || client.commands.get(args[0].toLowerCase()));
        if (!commandfile) return message.channel.send(`Could'nt find that command`)

        delete require.cache[commandfile];

        try {
            client.commands.set(commandfile.config.name, commandfile);
            return message.channel.send(`Command \`${commandfile.config.name}\` has been reloaded!`);
        } catch (error) {
            return message.channel.send(`There was an error while reloading a command \`${commandfile.config.name}\``);
        }

    }
}