const { Schema, model } = require("mongoose");

const guild = new Schema({
    guildID: { type: String },
    bot_prefix: { type: String, default: '!' },
    color: { type: String, default: '#2F3136' },
})
module.exports = model("guilds", guild);