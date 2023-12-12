import { siteName } from './constants'
// all sms templates here
export const OTPTemplate = (otp: any, phone: any) => {
    return {
        phone: phone,
        message: `[${siteName}] Verification code:${otp}. Do not share this code with anyone.`
    }
}

// All email templates
const logo = `<img width="200px" src="https://rent-erptech.vercel.app/images/Logo.svg"><br>`;
export const emailSignature: any = (url: any) => `<br>Warm Regards,<br><b>Team- ${siteName}</b><br>Contact us - +91-00000 00000 <br>${url ? url : "URL: https://rent-erptech.vercel.app"}</body>`;

export const ForgotPasswordTemplate = (otp: any, email: any) => {
    return {
        body: `<body> ${logo}<br>Hi User,<br><br>There was a request to change your password!<br> 
        If you did not make this request then please ignore this email.<br><br>
        Your verification code is : <b>${otp}</b><br><br>
        Do not share this code with anyone.
  <br>
  ${emailSignature()}`,
        address: email,
        subject: `[${siteName}] Reset Password Request`,
    };
};