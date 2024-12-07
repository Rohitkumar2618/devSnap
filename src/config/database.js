const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://rohitkumarme2618:P7tGknYjQYE0nDWv@namastenode.tbhzq.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
