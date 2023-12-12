import prisma from "@/libs/prisma";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/libs/utility";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { ForgotPasswordTemplate } from "@/libs/templates";
import { SendEmail } from "@/libs/notifications";

const resource = "user";
const subResource = "otp";

export async function POST(request: NextRequest) {
    try {
        const type = request.url.split("password/")[1];
        const data = await request.json();
        const { email, otp, password } = data;

        // Make Otp
        let newOtp = getOtp()

        switch (type) {
            case 'forget':

                // Check User if Exit
                const ifUser: any = await prisma[resource].findMany({ where: { email } });
                if (ifUser && ifUser.length == 0) return errorResponse("User Not Exit !!");
                const ifOtp: any = await prisma[subResource].findUnique({ where: {phoneEmail: email } });
                if (ifOtp) return errorResponse("OTP already sent, please try after 1 minute");

                const res = await prisma[subResource].create({ data: { otp:newOtp, phoneEmail:email } });
                data.sms = ForgotPasswordTemplate(newOtp, email);
                SendEmail(data.sms)
                return successResponse({ message: `OTP sent successfully ${newOtp}`, success: true });
           
            case 'reset':

                // Check User if Exit
                const ifExist: any = await prisma[subResource].findUnique({ where: { phoneEmail:email } });
                if (!ifExist) return errorResponse("Seems Otp expired !!");
                if (ifExist.otp != otp) return errorResponse("Invalid OTP");

                // Hash password
                if (password) {
                    const salt = await bcryptjs.genSalt(10)
                    const newPassword = await bcryptjs.hash(password, salt)
                    await prisma[resource].update({ where: { email }, data: { password:newPassword } });
                    return successResponse({ message: `Password change successfully`, success: true });
                }
                return errorResponse("Invalid Password");
                

            case 'validate':
                // Check User if Exit
                const ifExistUser: any = await prisma[subResource].findUnique({ where: { phoneEmail:email } });
                if (!ifExistUser) return errorResponse("Seems Otp expired !!");
                if (ifExistUser.otp != otp) return errorResponse("Invalid OTP");

                // Login User
                const users: any = await prisma[resource].findMany({ where: { email } });
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