const { Schema, model } = require("mongoose");

const user = new Schema({
    guildID: { type: String },
    userID: { type: String },
    lvl: {
        level: { type: Number, default: 1 },
        xp: { type: Number, default: 0 },
        canXP: { type: Boolean, default: true },
    },
    eco: {
        bal_changes: { type: [Number], default: [] },
        bank: { type: Number, default: 0 },
        gems: { type: Number, default: 1 },
        bal: { type: Number, default: 5000 },
    },
    pf: {
        msgTotal: { type: Number, default: 0 },
        firstJoin: { type: String, default: 'Couldn\'t find when' },
        inviter: { type: String, default: 'Couldn\'t track who' },
        isFake: { type: Boolean, default: false },
        private: { type: Boolean, default: false },
    },
    inv: {
        invitesTotal: { type: Number, default: 0 },
        invites: { type: Number, default: 0 },
        fakes: { type: Number, default: 0 },
        left: { type: Number, default: 0 },
    },
    rooms: {
        open: { type: Boolean, default: false },
    }
})
module.exports = model("users", user);

