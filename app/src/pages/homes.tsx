import type { NextPage } from "next";
import Head from "next/head";
import React, { useMemo } from "react";
import Image from "next/image";
import Navbar from "@components/navbar";
import { useState } from 'react';
import { useHomeContext } from "@stores/HomeStore";



const HomesPage: NextPage = () => {
    const [error, setError] = useState<string | null>(null);
    const homes = useHomeContext((s) => s.homes);
    const selectedHome = useHomeContext((s) => s.selectedHome);

    const homeData = useMemo(() => {
        return homes.find(home => home.id === selectedHome);
    }, [selectedHome, homes]);


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
                <Navbar />
                <div className="text-xl p-5">
                    {selectedHome && homeData ? 
                    <div className="body flex flex-col text-center">
                        <div className="text-xl p-5">
                            <div className="form-area flex flex-col justify-between items-center">
                                {homeData.image &&
                                <div className="relative -z-10">
                                    <Image alt="Home Image" src={homeData.image} width="128px" height="128px"/>
                                </div>}
                                <div className="p-5">{homeData.name}</div>
                                <div className="p-1 text-sm">📍Address: {homeData.address}</div>
                                <div className="p-5" >This is the roommates cost chart</div>
                                <br></br>
                                <div>
                                    This Month&apos;s Spendings
                                </div>
                            </div>
                        </div>
                        {error&&<p className="text-xl font-light text-red-600">{error}</p>}
                    </div> :
                    <div className="form-area flex flex-col justify-between items-center">
                        <div className="p-5">
                            Welcome to Roomate Budget Helper <a className="text-5xl">👋</a>
                        </div>
                        <div className="w-1/5 m-auto h-full p-3 relative -z-10">
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
                            Feel free to create more homes using the plus button, or
                            contact your home creator to invite you!
                        </div>
                        {error&&<p className="text-xl font-light text-red-600">{error}</p>}
                    </div>}
                </div>
            </div>
        </>
    );
};


export default HomesPage;
