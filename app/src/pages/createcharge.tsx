import Navbar from "@components/navbar";
import { NextPage } from "next";
import Head from "next/head";
import { trpc } from "utils/trpc";
import Button from "@components/button";
import FieldInput from "@components/fieldinput";
import { useEffect } from "react";
import { useState } from "react";
import { useHomeContext } from "@stores/HomeStore";

const CreateChargePage: NextPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [splittingPage, setSplittingPage] = useState<boolean>(false);
    const [billName, setBillName] = useState<string>("");
    const [billAmount, setBillAmount] = useState<number>(0);
    const [billIds, setBillIds] = useState<string[]>([]);

    const selectedHome = useHomeContext((s) => s.selectedHome);

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

    const onCreateCharge = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const billName = form.elements["name"].value;
        const billAmount = form.elements["amount"].value;

        setBillName(billName);
        setBillAmount(billAmount);

        // check which home occupants to charge
        occupants.data?.forEach((occupant) => {
            if (form.elements[occupant.user.id]) {
                const isOccupantSelected = form.elements[occupant.user.id].checked;
                if (isOccupantSelected) {
                    setBillIds(billIds.concat(occupant.user.id));
                }
            }
        });

        setSplittingPage(true);
        setError(null);
    };

    const onSplitCharge = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        const currentDate = new Date();
        const defaultDueDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
        occupants.data?.forEach((occupant) => {
            if (form.elements[occupant.user.id]) {
                const amountDue = form.elements[occupant.user.id].value;
                if(occupant.user.email && selectedHome){
                  // TODO: If this fails on one of them, then it shouldn't send any of them most likely
                  sendCharge.mutateAsync({
                    email: occupant.user.email,
                    homeId: selectedHome,
                    amount: String(amountDue),
                    comment: billName, 
                    due: defaultDueDate,
                  });
                }else{
                  // TODO: This should not be something that we even have to check. The email must be given.
                  setError("The home is not currently selected or the user doesn't have an email.");
                  return;
                }
            }
        });

        setSplittingPage(false);
    };

    // Loading page for when the home hasn't loaded in yet
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

    // Page 2 for splitting the amount between multiple roommates
    if(splittingPage){
      return (
          <>
              <Head>
                  <title>RBH Create Charge</title>
                  <meta name="description" content="Create Charges" />
              </Head>
              <div className="body flex flex-col text-center">
                  <Navbar/>
                  <h1 className="text-5xl my-10 font-bold text-evergreen-100">Create Charge</h1>

                  <div className="form-area flex flex-col justify-between items-center ">
                      <form method="post" onSubmit={onSplitCharge}>
                        <div className="bg-evergreen-100 mx-10 my-10 p-3 rounded-xl text-base">
                          <h2 className="text-2xl mb-2 font-bold text-dorian">Splitting ${billAmount}</h2>
                          <hr></hr>
                          {occupants.data && occupants.data.map((occupant) => {
                              return (<div key={occupant.user.id}> 
                              {/* TODO: Fix the layout on this page and the checkbox page */}
                                <div className="text-dorian"> {occupant.user.name} </div>
                                {/* TODO: Set a min and max value as well as decimal steps for the money input */}
                                <FieldInput
                                  type="number"
                                  name={occupant.user.id}
                                  placeholder=""
                                />
                              </div>);
                          })}

                        <Button
                            classNames="bg-evergreen-80 text-dorian"
                            value="Send Charge"
                            type="submit"
                        />
                        </div>
                      </form>
                      
                      {error &&<p className="text-xl font-light text-red-600">{error}</p>}
                  </div>
                  
              </div>
          </>
      );
    }

    // Page 1 for selecting who is going to pay
    return (
        <>
            <Head>
                <title>RBH Create Charge</title>
                <meta name="description" content="Create Charges" />
            </Head>
            <div className="body flex flex-col text-center">
                <Navbar/>
                <div className="form-area flex flex-col justify-between items-center ">

                    <h1 className="text-5xl mt-10 font-bold text-evergreen-100">Create Charge</h1>
                    <br></br>
                    <form method="post" onSubmit={onCreateCharge}>
                        <br></br>
                        <FieldInput
                            type="text"
                            name="name"
                            placeholder="Enter Charge Description"
                        />
                        <br></br>
                        <FieldInput
                            type="number"
                            name="amount"
                            placeholder="Enter Charge Amount"
                        />
                        <h2 className="text-3xl mt-5 font-bold text-evergreen-100">Who is Paying?</h2>
                        {occupants.data?.map((occupant) => {
                            if (occupant.user.name) {
                                return (
                                    <div
                                        key={occupant.user.id}
                                        className="bg-slate-600 w-96 my-10 p-3 rounded-xl text-dorian text-base "
                                    >
                                    <FieldInput
                                        type="checkbox"
                                        placeholder=""
                                        name={occupant.user.id}
                                    />
                                    
                                    {occupant.user.name}
                                    </div>
                                );
                            }
                        })}
                        <Button
                            classNames="bg-evergreen-80 text-dorian"
                            value="Create"
                            type="submit"
                        />
                    </form>
                    <br></br>
                    {/* TODO: Insert the amount of steps circles for creating a charge */}
                    {error &&<p className="text-xl font-light text-red-600">{error}</p>}
                </div>
            </div>
        </>
    );
};

export default CreateChargePage;
