import Navbar from "@components/navbar";
import { NextPage } from "next";
import Head from "next/head";
import { trpc } from "utils/trpc";
import Button from "@components/button";
import { useRouter } from "next/router";
import { useState } from "react";

const BillingPage: NextPage = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const { data: charges, refetch: refetchCharges } = trpc.useQuery([
        "bill.getCharges",
    ]);

    const { data: users, refetch: refetchUsers } = trpc.useQuery([
        "occupies.getUsersById",
        { ids: charges?.map((charge) => charge.chargerId) },
    ]);

    const payCharge = trpc.useMutation(["bill.payCharge"], {
        onError: (error) => {
            setError(error.message);
        },
    });


    // Pay the charge and then refetch the charges and users
    const handlePayCharge = (isPaid: boolean, chargeId: string) => async () => {
        await payCharge.mutateAsync({ paid: isPaid, chargeId: chargeId });
        await refetchCharges();
        await refetchUsers();
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
                  <div className="form-area flex flex-col justify-between items-center ">
                    <div>
                        <Button
                            classNames="bg-evergreen-80 text-dorian"
                            value="Send Charge"
                            type="button"
                            onClick={() => {
                              router.push("/createcharge");
                            }}
                        />
                        <h2 className="text-3xl mt-5 font-bold text-evergreen-100">Charges</h2>

                        {charges && charges.length > 0 ? (
                            <div>
                                {charges.map((charge) => (
                                    <div
                                        key={charge.chargeId}
                                        className="bg-slate-600 mx-106 my-10 p-3 rounded-xl text-dorian text-base"
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
                                        <p>Charger: {users?.find((user) => user.id === charge.chargerId)?.name}</p>
                                        <p>Description: {charge.comment}</p>
                                        <p>Amount: {charge.amount}</p>
                                        {/* TODO: Select to pay charge */}
                                        <div className="flex space-x-5">
                                            <Button
                                                classNames="bg-evergreen-80"
                                                value="Accept"
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
                            <div>You have no charges.</div>
                        )}
                        {error &&<p className="text-xl font-light text-red-600">{error}</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BillingPage;
