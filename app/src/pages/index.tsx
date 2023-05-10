import type { NextPage } from "next";
import Head from "next/head";
import Image from 'next/image'
import Button from '@components/button';
import { useRouter } from 'next/router';


const Home: NextPage = () => {
    const router = useRouter();
    
    const routeToLogin = async () => {
        router.push("/login");
    }

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
            <div className="body text-center" >
                <Image src="/images/logo.png" alt="Description of image" width={150} height={150}/>
                <h1 className="text-5xl font-bold text-evergreen-100 mb-4">Welcome to Roommate Budget Helper!</h1>
                <Button classNames="bg-evergreen-80 mb-4" onClick={routeToLogin} value="Login / Register" />
                <p className="text-xl mb-4">Roommate Budget Helper is a web application designed for easily splitting costs and tracking budgets between multiple people sharing a household.</p>
                <p className="text-xl mb-4"> Features: <ul className="list-disc list-inside">
                                                            <li>Create charges and split them between roommates</li>
                                                            <li>Remind roommates to pay their bills</li>
                                                            <li>Track budgets of multiple separate households</li>
                                                            <li>Accessible from web browser on both PC and mobile</li></ul></p>
                <Image src="/images/formobileandpc.png" alt="Description of image" width={276} height={193}/>

            </div>
        </>
    );
};

export default Home;
