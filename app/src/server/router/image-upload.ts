import { createProtectedRouter } from "./context";
import { z } from "zod";
import { S3Client } from "@aws-sdk/client-s3"
import AWS from "aws-sdk";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { env } from "../../env/server.mjs";
import { randomUUID } from "crypto";

// Set the AWS Region.
const REGION = "us-east-1";
// Create an Amazon S3 service client object.
export const s3Client = new S3Client({ region: REGION });


export const getSignedImage = async (Key: string) => {
    return await new AWS.S3().getSignedUrlPromise('getObject', {
        Bucket: env.S3_BUCKET_NAME,
        Key,
    });
}



export const fileUploadRouter = createProtectedRouter()
    
    .mutation("getPresignedURL", {
        input: z.string(),
        async resolve({ input }) {
            return await createPresignedPost(s3Client, {
                Key: `${randomUUID()}-${input}`,
                Conditions: [
                    ["starts-with", "$Content-Type", "image/"],
                    ["content-length-range", 0, 1000000],
                ],
                Expires: 30,
                Bucket: env.S3_BUCKET_NAME
            })
        }
    });