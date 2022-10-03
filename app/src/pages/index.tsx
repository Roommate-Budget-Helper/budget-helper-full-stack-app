import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Roommate Budget Helper</title>
                <meta
                    name="description"
                    content="Homepage of the roommate budget helper application"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="body"></div>
        </>
    );
};

export default Home;
