import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import Image from "next/image";
import { trpc } from "utils/trpc";
import Navbar from "@components/navbar";
import { useState } from 'react';


const HomesPage: NextPage = () => {
    const [error, setError] = useState<string | null>(null);

    
    const homes = trpc.useQuery(["home.getHomes"]);


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
                        {homes.data && homes.data.length > 0 ? <>
                        <div>You belong to {homes.data.length} homes</div>
                        <br></br>
                        
                        <div id="homeDisplay">
                            {homes.data?.map(home => (<div key={home.id}>
                                <h1>{home.name}</h1>
                                <p>{home.address}</p>
                                <a className="text-evergreen-80" href={`/home/${home.id}`}>View</a>
                            </div>))}
                        </div>
                        </> : <>
                        <div>You do not currently belong to any homes...</div>
                        <br></br>
                        </>}
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


export default HomesPage;
