import type { NextPage } from "next";
import React, { useState } from "react";
import FieldInput from "@components/fieldinput";
import Button from "@components/button";
import Head from "next/head";
import { trpc } from "utils/trpc";
import { signIn } from 'next-auth/react';

const ForgotPasswordPage: NextPage = () => {
    const [username, setUsername] = useState<string>("");
    const [validatedUsername, setValidatedUsername] = useState<string>("");
    const [emailSent, setEmailSent] = useState<boolean>(false);

    const sendForgotPasswordCode = trpc.useMutation(
        ["auth.sendForgotPasswordVerificationCode"],
        {
            // onError: (error) => {
            //     // TODO: Add error handling for when the code wasn't sent
            //     console.error(error);
            // },
            onSuccess: (_, { username }) => {
                setValidatedUsername(username);
                setEmailSent(true);
            },
        }
    );

    const verifyEmail = trpc.useMutation(["auth.verifyForgotPassword"], {
        // onError: (error) => {
        //     console.error(error);
        // },
        // onSuccess: () => {
        //     console.log("Success: User verified and password reset!");
        // },
    });

    const onFormFill = () => {
        // TODO: Add error handling for when the username is not found
        sendForgotPasswordCode.mutate({
            username: username,
        });
    };

    const onVerify = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const verification = form.elements["verification-code"].value;
        const password = form.elements["new-password"].value;

        // Email hasn't been sent, do not allow to reset password yet
        if (!emailSent) {
            return;
        }

        // TODO: Add error handling for when the verification code is incorrect
        verifyEmail.mutate({
            username: validatedUsername,
            password: password,
            code: verification,
        });

        await signIn("credentials", {
            username: username,
            password: password,
            redirect: false
        })
    };

    if (emailSent) {
        return (
            <>
                <Head>
                    <title>RBH Verify Email</title>
                    <meta
                        name="description"
                        content="Email verification for Roommate Budget Helper"
                    />
                </Head>
                <div className="body flex flex-col text-center">
                    <h1 className="text-5xl font-bold text-evergreen-100">
                        Forgot Password?
                    </h1>
                    <p className="text-xl py-4 font-light">
                        Enter in your verification code and new password below
                    </p>
                </div>
                <form method="post" onSubmit={onVerify}>
                    <div className="form-area flex flex-col justify-between items-center ">
                        <FieldInput
                            type="text"
                            name="verification-code"
                            placeholder="verification code"
                        />
                        <FieldInput
                            type="password"
                            name="new-password"
                            placeholder="new password"
                        />
                        <Button
                            classNames="bg-evergreen-80 text-dorian"
                            value="Reset Password"
                            type="submit"
                        />
                    </div>
                </form>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>RBH Forgot Password</title>
                <meta
                    name="description"
                    content="Forgot Password page of Roommate Budget Helper"
                />
            </Head>
            <div className="body flex flex-col text-center">
                <div className="headertext-center pt-4">
                    <h1 className="text-5xl font-bold text-evergreen-100">
                        Forgot Password?
                    </h1>
                    <p className="text-xl py-4 font-light">
                        Forgot your password? No worries, we can help you out!
                    </p>
                </div>
            </div>

            <div className="form-area flex flex-col justify-between items-center ">
                <FieldInput
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.currentTarget.value)}
                    placeholder="Username"
                />
                <div className="py-5"></div>
                <Button
                    classNames="bg-evergreen-80 text-dorian"
                    value="Send Email Notification"
                    type="button"
                    onClick={onFormFill}
                />
            </div>
        </>
    );
};

export default ForgotPasswordPage;
