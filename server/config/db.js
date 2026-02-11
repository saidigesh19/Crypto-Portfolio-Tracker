import mongoose from "mongoose";

// Connects to MongoDB using the URI from environment variables
const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log("MongoDB Connection Succesfull"))
    .catch(err => console.log(err));
};

export default connectDB;