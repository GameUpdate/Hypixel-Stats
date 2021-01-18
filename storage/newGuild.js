const { Schema, model } = require("mongoose");

const guild = new Schema({
    guildID: { type: String },
    bot_prefix: { type: String, default: '.' },
    color: { type: String, default: '#2F3136' },
    reactionroles: {
        type: [{
            message: { type: String },
            channel: { type: String },
            guild: { type: String },
            emote: { type: Object },
            role: { type: Object },
        }], default: []
    },
    giveaways: {
        type: [{
            message: { type: String },
            channel: { type: String },
            guild: { type: String },
            prize: { type: String },
            end: { type: String },
        }], default: []
    },
    mutes: {
        type: [{
            userID: { type: String },
            time: { type: String },
        }], default: []
    },
})
module.exports = model("guilds", guild);