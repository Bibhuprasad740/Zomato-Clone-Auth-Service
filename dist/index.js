"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.listen(PORT, async () => {
    await (0, database_1.default)().then(() => {
        console.log(`Auth service is running on port ${PORT}`);
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    });
});
