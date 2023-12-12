import prisma from "@/libs/prisma";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/libs/utility";
import bcryptjs from "bcryptjs";
import Stripe from 'stripe';

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
    apiVersion: '2023-10-16',
});
const resource = "user";

export async function POST(request: NextRequest) {
    try {

        const data = await request.json();
        delete data.mPassword

        // Check User if Exit
        const { email, fullName } = data;
        const user: any = await prisma[resource].findUnique({ where: { email } });
        if (user) return errorResponse("User already exist with given email");

        // Hash password
        if (data.password) {
            const salt = await bcryptjs.genSalt(10)
            data.password = await bcryptjs.hash(data.password, salt)
        }

        // Strip Connected
        let account = await stripe.accounts.create({
            email,
            type: "express",
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            business_type: 'individual'
        })
        data.connectedId = account?.id

        // Strip Customer
        let customer = await stripe.customers.create({
            email,
            name: fullName,
            source: 'tok_visa',
        })
        data.stripeId = customer?.id

        const res = await prisma[resource].create({ data: { ...data, distance: Number(data.distance) } });
        return successResponse({ message: "User Registered Successfully", success: true });
    } catch (error: any) {
        errorResponse(error);
    }
}