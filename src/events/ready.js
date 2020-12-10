
module.exports = async (client) => {

    client.user.setActivity("with your feelings xo", { type: 'PLAYING' });
    client.guilds.cache.forEach(g => {
        g.fetchInvites().then(guildInvites => {
            client.invites.set(guildInvites, g.id)
        })
    })

    console.clear()
    console.log('Ready...')
}