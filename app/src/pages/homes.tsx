import Button from "@components/button";
import FieldInput from "@components/fieldinput";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import Image from "next/image";
import { trpc } from "utils/trpc";
import Navbar from "@components/navbar";
import { useState } from 'react';

const HomesPage: NextPage = () => {
    const [homeCreated, setHomeCreated] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createHome = trpc.useMutation(["home.createHome"], {
        onError: (error) => {
            console.error(error);
            setError(error.message);
        },
        onSuccess: (home) => {
            console.log("Home %s created successfully", home.name);
            // Add userid and homeid to the occupies table
            addUserToHome.mutate({
                homeId: home.id,
            });
        },
    });

    const addUserToHome = trpc.useMutation(["occupies.addUserToHome"], {
        onError: (error) => {
            console.error(error);
            setError(error.message);
        },
        onSuccess: (_, { homeId }) => {
            console.log(
                "Home %s created successfully",
                homeId
            );
        },
    });

    const homeIds = trpc.useQuery(["occupies.getUserHomeIds"], {
        onError: (error) => {
            console.error(error);
            setError(error.message);
        },
    });

    if(homeIds?.data){
        console.log(homeIds.data);
        const listHome = homeIds.data;
        // trpc.useQuery(["home.getHomes", {ids: {listHome: string[]}}], {
        //     onError: (error) => {
        //         console.error(error);
        //     },
        //     onSuccess(data) {
        //         console.log(data);
        //     },
        // });
    }

    const onCreateHome = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        await createHome.mutateAsync({
            image: form.elements["image"].value,
            name: form.elements["name"].value,
            address: form.elements["address"].value,
        });
        setHomeCreated(false);
        homeIds.refetch();
    };

    function createAHomePressed() {
        setHomeCreated(true);
    }

    if(homeCreated) {
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
                    {error&&<p className="text-xl font-light text-red-600">{error}</p>}
                </div>
            </>
        );
    }

    if(homeIds.data && homeIds.data.length >= 1) {
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
                    <div className="overflow-hidden rounded-b-lg p-4 sm:bottom-0 sm:w-full sm:fixed ">
                        <a className="w-1/5 m-auto h-full float-left bg-gray-700 text-white text-center p-3 no-underline text-lg hover:bg-gray-100 hover:text-black" href="/bill">
                            <Image
                                src="/images/bills.png"
                                alt="Home"
                                width="35px"
                                height="35px"
                            />
                        </a>
                        <a className="w-1/5 m-auto h-full float-left bg-gray-700 text-white text-center p-3 no-underline text-lg hover:bg-gray-100 hover:text-black" href="#">
                            <Image
                                src="/images/thing.png"
                                alt="Home"
                                width="35px"
                                height="35px"
                            />
                        </a>
                        <a className="text-white bg-green-400 w-1/5 m-auto h-full float-left text-center p-3 no-underline text-lg hover:bg-gray-100 hover:text-black" onClick={createAHomePressed}>
                            <Image
                                src="/images/add_home.png"
                                alt="Home"
                                width="60px"
                                height="60px"
                            />
                        </a>
                        <a className="w-1/5 m-auto h-full float-left bg-gray-700 text-white text-center p-3 no-underline text-lg hover:bg-gray-100 hover:text-black" href="/notification">
                            <Image
                                src="/images/notifications.png"
                                alt="Home"
                                width="35px"
                                height="35px"
                            />
                        </a>
                        <a className="w-1/5 m-auto h-full float-left bg-gray-700 text-white text-center p-3 no-underline text-lg hover:bg-gray-100 hover:text-black" href="/homes">
                            <Image
                                src="/images/user.png"
                                alt="Home"
                                width="35px"
                                height="35px"
                            />
                        </a>
                    </div>
                    <div className="text-xl p-5">
                        <div className="form-area flex flex-col justify-between items-center">
                            <div className="p-5">
                                Welcome to Roomate Budget Helper <a className="text-5xl">👋</a>
                            </div>
                            <div className="w-1/5 m-auto h-full p-3">
                                <Image
                                    src="/images/logo.png"
                                    alt="Home"
                                    width="100px"
                                    height="100px"
                                />
                            </div>
                            <div>You belong to {homeIds.data.length} homes</div>
                            <br></br>
                            
                            <div id="homeDisplay"></div>
                            <div>
                                Feel free to create more homes using the plus button, or
                                contact your home creator to invite you!
                            </div>
                            {error&&<p className="text-xl font-light text-red-600">{error}</p>}
                        </div>
                    </div>
                </div>
            </>
        );
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
                <div className="overflow-hidden rounded-b-lg p-4 sm:bottom-0 sm:w-full sm:fixed ">
                    <a className="w-1/5 m-auto h-full float-left bg-gray-700 text-white text-center p-3 no-underline text-lg hover:bg-gray-100 hover:text-black" href="/bill">
                        <Image
                            src="/images/bills.png"
                            alt="Home"
                            width="35px"
                            height="35px"
                        />
                    </a>
                    <a className="w-1/5 m-auto h-full float-left bg-gray-700 text-white text-center p-3 no-underline text-lg hover:bg-gray-100 hover:text-black" href="#">
                        <Image
                            src="/images/thing.png"
                            alt="Home"
                            width="35px"
                            height="35px"
                        />
                    </a>
                    <a className="text-white bg-green-400 w-1/5 m-auto h-full float-left text-center p-3 no-underline text-lg hover:bg-gray-100 hover:text-black" onClick={createAHomePressed}>
                        <Image
                            src="/images/add_home.png"
                            alt="Home"
                            width="60px"
                            height="60px"
                        />
                    </a>
                    <a className="w-1/5 m-auto h-full float-left bg-gray-700 text-white text-center p-3 no-underline text-lg hover:bg-gray-100 hover:text-black" href="/notification">
                        <Image
                            src="/images/notifications.png"
                            alt="Home"
                            width="35px"
                            height="35px"
                        />
                    </a>
                    <a className="w-1/5 m-auto h-full float-left bg-gray-700 text-white text-center p-3 no-underline text-lg hover:bg-gray-100 hover:text-black" href="/homes">
                        <Image
                            src="/images/user.png"
                            alt="Home"
                            width="35px"
                            height="35px"
                        />
                    </a>
                </div>
                <div className="text-xl p-5">
                    <div className="form-area flex flex-col justify-between items-center">
                        <div className="p-5">
                            Welcome to Roomate Budget Helper <a className="text-5xl">👋</a>
                        </div>
                        <div className="w-1/5 m-auto h-full p-3">
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
                        {error&&<p className="text-xl font-light text-red-600">{error}</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomesPage;
