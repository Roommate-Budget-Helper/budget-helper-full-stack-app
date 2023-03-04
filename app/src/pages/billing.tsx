import Navbar from "@components/navbar";
import { NextPage } from "next";
import Head from "next/head";
import { trpc } from "utils/trpc";
import Image from "next/image";
import Button from "@components/button";
import { useHomeContext } from "@stores/HomeStore";

const BillingPage: NextPage = () => {
    const { data: charges, refetch: refetchCharges } = trpc.useQuery([
        "bill.getCharges",
    ]);

    return (
        <>
            <Head>
                <title>RBH Bills</title>
                <meta name="description" content="Billing and Charges" />
            </Head>
            <div className="body flex flex-col text-center">
                <Navbar />
                <h1 className="text-4xl p-5">Billing</h1>
                <div className="text-2xl p-5">
                    <div className="relative flex flex-col items-center rounded-[20px] w-[400px] mx-auto p-4 bg-grey bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none">
                        <Button
                            classNames="bg-evergreen-80 text-dorian"
                            value="Send Charge"
                            type="button"
                        />
                        <div> Charges </div>

                        {/* TODO: Charge has any type */}
                        {charges && charges.length > 0 ? (
                            <div>
                                {charges.map((charge) => (
                                    <div
                                        key={charge.id}
                                        className="bg-slate-600 mx-10 my-10 p-3 rounded-xl text-dorian text-base"
                                    >
                                      {/* TODO: This is going to be the charger id user image */}
                                        {/* {home.image && (
                                            <Image
                                                src={home.image}
                                                alt="home logo"
                                                width="128px"
                                                height="128px"
                                            />
                                        )} */}
                                        <p>{charge.comment}</p>
                                        <p>{charge.amount}</p>
                                        {/* TODO: Select to pay charge */}
                                        {/* <div className="flex space-x-5">
                                            <Button
                                                classNames="bg-evergreen-80"
                                                value="Accept"
                                                onClick={handleInviteSelection(
                                                    true,
                                                    home.id
                                                )}
                                            />
                                            <Button
                                                classNames="bg-red-600"
                                                value="Reject"
                                                onClick={handleInviteSelection(
                                                    false,
                                                    home.id
                                                )}
                                            />
                                        </div> */}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>You have no charges.</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BillingPage;
