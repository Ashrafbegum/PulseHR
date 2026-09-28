import mongoose from "mongoose";

const connectDB = async () => {
    try{
        const dbUrl = process.env.MONGODB_URI;
        await mongoose.connect(dbUrl);
        console.log("DB Connected Successfully");
    }
    catch (error) {
        console.log(error);
    }
};

export default connectDB;