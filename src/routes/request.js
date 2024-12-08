// const express = require('express');
// const { userAuth } = require("../middlewares/auth");
// const requestRouter = express.Router();
// const ConnectionRequest  = require('../model/connectRequest')

// requestRouter.post('/request/send/:status/:toUserId', 
//     userAuth, 
//     async (req,res)=>{
//     try{

//         const fromUserId = req.user._id;
//         const toUserId = req.params.toUserId;
//         const status = req.params.status;


//         const allowedStatus = ["ignored","interested"];

//         if(!allowedStatus.includes(status)){
//             return res.status(400)
//             .json({ error: "Invalid status type" });
//         }

//         // checking the an of them sended the requested each other
//         const existingRequest = await ConnectionRequest.findOne({
//           $or:[
//             { fromUserId,toUserId},
//             { fromUserId:toUserId,toUserId:fromUserId}
//           ]
//         });

//     if( existingRequest){
//         return res.status(400)
//        .json({ message : "Connection request already exits " });
//     }

//         const connectionRequest = new ConnectionRequest({
//             fromUserId,
//             toUserId,
//             status
//         })

//         const data =  await connectionRequest .save();

//         res.json({
//             message: "Connection request sent successfully",
//             data
//         });
    
//     }
//     catch (err) {
//         res.status(400).json({ error: `ERROR: ${err.message}` });
//       }
// })



// module.exports = requestRouter;


const express = require('express');
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require('../model/connectRequest');
const { findById } = require('../model/user');
const User = require('../model/user');

requestRouter.post('/request/send/:status/:toUserId', 
    userAuth, 
    async (req, res) => {
    try {
        const fromUserId = req.user._id; // Authenticated user's ID
        const toUserId = req.params.toUserId; // Target user's ID
        const status = req.params.status; // Status from URL parameter

        // Allowed status values
        const allowedStatus = ["ignored", "interested"];

        // Validate the status parameter
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ error: "Invalid status type. Allowed values are 'ignore' or 'interested'." });
        } 


        // Checking the user are present in the db or not
      const toUser = await User.findById(toUserId);
      if(!toUser){
        return res.status(404).json({ message: "User not found." });  // Return 404 if the user does not exist
      }


      


        // Check if a connection request already exists between the users
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Connection request already exists." });
        }

        // Create a new connection request
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        // Save the request to the database
        const data = await connectionRequest.save();

        res.status(201).json({
            message: req.user.firstName + " is " + status + "  in " + toUser.firstName,
            data
        });
    } catch (err) {
        res.status(500).json({ error: `ERROR: ${err.message}` });
    }
});

module.exports = requestRouter;
 