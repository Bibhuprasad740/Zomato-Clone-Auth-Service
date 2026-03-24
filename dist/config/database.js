"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        await mongoose_1.default.connect(mongoURI || '', {
            dbName: process.env.ENVIRONMENT || 'dev',
        });
        console.log('MongoDB connected');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
exports.default = connectDB;
