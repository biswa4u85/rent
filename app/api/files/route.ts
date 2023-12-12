import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import * as dateFn from "date-fns";
import { getToken } from "@/libs/getToken";
import { successResponse, errorResponse } from "@/libs/utility";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const file: any = formData.get("file") as Blob | null;
    if (!file) return errorResponse("File blob is required.", 400);

    const buffer = Buffer.from(await file.arrayBuffer());
    const relativeUploadDir = `/uploads/${dateFn.format(Date.now(), "dd-MM-Y")}`;
    const uploadDir = join(process.cwd(), "public", relativeUploadDir);

    try {
        await stat(uploadDir);
    } catch (e: any) {
        if (e.code === "ENOENT") {
            await mkdir(uploadDir, { recursive: true });
        } else {
            console.log(e)
            return errorResponse("Something went wrong.", 500);
        }
    }
    try {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${file.name.replace(
            /\.[^/.]+$/,
            ""
        )}-${uniqueSuffix}.${mime.getExtension(file.type)}`;
        await writeFile(`${uploadDir}/${filename}`, buffer);
        return successResponse({ fileUrl: `${relativeUploadDir}/${filename}` });
    } catch (e) {
        console.log(e)
        return errorResponse("Something went wrong.", 500);
    }
}