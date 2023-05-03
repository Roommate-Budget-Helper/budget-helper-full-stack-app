import { useState } from 'react';
import Button from "@components/button";
import FieldInput from "@components/fieldinput";
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "utils/trpc";
import { signIn } from 'next-auth/react';
import { useHomeContext } from "stores/HomeStore";

const RegisterPage: NextPage = () => {
    const [registered, setRegistered] = useState<boolean>(false);
    const [registeredUsername, setRegisteredUsername] = useState<string | null>(null);
    const [registeredPassword, setRegisteredPassword] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const clearSelectedHome = useHomeContext((s) => s.clearSelectedHome);
    const createUser = trpc.useMutation(["auth.createUser"], {
        onError: (error) => {
            setError(error.message);
            return;
        },
        onSuccess: (_, { username, password }) => {
            setRegistered(true);
            setRegisteredUsername(username);
            setRegisteredPassword(password);
            setError(null);
        },
    });
    const verifyEmail = trpc.useMutation(["auth.verifyEmailCode"], {
        onError: (error) => {
          setError(error.message);
        },
        onSuccess: () => {
          setError(null);
        }
    })

    const onRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const username = form.elements["username"].value;
        const email = form.elements["email"].value;
        const password = form.elements["password"].value;
        const confirmPassword = form.elements["confirmPassword"].value;

        if (password !== confirmPassword) {
            return;
        }

        createUser.mutate({
            email,
            username,
            password,
        });
    };

    const onVerify = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const verification = form.elements["verification-code"].value;

        if(!registeredUsername){
            return;
        }

        verifyEmail.mutate({
            code: verification,
            username: registeredUsername
        })

        if(error){
          return;
        }

        await signIn("credentials", {
            username: registeredUsername,
            password: registeredPassword,
            redirect: false
        });
        clearSelectedHome();
    };

    if(registered){
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
                        Account Created!
                    </h1>
                    <p className="text-xl py-4 font-light">
                        Enter the verification code that we sent to your email below
                    </p>
                    {error && (
                        <p className="text-xl font-light text-red-600">
                            Something went wrong! {error}
                        </p>
                    )}
                </div>
            <form method="post" onSubmit={onVerify} className='grid grid-rows-2 gap-4 place-content-center'>
                <FieldInput
                    type="text"
                    name="verification-code"
                    placeholder='verification code' />
                <Button 
                    type='submit'
                    value='Submit Code'
                    classNames={"bg-evergreen-80 text-dorian row-span-1"} />
            </form>
            </>);
    }

    return (
        <>
            <Head>
                <title>RBH Register</title>
                <meta
                    name="description"
                    content="Register for Roommate Budget Helper"
                />
            </Head>
            <div className="body flex flex-col text-center">
                <div className="headertext-center pt-4">
                    <h1 className="text-5xl font-bold text-evergreen-100">
                        Welcome 👋
                    </h1>
                    <p className="text-xl font-light">
                        Welcome to Roommate Budget Helper, your friendly
                        budgeting application
                    </p>
                    <p className="text-xl font-light">
                        Let&apos;s get a few details from you to create your
                        account!
                    </p>
                </div>
                {error && (
                    <p className="text-xl font-light text-red-600">
                        Something went wrong! {error}
                    </p>
                )}
                <form method="post" onSubmit={onRegister}>
                    <div className="form-area flex flex-col justify-between items-center ">
                        <FieldInput
                            type="text"
                            name="username"
                            placeholder="Username"
                        />
                        <FieldInput
                            type="text"
                            name="email"
                            placeholder="Email"
                        />
                        <FieldInput
                            type="password"
                            name="password"
                            placeholder="Password"
                        />
                        <FieldInput
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                        />
                        <Button
                            classNames="bg-evergreen-80 text-dorian"
                            value="Sign Up"
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </>
    );
};

export default RegisterPage;
