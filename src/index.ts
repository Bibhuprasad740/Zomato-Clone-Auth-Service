import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.use(express.json());

import authRouter from './routes/auth';

app.use('/api/auth', authRouter);

app.listen(PORT, async () => {
    await connectDB().then(() => {
        console.log(`Auth service is running at http://localhost:${PORT}/api/auth`);
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    });
});