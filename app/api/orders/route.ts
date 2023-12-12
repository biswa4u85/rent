import prisma from "@/libs/prisma";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/libs/utility";
import { getToken } from "@/libs/getToken";

const resource = "book";

export async function GET(request: NextRequest) {
    try {

        const session = await getToken(request);
        if (!session) return errorResponse("You are not Not Authorized", 401);

        const skip = Number(request.nextUrl.searchParams.get("skip")) || 0
        const take = Number(request.nextUrl.searchParams.get("take")) || 100

        const id: any = request.nextUrl.searchParams.get("id")
        const searchId: any = request.nextUrl.searchParams.get("ownId")

        let filter: any = {}
        if (id) {
            filter['id'] = id
        }
        if (searchId) {
            filter['OR'] = [{ landlordId: searchId }, { tenantId: searchId }]
        }

        const counts = await prisma[resource].count({ where: filter })
        const result = await prisma[resource].findMany({
            where: filter,
            skip,
            take,
            include: { item: true }
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
        const res = await prisma[resource].create({ data: { ...data, price: Number(data.price ?? 0), deposit: Number(data.deposit ?? 0) } });
        return successResponse(res);
    } catch (error: any) {
        errorResponse(error);
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