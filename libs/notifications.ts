import * as AWS from "aws-sdk";
import { awsKey, awsSecret, awsRegine, s3SendersEmail, arnName } from '@/libs/constants'
import { errorResponse } from "@/libs/utility";

export const SendSMS = async (data: any) => {
    try {
        const AWS_SNS = {
            accessKeyId: awsKey,
            secretAccessKey: awsSecret,
            region: awsRegine,
        };
        AWS.config.update(AWS_SNS);
        const sns = new AWS.SNS({ apiVersion: "2010–03–31" });
        const params = {
            Message: data.message,
            PhoneNumber: data.phone,
        };
        await sns.publish(params).promise();
    } catch (err) {
        return errorResponse(err);
    }
}

export const SendEmail = async (data: any) => {
    console.log(data)
    const AWS_SES = {
        accessKeyId: awsKey,
        secretAccessKey: awsSecret,
        region: awsRegine,
    };
    AWS.config.update(AWS_SES);
    try {
        const ses = new AWS.SES();
        const params = {
            Destination: {
                ToAddresses: data.address,
                CcAddresses: data?.ccaddress,
            },
            Message: {
                Body: {
                    Html: {
                        // HTML Format of the email
                        Charset: "UTF-8",
                        Data: data.body,
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: data.body,
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: data.subject,
                },
            },
            Source: s3SendersEmail,
        };
        await ses.sendEmail(params).promise();
    } catch (err) {
        return errorResponse(err);
    }
}

export const PushNotification = async (data: any) => {
    try {
        const AWS_SNS = {
            accessKeyId: awsKey,
            secretAccessKey: awsSecret,
            region: awsRegine,
        };
        AWS.config.update(AWS_SNS);
        const sns = new AWS.SNS({ apiVersion: "2010–03–31" });
        const platform = await sns
            .createPlatformEndpoint({
                PlatformApplicationArn: arnName,
                Token: data.token,
            })
            .promise();

        const params = {
            MessageStructure: "json",
            Message: JSON.stringify(data.message),
            TargetArn: platform.EndpointArn,
        };

        await sns.publish(params).promise();
    } catch (err) {
        return errorResponse(err);
    }
}