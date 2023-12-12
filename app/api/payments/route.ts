import prisma from "@/libs/prisma";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/libs/utility";
import { getToken } from "@/libs/getToken";

const resource = "payment";
const subRes = "user";

export async function GET(request: NextRequest) {
    try {

        const session = await getToken(request);
        if (!session) return errorResponse("You are not Not Authorized", 401);

        const skip = Number(request.nextUrl.searchParams.get("skip")) || 0
        const take = Number(request.nextUrl.searchParams.get("take")) || 100

        const counts = await prisma[resource].count()
        const result = await prisma[resource].findMany({
            skip,
            take,
            include: { user: true }
        });
        if (!result) return errorResponse("Record Not Found");
        return successResponse(result, counts);
    } catch (error: any) {
        errorResponse(error.message);
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getToken(request);
        if (!session) return errorResponse("You are not Not Authorized", 401);

        const data = await request.json();
        const { userId, type, amount, refId } = data
        const res = await prisma[resource].create({ data: { userId: userId, type, amount: parseInt(amount), refId } });

        // Update wallet
        const user: any = await prisma[subRes].findUnique({ where: { id: userId } });
        let wallet = Number(user.wallet)
        let updAmount = wallet + Number(amount)
        await prisma[subRes].update({ where: { id: userId }, data: { wallet: updAmount } });

        return successResponse(res);
    } catch (error: any) {
        errorResponse(error);
    }
}