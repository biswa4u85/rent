import { NextRequest } from 'next/server'
import Stripe from 'stripe';
import { successResponse, errorResponse } from "@/libs/utility";

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
    apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
    try {
        const type = request.url.split("chats/")[1];
        const data = await request.json();
        const { itemId } = data;

        switch (type) {
            case 'inactive':
                console.log(itemId)
            // let accountLink = await stripe.accountLinks.create({
            //     account,
            //     refresh_url: "https://example.com/reauth",
            //     return_url: "https://example.com/return",
            //     type: "account_onboarding",
            // })
            // return successResponse({ message: `Update Stripe Account`, url: accountLink.url ?? "", success: true });

            default:
                return errorResponse("Something went wrong.");
        }
    } catch (error: any) {
        errorResponse(error);
    }
}