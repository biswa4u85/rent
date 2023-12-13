import prisma from "@/libs/prisma";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/libs/utility";
import { getToken } from "@/libs/getToken";

const resource = "chat";

export async function GET(request: NextRequest) {
    try {

        const session = await getToken(request);
        if (!session) return errorResponse("You are not Not Authorized", 401);

        const skip = Number(request.nextUrl.searchParams.get("skip")) || 0
        const take = Number(request.nextUrl.searchParams.get("take")) || 100
        const id: any = request.nextUrl.searchParams.get("id")
        const itemId: any = request.nextUrl.searchParams.get("itemId")
        const from: any = request.nextUrl.searchParams.get("fromId")

        let filter: any = { status: "active" }
        if (id) {
            filter['id'] = id
        }
        if (itemId) {
            filter['itemId'] = itemId
        }

        if (from) {
            filter["OR"] = [
                { from: session?.id },
                { to: session?.id },
            ];
        } else {
            filter["to"] = session?.id
        }

        const counts = await prisma[resource].count({ where: filter })
        const result = await prisma[resource].findMany({
            where: filter,
            skip,
            take,
            include: {
                user: { select: { id: true, firstName: true, image: true } },
                item: { select: { id: true, title: true, perTime: true, price: true, gallery: true, user: { select: { id: true } } } }
            }
        });
        if (!result) return errorResponse("Record Not Found");
        return successResponse(result, counts);
    } catch (error: any) {
        errorResponse(error.message);
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getToken(request);
        if (!session) return errorResponse("You are not Not Authorized", 401);

        const data = await request.json();
        const type = JSON.parse(JSON.stringify(data.type))
        const { itemId } = data

        if (type == "inactive" && itemId) {
            const res = await prisma[resource].updateMany({
                where: { itemId, status: "active" },
                data: { status: "inactive" }
            });
            return successResponse(res);
        }
        if (type == "read" && itemId) {
            const records = await prisma[resource].findMany({
                where: {
                    itemId, status: "active", OR: [
                        { from: session?.id },
                        { to: session?.id },
                    ],
                }
            });
            const res = await Promise.all(
                records.map(async (record: any) => {
                    const updatedArray: any[] = [...record.readBy, session?.id];
                    const uniqueArray = updatedArray.filter(
                        (obj, index, self) => index === self.findIndex((o) => o == obj)
                    );
                    return prisma[resource].update({
                        where: { id: record.id },
                        data: { readBy: uniqueArray },
                    });
                })
            );
            return successResponse(res);
        }

        return errorResponse("Something went wrong.");

    } catch (error: any) {
        errorResponse(error);
    }
}