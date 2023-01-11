import Button from "@components/button";
import FieldInput from "@components/fieldinput";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import Image from "next/image";
import { trpc } from "utils/trpc";
import Navbar from "@components/navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const HomesPage: NextPage = () => {

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
            if(!session?.user){
                return;
            }
            addUserToHome.mutate({
                homeId: home.id,
                userId: session.user.id
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

    let createAHome = false;

    function createAHomePressed() {
        createAHome = true;
    }
    
    if(createAHome) {
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
    }

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
                <div className="topnav">
                    <a className="center" href="/bill">
                        <Image
                            src="/images/bills.png"
                            alt="Home"
                            width="35px"
                            height="35px"
                        />
                    </a>
                    <a className="center" href="#">
                        <Image
                            src="/images/thing.png"
                            alt="Home"
                            width="35px"
                            height="35px"
                        />
                    </a>
                    <a className="active center" onClick={createAHomePressed}>
                        <Image
                            src="/images/add_home.png"
                            alt="Home"
                            width="60px"
                            height="60px"
                        />
                    </a>
                    <a className="center" href="/notification">
                        <Image
                            src="/images/notifications.png"
                            alt="Home"
                            width="35px"
                            height="35px"
                        />
                    </a>
                    <a className="center" href="/homes">
                        <Image
                            src="/images/user.png"
                            alt="Home"
                            width="35px"
                            height="35px"
                        />
                    </a>
                </div>
                <div id="core">
                    <div className="form-area flex flex-col justify-between items-center ">
                        <div id="top">
                            Welcome to Roomate Budget Helper <a>👋</a>
                        </div>
                        <div className="center">
                            <Image
                                src="/images/logo.png"
                                alt="Home"
                                width="100px"
                                height="100px"
                            />
                        </div>
                        <div>You do not currently belong to any homes...</div>
                        <br></br>
                        <div>
                            Feel free to create one using the plus button, or
                            contact your home creator to invite you!
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomesPage;
