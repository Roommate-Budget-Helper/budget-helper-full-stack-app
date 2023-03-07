import Navbar from "@components/navbar";
import { NextPage } from "next";
import Head from "next/head";
import { trpc } from "utils/trpc";
import Button from "@components/button";
import CheckboxInput from "@components/fieldinput";
import FieldInput from "@components/fieldinput";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useHomeContext } from "@stores/HomeStore";

const CreateChargePage: NextPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [splittingPage, setSplittingPage] = useState<boolean>(false);
    const [billName, setBillName] = useState<string>("");
    const [billAmount, setBillAmount] = useState<number>(0);
    const [billIds, setBillIds] = useState<Array<string>>([]);

    const router = useRouter();
    const selectedHome = useHomeContext((s) => s.selectedHome);

    const onCreateCharge = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        setBillName(form.elements["name"].value);
        setBillAmount(form.elements["amount"].value);

        let billIdsList: Array<string> = [];
        for (const occupant in occupants.data) {
          if(form.elements[occupant.name].value == true){
            billIdsList.append(occupant.id);
          }
        }
        setBillIds(billIdsList);

        setSplittingPage(true);

        console.log(billIds);
        console.log(billAmount);
        console.log(billName);
        // await sendCharge.mutateAsync({
        // homeId: selectedHome,
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
    }, [selectedHome]);

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

    if(splittingPage){
      return (
          <>
              <Head>
                  <title>RBH Create Charge</title>
                  <meta name="description" content="Create Charges" />
              </Head>
              <div className="body flex flex-col text-center">
                  {/* <Navbar/> */}
                  <div className="form-area flex flex-col justify-between items-center ">
                      <div>Create Charge</div>
                      <br></br>
                      <div>Split the amount</div>

                      <div className="bg-slate-600 mx-10 my-10 p-3 rounded-xl text-dorian text-base">
                          {/* TODO: If checkbox is checked add occupant to array. 
                        Then make a field input for each one next to their name to split the budget evenly */}
                      </div>
                  </div>
                  
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
                {/* <Navbar/> */}
                <div className="form-area flex flex-col justify-between items-center ">
                    <div>Create Charge</div>
                    <br></br>
                    <form method="post" onSubmit={onCreateCharge}>
                        <br></br>
                        <FieldInput
                            type="text"
                            name="name"
                            placeholder="Enter Description"
                        />
                        <br></br>
                        <FieldInput
                            type="text"
                            name="amount"
                            placeholder="Enter Amount"
                        />

                        <div>Who Paid?</div>

                        {occupants.data?.map((occupant) => {
                            if (occupant.name) {
                                console.log("Occupant", occupant);
                                return (
                                    <div
                                        key={occupant.id}
                                        className="bg-slate-600 mx-10 my-10 p-3 rounded-xl text-dorian text-base"
                                    >
                                    <FieldInput
                                        value={occupant.id}
                                        type="checkbox"
                                        placeholder={occupant.name}
                                        name={occupant.name}
                                    />
                                    <div>{occupant.name}</div>
                                    </div>
                                );
                            }
                        })}

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
