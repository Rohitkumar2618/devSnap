const express = require('express');
const { validateSingUpData } = require("../utils/Validation");

const authRouter = express.Router();
const User = require("../model/user");

const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const { userAuth } = require("../middlewares/auth");


// ! Adding user into DB
authRouter.post("/signup", async (req, res) => {
    try {
      // Validation of data
      validateSingUpData(req);
  
      const { firstName, lastName, email, password } = req.body;
  
      // Encrypt the password
      const passwordHash = await bcrypt.hash(password, 10);
  
      // Creating new instance of user
      const user = new User({
        firstName,
        lastName,
        email,
        password: passwordHash
      });
  
      await user.save();
      res.send("User added successfully");
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  });


//   ! checking the user in the db
  authRouter.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body; // Corrected field name from emailId to email
  
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      // Validate the password using the instance method
      const isPasswordValid = await user.validatePassword(password); // Use instance method to validate password
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      // Generate a JWT token
      const token = await user.getJWT(); // Call the getJWT method with await
  
      // Add the token to the cookie and send a response
      res.cookie("token", token, {
        httpOnly: true, 
        secure: true, // Ensure this is true in a production environment with HTTPS
        expires: new Date(Date.now() + 8 * 3600000), // Corrected expiration logic
      });
      res.status(200).json({ message: "Login Successful!" });
    } catch (err) {
      res.status(500).json({ error: `ERROR: ${err.message}` });
    }
  });

//   Logout the user
  authRouter.post('/logout',async (req, res)=>{

    res.cookie('token',null,{
        expires: new Date(Date.now()),
        });

        res.send('Logout  Successful');
  })


module.exports = authRouter;   