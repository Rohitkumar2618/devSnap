const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../model/connectRequest');
const userRouter = express.Router();

// const USER_SAVE_DATA = " firstName lastName"

userRouter.get('/user/requests/received', userAuth ,async (req,res)=>{

    try{

        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status: 'interested'
        }).populate("fromUserId",["firstName", "lastName"])

        res.json(
                {
                    message: "Received connection requests",
                    data: connectionRequests
                }
        )

    }catch(err){
        res.status(400).json({ error: `ERROR: ${err.message}` });
    }

});


const USER_SAVE_DATA = "firstName lastName";

userRouter.get('/user/connection', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: 'accepted' }
            ]
        }).populate("fromUserId", USER_SAVE_DATA)
       
        const data =  connectionRequests.map((row)=>row.fromUserId) 

        res.json({
            message: "Your connections",
            data
        });
    } catch (err) {
        res.status(400).json({ error: `ERROR: ${err.message}` });
    }
});



module.exports = userRouter



