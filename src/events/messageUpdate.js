module.exports = async (client, oldMessage, newMessage) => {

    if (!newMessage.editedAt || oldMessage.author.bot || newMessage.author.bot) return;
    client.emit("message", newMessage);
}