module.exports = async (client, oldMessage, newMessage) => {

    if (!newMessage.editedAt) return;
    client.emit("message", newMessage);
}