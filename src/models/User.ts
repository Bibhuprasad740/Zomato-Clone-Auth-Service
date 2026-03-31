import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    image: string;
    role: Role;
    comparePassword(password: string): Promise<boolean>;
}

export interface Role extends Document {
    name: string;
    role: 'customer' | 'admin' | 'rider' | 'seller' | null;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin', 'rider', 'seller'], default: null },
}, {
    timestamps: true,
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);