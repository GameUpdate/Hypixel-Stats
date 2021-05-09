const utils = require(`../functions/utils.js`)

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (!message.guild) return

    const server = await utils.findOrCreateGuild(message.guild.id)
    const pf = await utils.findOrCreateUser(message.guild.id, message.author)
    const args = message.content.slice(server.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const now = Date.now();

    const botWasMentioned = (message.content === `<@!${client.user.id}>` || message.content === `<@!${client.user.id}>` || message.content === `<@${client.user.id}>` || message.content === `<@${client.user.id}> `)
    if (botWasMentioned) return message.channel.send(`Hi my prefix is \`${server.prefix}\`\nUse \`${server.prefix}help\` to see all available commands`)

    if (!message.content.startsWith(server.prefix)) return;
    let commandfile = client.commands.get(command) || client.commands.get(client.aliases.get(command) || client.commands.get(command.toLowerCase()));
    if (!commandfile) return

    if (message.author.id != client.config.ownerID) {
        if (client.admin.get(commandfile.config.name) && !message.member.permissions.has(`ADMINISTRATOR`)) return message.channel.send(`Only admins of the server can use the \`${commandfile.config.name}\` command.`);
    }
    try {
        if (client.memberPerms.get(commandfile.config.name).forEach(perm => !message.member.permissions.includes(perm))) return message.channel.send(`You do not have the required perms to run the \`${commandfile.config.name}\` command.`);
    } catch { }

    const timestamps = client.cooldowns.get(commandfile.config.name);
    const cooldownAmount = (commandfile.config.cooldown || 0) * 1000;

    if (message.author.id != client.config.ownerID) {
        if (!message.member.permissions.has(`ADMINISTRATOR`)) {
            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.channel.send(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandfile.config.name}\` command.`);
                }
            }
        }
    }

    commandfile.run(server, message, args);
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    return
}