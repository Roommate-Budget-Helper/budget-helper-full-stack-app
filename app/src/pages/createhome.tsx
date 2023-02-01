import Button from "@components/button";
import FieldInput from "@components/fieldinput";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { trpc } from "utils/trpc";
import { useState } from 'react';
import { useRouter } from 'next/router';

const CreationPage: NextPage = () => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const addUserToHome = trpc.useMutation(["occupies.addUserToHome"], {
        onError: (error) => {
            setError(error.message);
        },
    });

    const createHome = trpc.useMutation(["home.createHome"], {
        onError: (error) => {
            setError(error.message);
        },
        onSuccess: async (home) => {
            // Add userid and homeid to the occupies table
            await addUserToHome.mutateAsync({
                homeId: home.id,
            });
            router.push("/homes");
        },
    });   

    const onCreateHome = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        await createHome.mutateAsync({
            image: form.elements["image"].value,
            name: form.elements["name"].value,
            address: form.elements["address"].value,
        });
    };

    return (
        <>
            <Head>
                <title>RBH Homes Page</title>
                <meta
                    name="description"
                    content="Homes page of Roommate budget helper"
                />
            </Head>
            <div className="body flex flex-col text-center">
                <div className="text-2xl p-5">
                    <div className="form-area flex flex-col justify-between items-center ">
                        <div>Create Home</div>
                        <br></br>
                        <form method="post" onSubmit={onCreateHome}>
                            {/* TODO: Give it a cute image uploader */}
                            <FieldInput
                                type="text"
                                name="image"
                                placeholder="Image"
                            ></FieldInput>
                            <br></br>
                            <FieldInput
                                type="text"
                                name="name"
                                placeholder="Home Name"
                            />
                            <br></br>
                            <FieldInput
                                type="text"
                                name="address"
                                placeholder="Address"
                            />
                            <br></br>
                            <Button
                                classNames="bg-evergreen-80 text-dorian"
                                value="Create"
                                type="submit"
                            />
                            <br></br>
                        </form>
                    </div>
                </div>
                {error&&<p className="text-xl font-light text-red-600">{error}</p>}
            </div>
        </>
    );
};

export default CreationPage;