const priv = require("../functions/privateCreate.js");

module.exports = async (client, oldState, newState) => {

    if(oldState.channelID === newState.channelID) return

    try {
        let oldChannel = await client.channels.fetch(oldState.channelID)
        let oldUser = await client.users.fetch(oldState.id)

        if (oldChannel.name === `${oldUser.username}'s Voice Channel`) {
            let profile = await Profile.findOne({ userID: oldUser.id, guildID: oldChannel.guild.id })
            profile.rooms.open = false
            profile.save()
            oldChannel.parent.children.forEach(async c => {
                await c.delete()
            })
            oldChannel.parent.delete()
        } else if (oldChannel.name.includes(`'s Voice Channel`)) {

            if (oldChannel.parent.children.find(c => c.name.includes(`s-text-channel`))) {

                oldChannel.parent.permissionOverwrites.get(oldUser.id).delete()
            }
        }
    } catch {
        let newChannel = await client.channels.fetch(newState.channelID)
        let newUser = await client.users.fetch(newState.id)

        if (newChannel.name === `Private Rooms`) {

            return priv.create(newChannel, newUser)
        }
    }

    try {
        let newChannel = await client.channels.fetch(newState.channelID)
        let newUser = await client.users.fetch(newState.id)

        if (newChannel.name === `Private Rooms`) {

            return priv.create(newChannel, newUser)
        } else if (newChannel.name.includes(`'s Voice Channel`)) {

            if (newChannel.parent.children.find(c => c.name.includes(`s-text-channel`))) {

                newChannel.parent.updateOverwrite(newUser.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true })
            }
        }
    } catch { }
}
