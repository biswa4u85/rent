import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getToken = (request: NextRequest) => {
    try {
        const token = request.headers.get("Authorization") || '';
        const decodedToken: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
        return decodedToken;
    } catch (error: any) {
        return null
    }
}