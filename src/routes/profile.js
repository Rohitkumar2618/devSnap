const express = require('express');
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require('../utils/Validation');

const bcrypt = require("bcrypt");

const profileRouter = express.Router();


profileRouter.post('/profile/view', userAuth, async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        throw new Error("user not found");
      }
      res.send(user);
    } catch (err) {
      res.status(500).json({ error: `ERROR: ${err.message}` });
    }
  });

//   profileRouter.patch('/profile/edit', userAuth , async (req, res) => {

//     try{
            
//     if(!validateEditProfileData(req)){
//         return res.status(400).json({error: "you can't edit this section"}+req);
//     }

//     const loggedInUser  = req.user;

//     Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]))

 
//     await loggedInUser.save();  

//     res.json({
//         message: `${loggedInUser.firstName}`,
//         data: loggedInUser,
//     })

 
//     }catch(err){
//         res.status(400).json({ error: `ERROR: ${err.message}` });
//     }

//   })
  

// !update the few data of the user
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        // Validate the fields being edited
        const { isValid, disallowedFields } = validateEditProfileData(req);

        if (!isValid) {
            return res.status(400).json({
                error: "You can't edit these sections",
                disallowedFields, // Return the fields that are not allowed to be updated
            });
        }

        const loggedInUser = req.user;

        // Update only allowed fields
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}`,
            data: loggedInUser,
        });
    } catch (err) {
        res.status(400).json({ error: `ERROR: ${err.message}` });
    }
});


// Route for updating password
profileRouter.patch('/profile/update-password', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user; // The authenticated user from middleware
        const { currentPassword, newPassword } = req.body;

        // Validate input fields
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Both current and new passwords are required." });
        }

        // Check if currentPassword matches the existing password
        const isPasswordMatch = await bcrypt.compare(currentPassword, loggedInUser.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Current password is incorrect." });
        }

        // Ensure newPassword meets security requirements (e.g., length, complexity)
        if (newPassword.length < 8) {
            return res.status(400).json({ error: "New password must be at least 8 characters long." });
        }

        // Hash the new password and save it
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = hashedPassword;

        await loggedInUser.save();

        res.status(200).json({ message: "Password updated successfully." });
    } catch (err) {
        res.status(500).json({ error: `ERROR: ${err.message}` });
    }
});




module.exports = profileRouter;