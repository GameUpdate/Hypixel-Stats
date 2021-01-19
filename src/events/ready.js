
module.exports = async (client) => {

    client.user.setActivity("twitch", { type: 'LISTENTING', url: `https://twitch.tv/mizkif` });

    console.clear()
    console.log('Ready...')
}