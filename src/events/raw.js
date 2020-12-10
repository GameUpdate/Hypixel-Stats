module.exports = async (client, packet) => {
    if (!packet) return;
    if (["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"].includes(packet.t)) {

        const server = await Server.findOne({ guildID: packet.d.guild_id });
        if (server.reactionroles.some((g) => g.message === packet.d.message_id && g.emote === packet.d.emoji.id)) {
            const guild = client.guilds.cache.get(packet.d.guild_id);
            const member = guild.members.cache.get(packet.d.user_id) || guild.members.fetch(packet.d.user_id);
            if (!member) return;
            if (member.user.bot) return
            const role = guild.roles.cache.get(server.reactionroles.find(g => g.message === packet.d.message_id && g.emote == packet.d.emoji.id).role)
            if (!role) return;
            if (packet.t === "MESSAGE_REACTION_ADD") {
                member.roles.add(role)
            } else {
                member.roles.remove(role);
            }
        }
    }
}