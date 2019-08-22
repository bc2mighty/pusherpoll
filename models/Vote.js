const mongoose = require("mongoose")

const VoteSchema = new mongoose.Schema({
    os: {
        type: String,
        required: true
    },
    points: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Vote", VoteSchema)
