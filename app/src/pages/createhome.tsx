import Button from "@components/button";
import FieldInput from "@components/fieldinput";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import Image from "next/image";
import { trpc } from "utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { authOptions } from "./api/auth/[...nextauth]";

const CreationPage: NextPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    if (status == "unauthenticated") {
        router.push("/login");
        return <div></div>;
    }
    const createHome = trpc.useMutation(["home.createHome"], {
        onError: (error) => {
            console.error(error);
        },
        onSuccess: (home) => {
            console.log("Home %s created successfully", home.name);
            // Add userid and homeid to the occupies table
            authOptions.callbacks?.session
            addUserToHome.mutate({
                homeId: home.id,
                userId: session?.user?.id as string,
            });
        },
    });
    const addUserToHome = trpc.useMutation(["occupies.addUserToHome"], {
        onError: (error) => {
            console.error(error);
        },
        onSuccess: (_, { userId, homeId }) => {
            console.log(
                "User %s add to Home %s created successfully",
                userId,
                homeId
            );
        },
    });

    const onCreateHome = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        createHome.mutate({
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
                <div id="core">
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
                            {/* <FieldInput
                                type="text"
                                name=""
                                placeholder=""
                            /> */}
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
            </div>
        </>
    );
};

export default CreationPage;
