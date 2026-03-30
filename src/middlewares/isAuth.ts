import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from "../models/User";
import TryCatch from "./trycatch";

export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export const isAuthenticated = TryCatch(async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const token = authHeader.split(' ')[1]!;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decodedToken.user._id);
    if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    req.user = user;
    next();
});

export default isAuthenticated;