import { NextRequest } from 'next/server'
import Stripe from 'stripe';
import { successResponse, errorResponse } from "@/libs/utility";

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
    apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
    try {
        const type = request.url.split("stripe/")[1];
        const data = await request.json();
        const { account, orderId, amount, currency, types, payment_intent } = data;

        switch (type) {
            case 'create':
                let accountLink = await stripe.accountLinks.create({
                    account,
                    refresh_url: "https://example.com/reauth",
                    return_url: "https://example.com/return",
                    type: "account_onboarding",
                })
                return successResponse({ message: `Update Stripe Account`, url: accountLink.url ?? "", success: true });

            case 'payment':
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: Number(amount) * 100,
                    currency: currency,
                    payment_method_types: [`${types}`],
                });
                return successResponse({ message: `Create Payment Instance`, clientSecret: paymentIntent.client_secret ?? "", success: true });

            case 'refund':
                const refund = await stripe.refunds.create({
                    payment_intent: payment_intent,
                    amount: Number(amount),
                });
                return successResponse({ message: `Cancel Successfully with Refund`, data: refund, success: true });

            default:
                return errorResponse("Something went wrong.");
        }
    } catch (error: any) {
        errorResponse(error);
    }
}