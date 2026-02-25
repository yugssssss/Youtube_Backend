

const VideoModel = require('../models/Video.model');
const VideoStats = require('../models/VideoStats.model');

const pubishvideo = async (req,res) =>{
    try {
        const {title,dricription,channelId,category,tags} = req.body;

        const video = new VideoModel({
            title,
            dricription,
            channelId
        });

        await video.save();

        const stats= new VideoStats({
            ref:video._id,
            category,
            tags
        });
        await stats.save();
        res.status(201).json({message:"video published successfully", data:video , stats});
    } catch (error) {
        res.status(500).json({message:"error publishing video", error} );
    }
}

module.exports = pubishvideo;