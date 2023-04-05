import Navbar from "@components/navbar";
import { NextPage } from "next";
import Head from "next/head";
import { trpc } from "utils/trpc";
import Button from "@components/button";
import FieldInput, { DateFieldInput, MoneyFieldInput } from "@components/fieldinput";
import Image from "next/image";
import { useEffect } from "react";
import { useState } from "react";
import { useHomeContext } from "@stores/HomeStore";
import { router } from "@trpc/server";
import { useRouter } from "next/router";

const CreateChargePage: NextPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [splittingPage, setSplittingPage] = useState<boolean>(false);
    const [billName, setBillName] = useState<string>("");
    const [billAmount, setBillAmount] = useState<number>(0);
    const [billId, setBillId] = useState<string>("");
    const [dueDate, setDueDate] = useState<string>("");
    const [category, setCategory] = useState<string>("");

    const selectedHome = useHomeContext((s) => s.selectedHome);
    const router = useRouter();

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
        const dueDate = form.elements["dueDate"].value;
        const category = form.elements["category"].value;
        if(billName.length < 1 || billAmount < .01 || category < 1) {
            setError("The form elements cannot be empty or negative!");
            return;
        }

        setBillName(billName);
        setBillAmount(billAmount);
        setDueDate(dueDate);
        setCategory(category);

        // check which home occupants to charge
        let checkedId = 0;
        occupants.data?.forEach((occupant) => {
            if (form.elements[occupant.user.id]) {
                const isOccupantSelected = form.elements[occupant.user.id].checked;
                if (isOccupantSelected && checkedId === 0) {
                    setBillId(occupant.user.id);
                    checkedId++;
                }else if(isOccupantSelected){
                  setError("You can only select one occupant to have paid the bill");
                  checkedId++;
                }
            }
        });

        if(checkedId === 1){
          setSplittingPage(true);
          setError(null);
        } else {
            setError("You must have exactly only occupant as payer for a charge.");
            return;
        }
    };

    const onSplitCharge = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        // check that the sum of the split amounts is equal to the total amount
        let sum = 0;
        occupants.data?.forEach((occupant) => {
            if (form.elements[occupant.user.id]) {
               sum += Number(form.elements[occupant.user.id].value);
            }
        });

        if(sum !== Number(billAmount)){
            setError("The sum of the split amounts must be equal to the total amount");
            return;
        }

        const formattedDueDate = new Date(dueDate);
        occupants.data?.forEach((occupant) => {
            if (form.elements[occupant.user.id]) {
                const amountDue = form.elements[occupant.user.id].value;
                // Don't send a charge to the person who paid the bill
                if(selectedHome){
                  // TODO: If this fails on one of them, then it shouldn't send any of them most likely
                  if(occupant.user.id !== billId){
                    sendCharge.mutateAsync({
                      amountBeforeSplit: String(billAmount),
                      chargerId: billId,
                      receiverId: occupant.user.id,
                      homeId: selectedHome,
                      amount: String(amountDue),
                      comment: billName, 
                      due: formattedDueDate,
                    });
                  }
                }else{
                  // TODO: This should not be something that we even have to check. The email must be given.
                  setError("The home is not currently selected");
                  return;
                }
            }
        });

        router.push("/billing");
    };

    // Loading page for when the home hasn't loaded in yet
    if (!selectedHome) {
        return (
            <>
                <Head>
                    <title>RBH Create Charge</title>
                    <meta name="description" content="Create Charges" />
                </Head>
                <Navbar />
                <div className="body flex flex-col text-center text-2xl p-5">
                    <div>Please select/create a home to create a charge.</div>
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
              <Navbar />
              <div className="body flex flex-col text-center text-2xl p-5">
                  <h1 className="text-5xl my-10 font-bold text-evergreen-100">
                      Create Charge
                  </h1>
                  <div className="form-area flex flex-col justify-between items-center ">
                      <form method="post" onSubmit={onSplitCharge}>
                          <div className="bg-evergreen-100 mx-10 my-10 p-3 rounded-xl text-base">
                              <h2 className="text-2xl mb-2 font-bold text-dorian">
                                  Splitting ${billAmount}
                              </h2>
                              <hr></hr>
                              {occupants.data &&
                                  occupants.data.map((occupant) => {
                                      return (
                                          <div 
                                            key={occupant.user.id}
                                            className="sm:bg-transparent md:bg-slate-600 items-center mx-10 my-10 rounded-xl flex flex-col sm:text-black md:text-dorian text-base justify-between"
                                            >
                                              <div className="rounded-full bg-evergreen-80 w-24 h-24 flex flex-col items-center justify-center">
                                                  {occupant.user.image ? (
                                                      <Image
                                                          src={
                                                              occupant.user
                                                                  .image
                                                          }
                                                          alt={
                                                              occupant.user.name
                                                          }
                                                          width="64px"
                                                          height="64px"
                                                      />
                                                  ) : (
                                                      <p>
                                                          {occupant.user.name
                                                              .split(" ")
                                                              .reduce(
                                                                  (a, c) => {
                                                                      a += c[0];
                                                                      return a.toUpperCase();
                                                                  },
                                                                  ""
                                                              )}
                                                      </p>
                                                  )}
                                              </div>
                                              <div className="text-dorian mt-10">
                                                  {occupant.user.name}
                                              </div>
                                              <MoneyFieldInput
                                                  name={occupant.user.id}
                                                  placeholder="0.00"
                                                  max={String(billAmount)}
                                              />
                                          </div>
                                      );
                                  })}

                              <Button
                                  classNames="bg-evergreen-80 text-dorian"
                                  value="Send Charge"
                                  type="submit"
                              />
                          </div>
                      </form>

                      {error && (
                          <p className="text-xl font-light text-red-600">
                              {error}
                          </p>
                      )}
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
            <Navbar />
            <div className="body flex flex-col text-center text-2xl p-5">
                <h1 className="text-5xl mt-10 font-bold text-evergreen-100">
                    Create Charge
                </h1>
                <div className="form-area flex flex-col justify-between items-center ">
                    <form method="post" onSubmit={onCreateCharge}>
                        <br></br>
                        <FieldInput
                            type="text"
                            name="name"
                            placeholder="Enter Charge Description"
                        />
                        <br></br>
                        <FieldInput
                            type="text"
                            name="category"
                            placeholder="Charge Category"
                        />
                        <br></br>
                        <MoneyFieldInput
                            placeholder="0.00"
                            name="amount"
                            max="1000000"
                        />
                        <br></br>
                        <DateFieldInput name="dueDate" />
                        <h2 className="text-3xl mt-5 font-bold text-evergreen-100">
                            Who Paid the Charge?
                        </h2>
                        {occupants.data?.map((occupant) => {
                            if (occupant.user.name) {
                                return (
                                    <div
                                        key={occupant.user.id}
                                        className="bg-slate-600 w-88 my-10 p-3 rounded-xl text-dorian text-base"
                                    >
                                        <input
                                            type="checkbox"
                                            name={occupant.user.id}
                                            className="mr-4"
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
                    <div className="text-evergreen-100 font-bold mt-5">
                        Step 1 of 2
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-center w-10 h-10 bg-evergreen-100 rounded-full my-2 mx-2">
                            <span className="text-dorian">1</span>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-evergreen-80 rounded-full my-2 mx-2">
                            <span className="text-dorian">2</span>
                        </div>
                    </div>
                    {error && (
                        <p className="text-xl font-light text-red-600">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default CreateChargePage;
