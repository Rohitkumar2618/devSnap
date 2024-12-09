// const mongoose = require('mongoose');


// const connectionRequestSchema = mongoose.Schema({

//     fromUserId:{
//         type: mongoose.Schema.Types.ObjectId,
//         required:true
        
//     },
//     toUserId:{
//         type: mongoose.Schema.Types.ObjectId,
//         required:true 
//     },
//     status:{
//         type: String,
//         enum:{
//             values:["ignore","interested","accepted","rejected",],
//              message: `"{VALUE}" is an incorrect status type`
//         },
//         required:true 
//     },
   
// },
// {
//     timestamps: true
//   }
// );


// connectionRequestSchema.
// pre("save", function(next){
//     const connectionRequest = this;

//     // Check if the fromUser is same as toUserId
//     if(connectionRequest.fromUser.equals(connectionRequest.toUserId)){
//         throw new Error("You can't send connection request to yourself")
//     }
//     next();
// })


// const  ConnectionRequestModel = new mongoose.model(
//     "ConnectionRequest",
//   connectionRequestSchema,
  
// )
   
// module.exports = ConnectionRequestModel;

const mongoose = require('mongoose');

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",  //reference  to the user collection
      required: true
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    status: {
      type: String,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: `"{VALUE}" is an incorrect status type`
      },
      required: true
    }
  },
  {
    timestamps: true
  }
);

//  index to search user easily

// ! compound index example

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// Pre-save middleware to prevent self-request
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  // Check if fromUserId is the same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    const error = new Error("You can't send a connection request to yourself.");
    return next(error);
  }

  next();
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
