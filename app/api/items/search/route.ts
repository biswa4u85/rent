import prisma from "@/libs/prisma";
import { MongoClient } from 'mongodb';
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/libs/utility";
import { getToken } from "@/libs/getToken";

const client = new MongoClient(`${process.env.DATABASE_URL}`, {});
const resource = "Item";
const subResource = "item";

export async function POST(request: NextRequest) {
    try {
        const session = await getToken(request);

        await client.connect();
        const collection = client.db().collection(resource);

        const data = await request.json();
        const { title, location } = data

        const skip = Number(data.skip) || 0
        const take = Number(data.take) || 100

        const filter: any = { status: "active" };

        if (title) {
            filter['title'] = { $regex: title, $options: "i" };
        }

        if (session) {
            filter["masterID"] = { $ne: session.id };
        }

        let query = [
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: location.coordinates,
                    },
                    distanceField: "distance",
                    query: filter,
                    maxDistance: location.radius ? Number(location.radius) * 1609.34 : 10 * 1609.34,
                    spherical: true
                },
            },
            { $skip: skip },
            { $limit: take },
        ];

        const counts = await collection.countDocuments(filter);
        const items = await collection.aggregate(query).toArray();
        let results: any = []
        await items.map(async (item: any) => {
            const id = (item._id).toString()
            results.push(id)
        })
        const result = await prisma[subResource].findMany({
            where: { id: { in: results } },
            skip,
            take,
            include: { user: { select: { id: true, firstName: true, image: true } }, ratings: true }
        });
        if (!result) return errorResponse("Record Not Found");
        return successResponse(result, counts);
    } catch (error: any) {
        errorResponse(error);
    }
    finally {
        // await client.close();
    }
}