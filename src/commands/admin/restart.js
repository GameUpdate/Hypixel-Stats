
module.exports = {
    config: {
        name: "restart",
        desc: "Restarts the bot",
        usage: [`restart`],
        admin: true
    },
    run: async (server, message, args) => {

        if (message.author.id != client.config.ownerID) return message.channel.send(`Fuck off`)

        message.channel.send("Restarting...");
        client.destroy();
        await client.login(client.config.bot_token);
        message.channel.send("I'm back!");
    }
}