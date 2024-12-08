

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken"); // Ensure jwt is imported
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"], // **Make firstName required**
      trim: true, // **Trim whitespace**
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"], // **Make lastName required**
      trim: true, // **Trim whitespace**
    },
    email: {
      type: String,
      required: [true, "Email is required"], // **Make email required**
      unique: true, // **Ensure email uniqueness**
      lowercase: true, // **Convert to lowercase**
      validate: {
        validator: function (v) {
          return /.+\@.+\..+/.test(v); // **Basic email format validation**
        },
        message: (props) => `${props.value} is not a valid email!`, // **Validation error message**
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"], // **Make password required**
      minlength: [6, "Password must be at least 6 characters"], // **Minimum length for password**
    },
    age: {
      type: Number,
      min: [0, "Age must be a positive number"], // **Minimum age validation**
      max: [120, "Age cannot exceed 120"], // **Maximum age validation**
    },
    userProfile: {
      type: String,
      default: "userProfile.png", // **Default profile image**
    },
    about: {
      type: String,
      default: "No about information provided", 
    },
    gender:{
      type: String,
      enum: ['male', 'female', 'other'], // **Gender validation**
        message: `"{VALUE}" is an incorrect status type`
    }
    

  },
  {
    timestamps: true, // **Automatically adds createdAt and updatedAt fields to the schema**
  }


);

userSchema.index({firstName:1, lastName:1});

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user.id }, "DEv@tinder", { expiresIn: '1h' }); // **JWT signing logic**
  return token; // **Return the generated token**
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password; 
  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
  return isPasswordValid; // Return the validation result
};

module.exports = mongoose.model("User", userSchema);