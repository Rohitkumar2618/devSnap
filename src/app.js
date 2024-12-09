 

const express = require("express");
const connectDB = require("./config/database");
const User = require("./model/user");
const { validateSingUpData } = require("./utils/Validation");
const app = express();
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(cookieParser());

const port = 4000;

// ! Adding the data into DB

// ! Fetching the particular user using email
// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body; // Corrected field name from emailId to email

//     // Check if the user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Validate the password
//     const isPasswordValid = await validatePassword(password)
//     if (!isPasswordValid) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Generate a JWT token
//     const token = await user.getJWT(); // Call the getJWT method with await

//     // Add the token to the cookie and send a response
//     res.cookie("token", token, {
//       httpOnly: true, 
//       secure: true, // Ensure this is true in a production environment with HTTPS
//       expires: new Date(Date.now() + 8 * 3600000), // Corrected expiration logic
//     });
//     res.status(200).json({ message: "Login Successful!" });
//   } catch (err) {
//     res.status(500).json({ error: `ERROR: ${err.message}` });
//   }
// });




// ! Fetching all users from the DB
// app.get("/feed", userAuth, async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.send(users);
//   } catch (error) {
//     console.error(error.message);
//     res.status(400).send("Server Error");
//   }
// });

// ! Delete the user from the database
// app.delete("/user", userAuth, async (req, res) => { // Added userAuth middleware for protection
//   const userEmail = req.body.email;

//   try {
//     const user = await User.findOneAndDelete({ email: userEmail });
//     if (!user) return res.status(404).json({ msg: "User not found" });

//     res.json({ msg: "User deleted successfully" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// ! Update user details
// app.patch("/user", userAuth, async (req, res) => { // Added userAuth middleware for protection
//   const { userId, ...data } = req.body; // Destructure userId and rest of the data

//   try {
//     const user = await User.findByIdAndUpdate(userId, data, {
//       new: true, // Return the updated document
//     });

//     if (!user) return res.status(404).json({ msg: "User not found" });
//     res.json({ msg: "User updated successfully", user });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });



app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter); 
app.use('/',userRouter); 

// Connect to the database and start the server
connectDB()
  .then(() => {
    console.log("Connected to the database");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err.message);
  });
