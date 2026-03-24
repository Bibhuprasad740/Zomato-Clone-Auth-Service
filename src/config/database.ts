import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: '.env' });

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        await mongoose.connect(mongoURI || '', {
            dbName: process.env.ENVIRONMENT || 'dev',
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;