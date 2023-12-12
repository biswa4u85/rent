import prisma from "@/libs/prisma";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/libs/utility";
import { getToken } from "@/libs/getToken";

const resource = "item";

export async function POST(request: NextRequest) {
    try {
        const session = await getToken(request);

        const data = await request.json();
        const { title, location } = data

        const skip = Number(data.skip) || 0
        const take = Number(data.take) || 100

        let filter: any = { status: "active" }
        if (title) {
            filter['title'] = { contains: title }
        }
        if (session) {
            filter['masterID'] = { not: session.id }
        }

        const counts = await prisma[resource].count({ where: filter })
        const results: any = await prisma[resource].aggregateRaw({
            pipeline: [
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: location.coordinates,
                        },
                        distanceField: "distance",
                        // query: filter,
                        maxDistance: location.radius ? Number(location.radius) * 1609.34 : 10 * 1609.34,
                        spherical: true
                    },
                },
                { $skip: skip },
                { $limit: take },
            ]
        });
        if (!results) return errorResponse("Record Not Found");
        let newResults = results.map((item: any) => {
            return { ...item, id: item['_id']['$oid'] }
        })
        return successResponse(newResults, counts);
    } catch (error: any) {
        errorResponse(error);
    }
}