const { Schema, model } = require("mongoose");

const guild = new Schema({
    guildID: { type: String },
    bot_prefix: { type: String, default: '.' },
    color: { type: String, default: '#2F3136' },
    leveling: {
        nxtLevel: { type: Number, default: 100 },
        xpMin: { type: Number, default: 20 },
        xpMax: { type: Number, default: 35 },
    },
    welcome: {
        enabled: { type: Boolean, default: false },
        image: { type: Boolean, default: false },
        channel: { type: String, default: '' },
        message: { type: String, default: `Welcome {member.name} to {guild}!` }
    },
    goodbye: {
        enabled: { type: Boolean, default: false },
        image: { type: Boolean, default: false },
        channel: { type: String, default: '' },
        message: { type: String, default: `{member.name} left the server!` }
    },
    autorole: {
        enabled: { type: Boolean, default: false },
        role: { type: String, default: '' },
    },
    reactionroles: {
        type: [{
            message: { type: String },
            channel: { type: String },
            guild: { type: String },
            emote: { type: Object },
            role: { type: Object },
        }], default: []
    },
    xprole: { type: Array, default: [] },
    msgrole: { type: Array, default: [] },
    cmds: { type: [[String, Boolean]], default: [] },
    filter: { type: [String], default: [] },
    logs: {
        enabled: { type: Boolean, default: false },
        channel: { type: String, default: '' },
    },
})
module.exports = model("guilds", guild);