const jwt = require("jsonwebtoken");
const User = require("../model/user")

const userAuth = async (req,res,next)=>{
try{
    const {token} = req.cookies;

    if(!token){
        throw new Error("Token is not valid")
      }

    const decodeObj = await jwt.verify(token, "DEv$dfmkl");

    const {_id} = decodeObj;
 
   const user = await User.findById(_id);
    
   if(!user){
    throw new Error("user not found")
  }

  req.user = user;
  next();
}catch(err){
    res.status(400).json({ error: `ERROR: ${err.message}` });
  }
  
   

}

module.exports = {
    userAuth
}