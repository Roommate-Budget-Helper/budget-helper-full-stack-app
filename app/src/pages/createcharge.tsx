import Navbar from "@components/navbar";
import { NextPage } from "next";
import Head from "next/head";
import { trpc } from "utils/trpc";
import Image from "next/image";
import Button from "@components/button";
import FieldInput from "@components/fieldinput";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useHomeContext } from "@stores/HomeStore";

const CreateChargePage: NextPage = () => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const selectedHome = useHomeContext((s) => s.selectedHome);

    const onCreateCharge = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        // await sendCharge.mutateAsync({

        // });
    };

    // Get the selected home somehow so that you can get the occupants
    const occupants = trpc.useQuery([
        "occupies.getUsersInHome",
        { homeId: selectedHome },
    ]);

    const sendCharge = trpc.useMutation(["bill.sendCharge"], {
        onError: (error) => {
            setError(error.message);
        },
    });

    useEffect(() => {
        occupants.refetch();
    }, [selectedHome, occupants.data]);

    if (!selectedHome) {
        return (
            <>
                <Head>
                    <title>RBH Create Charge</title>
                    <meta name="description" content="Create Charges" />
                </Head>
                <div className="body flex flex-col text-center">
                    <Navbar />
                    <div> Please select/create a home to create a charge.</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>RBH Create Charge</title>
                <meta name="description" content="Create Charges" />
            </Head>
            <div className="body flex flex-col text-center">
                <Navbar />
                <div className="form-area flex flex-col justify-between items-center ">
                    <div>Create Charge</div>
                    <br></br>
                    <form method="post" onSubmit={onCreateCharge}>
                        <br></br>
                        <FieldInput
                            type="text"
                            name="description"
                            placeholder="Enter Description"
                        />
                        <br></br>
                        <FieldInput
                            type="text"
                            name="amount"
                            placeholder="Enter Amount"
                        />

                        <div>Who Paid?</div>

                        {/* Loop through all of the occupants and create a checkbox for each one */}
                        {occupants.data?.map((occupant) => {
                          console.log("Occupant", occupant);
                           return (<div
                                key={occupant.id}
                                className="bg-slate-600 mx-10 my-10 p-3 rounded-xl text-dorian text-base"
                            >
                                <input value={occupant.id} type="checkbox">
                                    {occupant.name}
                                </input>
                              </div>);
                        })}

                        <br></br>
                        <Button
                            classNames="bg-evergreen-80 text-dorian"
                            value="Create"
                            type="submit"
                        />
                        <br></br>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateChargePage;
