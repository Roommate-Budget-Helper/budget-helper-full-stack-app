import { createProtectedRouter } from "./context";
import { z } from "zod";
import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3"
import AWS from "aws-sdk";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../../env/server.mjs";
import { randomUUID } from "crypto";

// Set the AWS Region.
const REGION = "us-east-1";
// Create an Amazon S3 service client object.
export const s3Client = new S3Client({ region: REGION });


//Puts an object in the database with the given key
export const putImage = async (key: string, file: File) => {
    try {
        // Set parameters
        // Create a random name for the Amazon Simple Storage Service (Amazon S3) bucket and key
        console.error(file);
        const bucketParams: PutObjectCommandInput = {
            Bucket: env.S3_BUCKET_NAME,
            Key: key,
            Body: file
        };
        // Guard clause to ensure the key exists
        if(!bucketParams.Key){
            return ;
        }

        const upload = new AWS.S3.ManagedUpload({
            params: bucketParams,
        })
        // // Create and send a command to put the object in the S3 bucket.
        const data = await upload.promise();
        return data;
    } catch (err) {
        console.log("Error sending object to S3 Client", err);
    }
};

export const getSignedImage = async (Key: string) => {
    return await AWS.S3.getSignedUrlPromise('getObject', {
        bucket: env.S3_BUCKET_NAME,
        Key,
    });
}



export const fileUploadRouter = createProtectedRouter()
    
    .mutation("getPresignedURL", {
        input: z.string(),
        async resolve({ctx, input}) {
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