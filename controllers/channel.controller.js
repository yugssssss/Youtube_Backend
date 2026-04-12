const Channel = require('../models/Channel.model');
const UserModel = require('../models/User.model');
const mongoose = require('mongoose');
const redis = require('../utils/redisClint');
const createChannel = async (req,res) =>{
    try {
        const{ownerId , ChannelName , about} = req.body;
        const  newChannel = new Channel({
            ownerId,
            ChannelName,
            about
        });
        await newChannel.save();

        res.status(201).json({message:"channel created successfully" , data:newChannel});
    } catch (error) {
        res.status(500).json({message:"error creating channel", error});
    }
}

const getAccountDetails = async (req , res) =>{
    try {
        const {userId} = req.body;
        // logic
        // if there are 2 collections , then populate is recomended but if more than 2 colelection or nested collection like we have is this project then pipeline is recommentded (merging pipeline)  // user is parent , thats why we are using UserModel here

        const cachedData = await redis.get(`account_details_${userId}`);
        if(cachedData){
            return res.status(200).json({message:"account details (from cache) :", data:JSON.parse(cachedData)});
        }

        const data = await UserModel.aggregate([ 
            //stage 1 (match - find user by userid)
            {
                $match: { _id: new mongoose.Types.ObjectId(userId) }
            },

            // stage 2 (lookup - join with channels collection)
            {
                $lookup:{
                    from:"channels",
                    localField:"_id",
                    foreignField:"ownerId",
                    as:"details"
                }
            },
            // // stage 3 
            {  
                $unwind :{ // convert array(detail) to object
                    path:"$details",
                }


            },
            
            // stage 4 (project - select specific fields to return)
            // {
            //     $project:{
            //       username:1,
            //       about:1,
            //         ChannelName:"$details.ChannelName",
            //         about:"$details.about"

            //     }

            // }
        ])
        
        await redis.set(`account_details_${userId}`, JSON.stringify(data), 'EX', 20); // cache for 1 hour


       return res.status(200).json({message:"account details :",data});

    } catch (error) {
       return res.status(500).json({message:"error fetching account details", err : error.message});
    }
}


// controller to get the user details , channel details and videos uploaded by the user using aggregation pipeline

const getDetails = async (req,res) =>{
    try {
        const  {userId} = req.params;

        const data = await UserModel.aggregate([
            {
                $match:{
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup:{
                    from:"channels",
                    localField:"_id",
                    foreignField:"ownerId",
                    as:"channelDetails"
                } 
            },
            {
                // get video data
                $lookup:{
                    from:"videos",
                    localField:"channelDetails._id",
                    foreignField:"channelId",
                    as:"videos"
                }
            },
            {
                $lookup:{
                    from:"videostats",
                    localField:"videos._id",
                    foreignField:"ref",
                    as:"video_stats"
                }
            },
             {
        // operaiton name
      $addFields: {
        // new field name - your choice
          videos: {
            // map operation - iterate
            $map: {
              // iterate on videos array
              input: "$videos",
              // videos : [{v1}, {v2}, {v3}, {v4}]
              // stats : [{s1}, {s2}, {s3}, {s4}]
              as: "video",

              /*
               {
                  ...video,

               }
              */
              in: {
                $mergeObjects: [
                  "$$video",
                  {
                    stats: {
                      $arrayElemAt: [
                        {
                          //  // stats : [{s1}, {s2}, {s3}, {s4}]
                          $filter: {
                            input: "$video_stats",
                            as: "stat",
                            cond: { $eq: ["$$stat.video_id", "$$video._id"] }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },

         {
        $project : {
          stats: 0
        }
      }
           
        ])

        return res.status(200).json({message:"details fetched success", data});
    } catch (error) {
        
    }
}

const getResultFromCbse = async (req,res) =>{
    try {
        const {userId} = req.body;

        const key = `key:${userId}`;
        const limit = 5;
        const time_duration = 60;

        const requestCount = await redis.incr(key);

        await redis.expire(key, time_duration);
        if(requestCount >limit){
            return res.status(429).json({message:"too many request , please try again later"});
        }

        return res.status(200).json({message:"result from cbse api"});
    } catch (error) {
        return res.status(500).json({message:"error fetching cbse result", error: error.message});
    }
}



module.exports = {
    createChannel,
    getAccountDetails,
    getDetails,
    getResultFromCbse
}