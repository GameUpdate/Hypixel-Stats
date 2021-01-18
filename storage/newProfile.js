const { Schema, model } = require("mongoose");

const user = new Schema({
    guildID: { type: String },
    userID: { type: String },
    username: { type: String },
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
})
module.exports = model("users", user);

