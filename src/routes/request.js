const express = require('express');
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post('/sendConnectionRequest', userAuth, async (req,res)=>{

    try{
        const user = req.user;

        console.log(user);
    }catch(e){
    console.log(e);
    }
})



module.exports = requestRouter;