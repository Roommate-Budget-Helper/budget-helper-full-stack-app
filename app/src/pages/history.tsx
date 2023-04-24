import type { NextPage } from 'next'
import Head from 'next/head'
import Navbar from '@components/navbar'
import { trpc } from 'utils/trpc'

const HistoryPage: NextPage = () => {
    const {data: chargeHistory, refetch: refetchChargeHistory} = trpc.useQuery([
        "bill.getChargesHistory",
    ]);

    return (
        <>
            <Head>
                <title>RBH Homes Page</title>
                <meta
                    name="description"
                    content="Homes page of Roommate budget helper"
                />
            </Head>
            <Navbar />
            <div className="body flex flex-col text-center text-2xl p-5">
                <h1 className="text-5xl my-10 font-bold text-evergreen-100">
                    Billing
                </h1>

                <div className="py-10 px-10 rounded-xl hover:shadow-xl">

                </div>
            </div>
        </>
    );
}

export default HistoryPage;