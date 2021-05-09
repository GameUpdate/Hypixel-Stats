const { Schema, model } = require("mongoose");

const user = new Schema({
    guildID: { type: String },
    userID: { type: String },
    tag: { type: String },
    bal: { type: Number, default: 0 },
    stats: {
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        history: { type: Object, default: {} }
    },
    char: {
        
    }

})
module.exports = model("users", user);

