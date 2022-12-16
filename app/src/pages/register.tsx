import Button from "@components/button";
import FieldInput from "@components/fieldinput";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { trpc } from "utils/trpc";

const LoginPage: NextPage = () => {
    const session = useSession();
    const [errorState, setError] = useState(false);
    const { data: list, refetch } = trpc.useQuery(["findAll"]);
    console.log(list);

    // const onSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     const form = event.target as HTMLFormElement;

    //     await register("credentials", {
    //         email: form.elements["email"].value,
    //         username: form.elements["username"].value,
    //         password: form.elements["password"].value,
    //         redirect: false,
    //     }).then((res) => {
    //         setError(!res?.ok);
    //     });
    // };

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
                <form method="post">
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
                            name="confirm password"
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

export default LoginPage;
