const { gameSetup } = require("../functions/utils");

module.exports = async (client, oldState, newState) => {
    if (!newState) return

    if (newState && newState.channel && newState.channel.full && client.queues.includes(newState.channelID)) {
        setTimeout(() => {
            if (newState && newState.channel && newState.channel.full) gameSetup(newState.channel)
        }, 3000)
    }
}