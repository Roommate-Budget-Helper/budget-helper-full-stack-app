import Head from "next/head";
import React from "react";
import Image from "next/image";
import type { GetServerSideProps, NextPage } from "next";
import Navbar from "@components/navbar";
import { trpc } from "../../utils/trpc";
import { useState } from 'react';


interface HomePageProps {
    id: string
}


const HomeIdPage: NextPage<HomePageProps> = (props: HomePageProps) => {
    const [error, setError] = useState<string | null>(null);

    const homeData = trpc.useQuery(["home.getHomeById", {homeId: props.id} ], {
    });
    
    return (
        <>
            <Head>
                <title>Home - {homeData.data?.name}</title>
                <meta
                    name="description"
                    content="Specific home's page of Roommate budget helper"
                />
            </Head>
            <div className="body flex flex-col text-center">
               <Navbar />
                {homeData.data ? <div className="text-xl p-5">
                    <div className="form-area flex flex-col justify-between items-center">
                        <Image alt="Home Image" src={homeData.data.image} width="128px" height="128px"/>
                        <div className="p-5">{homeData.data.name}</div>
                        <div className="p-1 text-sm">📍Address: {homeData.data.address}</div>
                        <div className="p-5" >This is the roommates cost chart</div>
                        <br></br>
                        <div>
                            This Month&apos;s Spendings
                        </div>
                    </div>
                </div> : <div>Loading....</div>}
                {error&&<p className="text-xl font-light text-red-600">{error}</p>}
            </div>
        </>
    );
};


export const getServerSideProps: GetServerSideProps = async ({ params }) =>{
    return {
        props: {
            id: params?.id,
        }
    }
}


export default HomeIdPage;