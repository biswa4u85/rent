import prisma from "@/libs/prisma";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/libs/utility";
import { getToken } from "@/libs/getToken";
import bcryptjs from "bcryptjs";

const resource = "user";
const subResource = "otp";

export async function GET(request: NextRequest) {
    try {

        const session = await getToken(request);
        if (!session) return errorResponse("You are not Not Authorized", 401);

        // Get Params
        const skip = Number(request.nextUrl.searchParams.get("skip")) || 0
        const take = Number(request.nextUrl.searchParams.get("take")) || 100

        const id: any = request.nextUrl.searchParams.get("id")
        const role = request.nextUrl.searchParams.get("role")

        let filter: any = {}
        if (id) {
            filter['id'] = id
        }
        if (role) {
            filter['role'] = role
        }

        const counts = await prisma[resource].count({ where: filter })
        const result = await prisma[resource].findMany({
            where: filter,
            skip,
            take,
        });
        if (!result) return errorResponse("Record Not Found");
        return successResponse(result, counts);
    } catch (error: any) {
        console.log(error)
        errorResponse(error.message);
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getToken(request);
        if (!session) return errorResponse("You are not Not Authorized", 401);

        const data = await request.json();

        // Hash password
        if (data.password) {
            const salt = await bcryptjs.genSalt(10)
            data.password = await bcryptjs.hash(data.password, salt)
        }
        const res = await prisma[resource].create({ data });
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
        let id = JSON.parse(JSON.stringify(data.id))
        delete data.id
        delete data.edit

        // Hash password
        if (data.password) {
            const salt = await bcryptjs.genSalt(10)
            data.password = await bcryptjs.hash(data.password, salt)
        }

        const res = await prisma[resource].update({
            where: { id },
            data
        });
        return successResponse(res);
    } catch (error: any) {
        errorResponse(error);
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getToken(request);
        if (!session) return errorResponse("You are not Not Authorized", 401);

        const id: any = request.nextUrl.searchParams.get("id")
        if (!id) return errorResponse("Record Not Found");

        const res = await prisma[resource].delete({ where: { id } });
        return successResponse(res);
    } catch (error: any) {
        errorResponse(error);
    }
}