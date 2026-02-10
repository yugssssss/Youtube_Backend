const mongoose = require('mongoose');

const VideoStatsSchema = new mongoose.Schema({

    ref: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },

    views: {
        type: Number,
        default: 0,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
    },
    tags: {
        type: [String],
    }


}, {
    timestamps: true,
})

module.exports = mongoose.model("VideoStats", VideoStatsSchema);
