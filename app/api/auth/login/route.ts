import prisma from "@/libs/prisma";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/libs/utility";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const resource = "user";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, deviceId } = body;
        const user: any = await prisma[resource].findUnique({ where: { email } });
        if (!user) return errorResponse("Record Not Found", 400);

        // Update DeviceId
        await prisma[resource].update({ where: { email }, data: { deviceId } });

        //check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password)
        if (!validPassword) return errorResponse("Invalid password", 400);

        //create token data
        const tokenData = {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            image: user.image,
        }
        //create token
        const token = await jwt.sign(tokenData, process.env.NEXTAUTH_SECRET!, { expiresIn: "1d" })
        user['token'] = token
        return successResponse(user);
    } catch (error: any) {
        errorResponse(error.message);
    }
}