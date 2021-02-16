const { Schema, model } = require("mongoose");

const user = new Schema({
    guildID: { type: String },
    userID: { type: String },
    tag: { type: String },
    inqueue: { type: Boolean, default: false },
    ingame: { type: Boolean, default: false },
    ign: { type: String },
    elo: { type: Number, default: 0 },
    totalGames: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    winstreak: { type: Number, default: 0 },
    bedstreak: { type: Number, default: 0 },
    kills: { type: Number, default: 0 },
    deaths: { type: Number, default: 0 },
    bedsBroken: { type: Number, default: 0 },
    bedsLost: { type: Number, default: 0 },
    strikes: { type: Number, default: 0 },
})
module.exports = model("users", user);

