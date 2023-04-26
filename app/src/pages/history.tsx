import type { NextPage } from 'next'
import Head from 'next/head'
import Navbar from '@components/navbar'
import { trpc } from 'utils/trpc'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

const HistoryPage: NextPage = () => {
    const session = useSession();
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
            <div className="body flex flex-col items-center text-center text-3xl p-5">
                <h1 className="text-5xl my-10 font-bold text-evergreen-100">
                    Billing
                </h1>
                <div className="sm:w-88 lg:w-[32rem]">
                    <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                    {chargeHistory?.map((charge) =>
                        charge.chargerId === session.data?.user?.id ? (
                            // Payment
                            <div
                                key={charge.chargeId}
                                className="py-5 px-3 rounded-xl hover:shadow-xl"
                            >
                                <div className="flex items-center gap-3 p-2">
                                    {charge.receiveUser.image ? (
                                        <Image
                                            className="rounded-full hover:cursor-pointer"
                                            width="2rem"
                                            height="2rem"
                                            src={charge.receiveUser.image}
                                            alt="user photo"
                                        />
                                    ) : (
                                        <p className="rounded-full bg-green-50">
                                            {charge.chargeUser.name
                                                .split(" ")
                                                .reduce((a, c) => {
                                                    a += c[0];
                                                    return a.toUpperCase();
                                                }, "")}
                                        </p>
                                    )}
                                    <h3 className="text-black text-sm dark:text-gray-600">
                                        you charged {" "}
                                        <a
                                            className="hover:text-blue-400"
                                        >
                                            {charge.receiveUser.name}
                                        </a>{" "}
                                        ${charge.amount}
                                    </h3>
                                </div>
                                <div className="p-4 rounded border border-gray-700 bg-gray-50 h-auto">
                                    <div className="flex justify-between items-center mb-2">
                                        <a
                                            className="font-bold hover:text-blue-400"
                                            href="#"
                                        >
                                            {charge.comment}
                                        </a>
                                        <p>{charge.home.name}</p>
                                    </div>
                                    <p className="text-sm text-gray-400 text-left">
                                        {charge.receiveUser.name} paid you ${charge.amount} for{" "}
                                        {charge.comment} in category{" "}
                                        {charge.category}
                                    </p>
                                    <div className="mt-3 flex items-center gap-5">
                                        {!charge.paid && !charge.confirmed && (
                                            <p className="text-sm text-gray-400">
                                                🔴 Unpaid
                                            </p>
                                        )}
                                        {charge.paid && !charge.confirmed && (
                                            <p className="text-sm text-gray-400">
                                                🟢 Paid
                                            </p>
                                        )}
                                        {charge.paid && charge.confirmed && (
                                            <p className="text-sm text-gray-400">
                                                ✅ Confirmed
                                            </p>
                                        )}
                                        <a
                                            href="#"
                                            className="text-sm text-gray-400"
                                        >
                                            ⭐ Total Amount: $
                                            {charge.amountBeforeSplit}
                                        </a>
                                        <p className="text-sm text-gray-400">
                                            Due: {charge.dueDate.toDateString()}
                                        </p>
                                        {charge.paidDate && (
                                            <p className="text-sm text-gray-400">
                                                Paid on:{" "}
                                                {charge.paidDate.toDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Charge
                            <div
                                key={charge.chargeId}
                                className="py-5 px-3 rounded-xl hover:shadow-xl"
                            >
                                <div className="flex items-center gap-3 p-2">
                                    {charge.receiveUser.image ? (
                                        <Image
                                            className="rounded-full hover:cursor-pointer"
                                            width="2rem"
                                            height="2rem"
                                            src={charge.receiveUser.image}
                                            alt="user photo"
                                        />
                                    ) : (
                                        <p className="rounded-full bg-green-50">
                                            {charge.chargeUser.name
                                                .split(" ")
                                                .reduce((a, c) => {
                                                    a += c[0];
                                                    return a.toUpperCase();
                                                }, "")}
                                        </p>
                                    )}
                                    <h3 className="text-black text-sm dark:text-gray-600">
                                        <a
                                            className="hover:text-blue-400"
                                        >
                                            {charge.receiveUser.name}
                                        </a>{" "}
                                        charged you ${charge.amount}
                                    </h3>
                                </div>
                                <div className="p-4 rounded border border-gray-700 bg-gray-50 h-auto">
                                    <div className="flex justify-between items-center mb-2">
                                        <a
                                            className="font-bold hover:text-blue-400"
                                            href="#"
                                        >
                                            {charge.comment}
                                        </a>
                                        <p>{charge.home.name}</p>
                                    </div>
                                    <p className="text-sm text-gray-400 text-left">
                                        {charge.receiveUser.name} paid you ${charge.amount} for{" "}
                                        {charge.comment} in category{" "}
                                        {charge.category}
                                    </p>
                                    <div className="mt-3 flex items-center gap-5">
                                        {!charge.paid && !charge.confirmed && (
                                            <p className="text-sm text-gray-400">
                                                🔴 Unpaid
                                            </p>
                                        )}
                                        {charge.paid && !charge.confirmed && (
                                            <p className="text-sm text-gray-400">
                                                🟢 Paid
                                            </p>
                                        )}
                                        {charge.paid && charge.confirmed && (
                                            <p className="text-sm text-gray-400">
                                                ✅ Confirmed
                                            </p>
                                        )}
                                        <a
                                            href="#"
                                            className="text-sm text-gray-400"
                                        >
                                            ⭐ Total Amount: $
                                            {charge.amountBeforeSplit}
                                        </a>
                                        <p className="text-sm text-gray-400">
                                            Due: {charge.dueDate.toDateString()}
                                        </p>
                                        {charge.paidDate && (
                                            <p className="text-sm text-gray-400">
                                                Paid on:{" "}
                                                {charge.paidDate.toDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
}

export default HistoryPage;