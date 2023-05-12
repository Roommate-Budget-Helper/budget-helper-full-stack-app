import Navbar from "@components/navbar";
import { NextPage } from "next";
import Head from "next/head";
import { trpc } from "utils/trpc";
import Button from "@components/button";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import LoadingSpinner from "@components/loadingspinner";

const BillingPage: NextPage = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const { data: unpaidCharges, refetch: refetchUnpaidCharges, isLoading: unpaidChargesLoading } = trpc.useQuery([
        "bill.getUnpaidCharges",
    ]);

    const { data: unconfirmedCharges, refetch: refetchUnconfirmedCharges, isLoading: unconfirmedChargesLoading } = trpc.useQuery([
        "bill.getUnconfirmedCharges",
    ]);

    const payCharge = trpc.useMutation(["bill.payCharge"], {
        onError: (error) => {
            setError(error.message);
        },
    });

    const confirmCharge = trpc.useMutation(["bill.confirmCharge"], {
        onError: (error) => {
            setError(error.message);
        },
    });


    // Pay the charge and then refetch the charges and users
    const handlePayCharge = (isPaid: boolean, chargeId: string) => async () => {
        await payCharge.mutateAsync({ paid: isPaid, chargeId: chargeId });
        await refetchUnpaidCharges();
        await refetchUnconfirmedCharges();
    };

    const confirmChargePaid = (confirmed: boolean, chargeId: string) => async () => {
        await confirmCharge.mutateAsync({ confirmed: confirmed, chargeId: chargeId });
        await refetchUnpaidCharges();
        await refetchUnconfirmedCharges();
    };

    return (
        <>
            <Head>
                <title>RBH Bills</title>
                <meta name="description" content="Billing and Charges" />
            </Head>
            <Navbar />
            <div className="body flex flex-col text-center text-2xl p-5">
                <h1 className="text-5xl my-10 font-bold text-evergreen-100">
                    Billing
                </h1>
                <div className="form-area flex flex-col justify-between items-center">
                    <div className="py-10 px-10 rounded-xl hover:shadow-xl">
                        <Button
                            classNames="bg-evergreen-80 text-dorian"
                            value="Send Charge"
                            type="button"
                            onClick={() => {
                                router.push("/createcharge");
                            }}
                        />
                        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                        <h2 className="text-3xl mt-5 font-bold text-evergreen-100">
                            Charges to Pay
                        </h2>
                        { unpaidChargesLoading && <LoadingSpinner/> }
                        {!unpaidChargesLoading && unpaidCharges && unpaidCharges.length > 0 ? (
                            <div>
                                {unpaidCharges.map((charge) => (
                                    <div
                                        key={charge.chargeId}
                                        className="sm:bg-transparent md:bg-slate-600 items-center mx-10 my-10 p-3 rounded-xl flex flex-col sm:text-black md:text-dorian text-base justify-between"
                                    >
                                        {charge.chargeUser.name && (
                                            <div className="rounded-full bg-evergreen-80 w-24 h-24 flex items-center flex-col justify-center">
                                                {charge.chargeUser.image ? (
                                                    <Image
                                                    className="rounded-full"
                                                        src={
                                                            charge.chargeUser
                                                                .image
                                                        }
                                                        alt={
                                                            charge.chargeUser
                                                                .name
                                                        }
                                                        width="96px"
                                                        height="96px"
                                                    />
                                                ) : (
                                                    <p>
                                                        {charge.chargeUser.name
                                                            .split(" ")
                                                            .reduce((a, c) => {
                                                                a += c[0];
                                                                return a.toUpperCase();
                                                            }, "")}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        <br></br>
                                        <p className="mt-5">
                                            Charger: {charge.chargeUser.name}
                                        </p>
                                        <p>Description: {charge.comment} </p>
                                        <p>
                                            Amount Before Splitting: $
                                            {charge.amountBeforeSplit}
                                        </p>
                                        <p>Amount Owed: ${charge.amount}</p>
                                        <p className="mb-5">
                                            Due Date:{" "}
                                            {charge.dueDate.toDateString()}
                                        </p>
                                        <div className="flex space-x-5">
                                            <Button
                                                classNames="bg-evergreen-80"
                                                value="Send Payment"
                                                onClick={handlePayCharge(
                                                    true,
                                                    charge.chargeId
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="sm:bg-transparent items-center mx-10 p-3 rounded-xl flex flex-col sm:text-black text-xl text-bold justify-between">
                                You have no unpaid charges.
                            </div>
                        )}

                        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

                        <h2 className="text-3xl mt-5 font-bold text-evergreen-100">
                            Charges to Confirm
                        </h2>
                        { unconfirmedChargesLoading && <LoadingSpinner/> }
                        {!unconfirmedChargesLoading && unconfirmedCharges && unconfirmedCharges.length > 0 ? (
                            <div>
                                {unconfirmedCharges.map((charge) => (
                                    <div
                                        key={charge.chargeId}
                                        className="sm:bg-transparent md:bg-slate-600 items-center mx-10 my-10 p-3 rounded-xl flex flex-col sm:text-black md:text-dorian text-base justify-between"
                                    >
                                        <p>From: {charge.receiveUser.name} </p>
                                        <p>Description: {charge.comment} </p>
                                        <p>
                                            Amount Before Splitting: $
                                            {charge.amountBeforeSplit}
                                        </p>
                                        <p>Amount Paid: ${charge.amount}</p>
                                        <p>
                                            Date Paid:
                                            {charge.paidDate?.toDateString()}
                                        </p>

                                        <div className="flex space-x-5">
                                            <Button
                                                classNames="bg-evergreen-80"
                                                value="Confirm Payment"
                                                onClick={confirmChargePaid(
                                                    true,
                                                    charge.chargeId
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="sm:bg-transparent items-center mx-10 p-3 rounded-xl flex flex-col sm:text-black text-xl text-bold justify-between">
                                You have no charges pending approval.
                            </div>
                        )}

                        {error && (
                            <p className="text-xl font-light text-red-600">
                                {error}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BillingPage;
