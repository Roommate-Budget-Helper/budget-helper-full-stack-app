import type { NextPage } from "next";
import React, { useState } from "react";
import FieldInput from "@components/fieldinput";
import Button from "@components/button";
import Head from "next/head";
import { trpc } from "utils/trpc";
import { signIn } from 'next-auth/react';

const ForgotPasswordPage: NextPage = () => {
    const [validatedUsername, setValidatedUsername] = useState<string>("");
    const [emailSent, setEmailSent] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const sendForgotPasswordCode = trpc.useMutation(
        ["auth.sendForgotPasswordVerificationCode"],
        {
            onError: (error) => {
                setError(error.message);
            },
            onSuccess: (_, { username }) => {
                setValidatedUsername(username);
                setEmailSent(true);
                setError(null);
            },
        }
    );

    const verifyEmail = trpc.useMutation(["auth.verifyForgotPassword"], {
        onError: (error) => {
            setError(error.message);
        },
        onSuccess: () => {
            setError(null);
        }
    });

    const onUsername = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const username = form.elements["username"].value;
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

        verifyEmail.mutate({
            username: validatedUsername,
            password: password,
            code: verification,
        });

        if(error){
            return;
        }

        await signIn("credentials", {
            username: validatedUsername,
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
                    {error && (
                        <p className="text-xl font-light text-red-600">
                            Something went wrong! {error}
                        </p>
                    )}
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
                    {error && (
                        <p className="text-xl font-light text-red-600">
                            Something went wrong! {error}
                        </p>
                    )}
                </div>
            </div>

            <div className="form-area flex flex-col justify-between items-center ">
                <form method="post" onSubmit={onUsername}>
                <FieldInput
                    type="text"
                    name="username"
                    placeholder="Username"
                />
                <div className="py-3"></div>
                <Button
                  classNames="bg-evergreen-80 text-dorian"
                  value="Reset Password"
                  type="submit"
                />
                </form>
            </div>
        </>
    );
};

export default ForgotPasswordPage;
