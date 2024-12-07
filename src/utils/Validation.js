const validator = require('validator');

const validateSingUpData = (req) =>{

    const {firstName,lastName,email,password} = req.body;


    if(!firstName || !lastName){
        throw new Error ("Name is not validate");
    }

    else if (!validator.isEmail(email)){
        throw new Error ("Email  is not validate");
    }

    else if (!validator.isStrongPassword(password)){
        throw new Error ("Password is not strong");
    }

}

// const validateEditProfileData = (req) =>{
//     const allowedEditFields = [
//         "firstName", "lastName", "email", "photoUrl", "age", "about" , 
//     ]

//  const isEditAllowed =  Object.keys(req.body).every((field)=>
//     {
//         allowedEditFields.includes(field)
//     }
       
// )
// return isEditAllowed;
// };


// Validate edit profile data
// const  validateEditProfileData = (req) => {
//     const allowedEditFields = ["firstName", "lastName", "photoUrl", "age", "about"];
    
//     const isEditAllowed = Object.keys(req.body).every((field) => 
//       allowedEditFields.includes(field) // Check if all fields in the request body are allowed
//     );
    
//     return isEditAllowed; // Return whether the edit is valid
//   };

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "photoUrl", "age", "about"];

    // Find any disallowed fields
    const disallowedFields = Object.keys(req.body).filter(
        (field) => !allowedEditFields.includes(field)
    );

    return {
        isValid: disallowedFields.length === 0, // Edit is valid if no disallowed fields exist
        disallowedFields, // List of fields that are not allowed
    };
};

module.exports = {
    validateSingUpData, validateEditProfileData
}