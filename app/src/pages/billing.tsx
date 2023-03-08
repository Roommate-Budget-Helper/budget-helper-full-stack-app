import Navbar from "@components/navbar";
import { NextPage } from "next";
import Head from "next/head";
import { trpc } from "utils/trpc";
import Button from "@components/button";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

const BillingPage: NextPage = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const { data: unpaidCharges, refetch: refetchUnpaidCharges } = trpc.useQuery([
        "bill.getUnpaidCharges",
    ]);

    const { data: unconfirmedCharges, refetch: refetchUnconfirmedCharges } = trpc.useQuery([
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
            <div className="body flex flex-col text-center">
                <Navbar/>
                <h1 className="text-5xl my-10 font-bold text-evergreen-100">Billing</h1>
                  <div className="form-area flex flex-col justify-between items-center">
                    <div className="bg-slate-200 py-10 px-10 rounded-xl">
                        <Button
                            classNames="bg-evergreen-80 text-dorian"
                            value="Send Charge"
                            type="button"
                            onClick={() => {
                              router.push("/createcharge");
                            }}
                        />
                        <h2 className="text-3xl mt-5 font-bold text-evergreen-100">Pay Charges</h2>
                        {unpaidCharges && unpaidCharges.length > 0 ? (
                            <div>
                                {unpaidCharges.map((charge) => (
                                    <div
                                        key={charge.chargeId}
                                        className="bg-slate-600 mx-106 my-10 p-3 rounded-xl text-dorian text-base"
                                    >
                                        {charge.user.image && charge.user.name && (
                                            <Image
                                                className="rounded-full"
                                                src={charge.user.image}
                                                alt={charge.user.name}
                                                width="128px"
                                                height="128px"
                                            />
                                        )}
                                        <p>Charger: {charge.user.name} </p>
                                        <p>Description: {charge.comment} </p>
                                        <p>Amount: {charge.amount}</p>
                                        <div className="flex space-x-5">
                                            <Button
                                                classNames="bg-evergreen-80"
                                                value="Send Payment"
                                                onClick={handlePayCharge(
                                                    true,
                                                    charge.chargeId,
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>You have no unpaid charges.</div>
                        )}

                        <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

                        <h2 className="text-3xl mt-5 font-bold text-evergreen-100">Unconfirmed Charges</h2>
                        {unconfirmedCharges && unconfirmedCharges.length > 0 ? (
                            <div>
                                {unconfirmedCharges.map((charge) => (
                                    <div
                                        key={charge.chargeId}
                                        className="bg-slate-600 mx-106 my-10 p-3 rounded-xl text-dorian text-base"
                                    >
                                        <p>From: {charge.email} </p>
                                        <p>Description: {charge.comment} </p>
                                        <p>Amount: {charge.amount}</p>
                                        
                                        <div className="flex space-x-5">
                                            <Button
                                                classNames="bg-evergreen-80"
                                                value="Confirm Payment"
                                                onClick={confirmChargePaid(
                                                    true,
                                                    charge.chargeId,
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>You have no charges pending approval.</div>
                        )}

                        {error &&<p className="text-xl font-light text-red-600">{error}</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BillingPage;
