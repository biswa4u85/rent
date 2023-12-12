import prisma from "@/libs/prisma";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/libs/utility";
import { getToken } from "@/libs/getToken";

const resource = "setting";

export async function GET(request: NextRequest) {
    try {
        const result = await prisma[resource].findMany();
        if (!result) return errorResponse("Record Not Found");
        if (result.length > 0) return successResponse(result[0]);
        const res = await prisma[resource].create({ data: { siteName: "" } });
        return successResponse(res);
    } catch (error: any) {
        errorResponse(error.message);
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getToken(request);
        if (!session) return errorResponse("You are not Not Authorized", 401);

        const data = await request.json();
        const id = JSON.parse(JSON.stringify(data.id))
        delete data.id
        delete data.edit

        const res = await prisma[resource].update({
            where: { id },
            data
        });
        return successResponse(res);
    } catch (error: any) {
        errorResponse(error);
    }
}