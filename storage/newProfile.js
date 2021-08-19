const { Schema, model } = require("mongoose");

const user = new Schema({
    userID: { type: String },
    tag: { type: String },
    color: { type: String, default: '#0099ff' },
    ign: { type: String },

})
module.exports = model("users", user);

