import { NextResponse } from "next/server";

// Utility function to format success response
export const successResponse = (data: any, count: any = null) => NextResponse.json({ success: true, data, count });

// Utility function to format error response
export const errorResponse = (error: any, status: any = 400) => {
    console.log(error)
    return NextResponse.json({ success: false, message: error }, { status });
}