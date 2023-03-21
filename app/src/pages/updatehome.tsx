import type { NextPage } from "next";
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useHomeContext } from "@stores/HomeStore";
import React, { useRef, useMemo } from "react";
import { trpc } from "utils/trpc";
import Head from "next/head";
import FieldInput from "@components/fieldinput";
import Button from "@components/button";
import Image from "next/image";

const UpdatePage: NextPage = () => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);
    const getPresignedURL = trpc.useMutation(["upload.getPresignedURL"])
    
    const refetchHomes = useHomeContext(s => s.refetchHomes);
    const setSelectedHome = useHomeContext(s => s.setSelectedHome);
    const selectedHome = useHomeContext((s) => s.selectedHome);
    const homes = useHomeContext((s) => s.homes);
    
    const homeData = useMemo(() => {
        return homes.find(home => home.id === selectedHome);
    }, [selectedHome, homes]);

    const updateHome = trpc.useMutation(["home.updateHome"], {
        onError: (error) => {
            setError(error.message);
        },
        onSuccess: async (home) => {
            if(!home) return;
            await refetchHomes();
            setSelectedHome(home.id);
            router.push("/homes");
        },
    }); 

    const onUpdateHome = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        const fileList = fileRef.current?.files
        let imageFile = null
        if(fileList){
            imageFile = fileList[0]
        }   
        let key;
        if(!homeData){
            return;
        }
        key = homeData.image;
        
        if(imageFile){
            const { url, fields } = await getPresignedURL.mutateAsync(imageFile.name);
            const data = {
                ...fields,
                'Content-Type': imageFile.type,
                file: imageFile
            }
            key = fields.key;
            const formData = new FormData();
            for(const name in data){
                formData.append(name, data[name]);
            }
            await fetch(url, {
                method: "POST",
                body: formData
            })
        }   
        
        
        const name = form.elements["name"].value;
        const address = form.elements["address"].value;

        await updateHome.mutateAsync({
            id: homeData.id,
            image: key,
            name: name,
            address: address,
        });
    };

    return (
        <>
            <Head>
                <title>RBH Homes Page</title>
                <meta
                    name="description"
                    content="Homes page of Roommate budget helper"
                />
            </Head>
            {homeData &&
            <div className="body flex flex-col text-center">
                <div className="text-2xl p-5">
                    <div className="form-area flex flex-col justify-between items-center ">
                        <div>Update Home</div>
                        <br></br>
                        <form method="post" onSubmit={onUpdateHome}>
                            {/* TODO: Give it a cute image uploader */}
                            {homeData.image &&
                            <div className="relative -z-10">
                                <Image alt="Home Image" src={homeData.image} width="128px" height="128px"/>
                            </div>}                            
                            <input ref={fileRef} type="file" name="image" accept=".png, .jpg" ></input>
                            <br></br>
                            <FieldInput
                                type="text"
                                name="name"
                                defaultValue={homeData.name}
                            />
                            <br></br>
                            <FieldInput
                                type="text"
                                name="address"
                                defaultValue= {homeData.address}
                            />
                            <br></br>
                            <Button
                                classNames="bg-evergreen-80 text-dorian"
                                value="Update"
                                type="submit"
                            />
                            <br></br>
                        </form>
                    </div>
                </div>
                {error&&<p className="text-xl font-light text-red-600">{error}</p>}
            </div>}
        </>
    );
};

export default UpdatePage;