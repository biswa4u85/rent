import prisma from "@/libs/prisma";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/libs/utility";
import jwt from "jsonwebtoken";
import { OTPTemplate } from "@/libs/templates";
import { SendSMS } from "@/libs/notifications";

const resource = "user";
const subResource = "otp";

export async function POST(request: NextRequest) {
    try {
        const type = request.url.split("otp/")[1];
        const data = await request.json();
        const { phone, otp } = data;

         // Make Otp
         let newOtp = getOtp()

        switch (type) {
            case 'send':

                // Check User if Exit
                const ifOtp: any = await prisma[subResource].findUnique({ where: { phoneEmail:phone } });
                if (ifOtp) return errorResponse("OTP already sent, please try after 1 minute");

                const res = await prisma[subResource].create({ data:{otp:newOtp, phoneEmail:phone} });
                data.sms = OTPTemplate(newOtp, phone);
                SendSMS(data.sms)
                return successResponse({ message: `OTP sent successfully ${newOtp}`, success: true });

            case 'resend':
                // Check User if Exit
                const otpExist: any = await prisma[subResource].findUnique({ where: {  phoneEmail:phone } });
                if (!otpExist) return errorResponse("No Otp sent, Please use send otp!!");
                if (otpExist && otpExist.resendCount >= 3) return errorResponse("Otp resend limit reached !! Please retry after sometime or contact support !!");

                const resOtp = await prisma[subResource].update({ where: {  phoneEmail:phone }, data: { otp:newOtp,  phoneEmail:phone, resendCount: { increment: 1 } } });
                data.sms = OTPTemplate(newOtp, phone);
                SendSMS(data.sms)
                return successResponse({ message: `OTP sent successfully ${newOtp}`, success: true });

            case 'validate':
                // Check User if Exit
                const ifExist: any = await prisma[subResource].findUnique({ where: {  phoneEmail:phone } });
                if (!ifExist) return errorResponse("Seems Otp expired !!");
                if (ifExist.otp != otp) return errorResponse("Invalid OTP");

                // Login User
                const users: any = await prisma[resource].findMany({ where: { phone } });
                if (users && users.length == 0) return errorResponse("User Not Exit !!");
                let user = users[0]

                //create token data
                const tokenData = {
                    id: user.id,
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                }
                //create token
                const token = await jwt.sign(tokenData, process.env.NEXTAUTH_SECRET!, { expiresIn: "1d" })
                user['token'] = token
                return successResponse(user);

            default:
                return errorResponse("Something went wrong.");
        }
    } catch (error: any) {
        errorResponse(error);
    }
}

// util to generate otp
let getOtp = () => {
    return (
        Math.floor(Math.random() * (9 * Math.pow(10, 4 - 1))) + Math.pow(10, 4 - 1)
    );
};