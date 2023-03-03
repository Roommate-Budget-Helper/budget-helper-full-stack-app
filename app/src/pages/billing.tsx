import Navbar from "@components/navbar";
import { NextPage } from "next"
import Head from "next/head"
import { trpc } from "utils/trpc";
import Image from "next/image";
import Button from "@components/button";
import { useHomeContext } from "@stores/HomeStore";

const BillingPage: NextPage = () => {
    const { data: invitations, refetch: refetchInvitations } = trpc.useQuery(["bill.getCharges"]);

    return (
    <>
        <Head>
            <title>RBH Bills</title>
                <meta
                    name="description"
                    content="Billing and Charges"
                />
        </Head>
        <div className="body flex flex-col text-center">
            <Navbar />
            <div className="text-2xl p-5">
                <div>Add Billing Stuff Here!</div>
            </div>
        </div>
    </>);
}

export default BillingPage