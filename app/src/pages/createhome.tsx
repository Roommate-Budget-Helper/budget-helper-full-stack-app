import Button from "@components/button";
import FieldInput from "@components/fieldinput";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import Image from "next/image";

const CreationPage: NextPage = () => {

    const createHome = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = (event.target as HTMLFormElement);

        // await createHome("credentials", {
        //     image: form.elements["image"].value,
        //     name: form.elements["name"].value,
        //     location: form.elements["location"].value,
        //     User[]: form.elements["users"].value,
        //     redirect: false
        // }).then(res => {
        //     setError(!res?.ok);
        // })
    }

    return (<>
        <Head>
            <title>RBH Homes Page</title>
            <meta
                name="description"
                content="Homes page of Roommate budget helper" />
        </Head>
        <div className="body flex flex-col text-center">
            <div id ="core">
                <div className="form-area flex flex-col justify-between items-center ">
                    <div>Create Home</div>
                    <br></br>
                        <form method="post" onSubmit={createHome}>
                        <div><Image src="/images/apartment.png" alt="Home" width="50px" height="50px" /> Upload Home Avatar</div>
                        <FieldInput
                            type="text"
                            name="name"
                            placeholder="Home Name" />
                        <br></br>
                        <FieldInput
                            type="text"
                            name="address"
                            placeholder="Location" />
                        <br></br>
                        <FieldInput
                            type="text"
                            name="address"
                            placeholder="" />
                        <br></br>
                        <Button
                            classNames="bg-evergreen-80 text-dorian"
                            value="Create"
                            type="submit" />
                        <br></br>
                        </form>
                </div>
            </div>
        </div>
    </>);
};

export default CreationPage;