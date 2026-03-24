import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, async () => {
    await connectDB().then(() => {
        console.log(`Auth service is running on port ${PORT}`);
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    });
});