const mongoose = require("mongoose");


const MONGO_URI=process.env.MONGO_URI
const connect = () => {
  // Connecting to the database
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error:Error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};

export default connect