import { NextPage } from "next";
import Head from "next/head";
import Navbar from "@components/navbar";
import { signOut } from "next-auth/react";
import Button from "@components/button";
import FieldInput, { ImageFileFieldInput } from "@components/fieldinput";
import Image from "next/image";
import { trpc } from "utils/trpc";
import { useRef } from "react";


const UserPage: NextPage = () => {
    const fileRef = useRef<HTMLInputElement>(null);
    const getPresignedURL = trpc.useMutation(["upload.getPresignedURL"]);
    const setProfileImage = trpc.useMutation(["user.setProfileImage"]);
    const {data: profileImageURL, refetch: refetchProfileImage}= trpc.useQuery(["user.getProfileImage"]);
    const setPaymentMethods = trpc.useMutation(["user.setPaymentMethods"]);
    const {data: paymentMethods, refetch: refetchPaymentMethods} = trpc.useQuery(["user.getPaymentMethods"]);
    const logOut = () => {
        signOut();
    };

    const onUpdateNotificationSettings = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        // TODO: Set notification settings for email here 
    };

    const onUpdatePaymentMethods = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        setPaymentMethods.mutateAsync({
            paymentMethods: [
                form.paymentMethod1.value,
                form.paymentMethod2.value,
                form.paymentMethod3.value
            ]
        });
        await refetchPaymentMethods();
    };

    const onUploadProfileImage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const fileList = fileRef.current?.files
        if(!fileList){
            return;
        }
        const imageFile = fileList[0];
        let key = null;
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

        await setProfileImage.mutateAsync({
            image: key,
        });
        refetchProfileImage();
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
            <Navbar />
            <div className="body flex flex-col text-center text-2xl p-5">
                <h1 className="text-5xl my-5 font-bold text-evergreen-100">
                    Settings
                </h1>
                <hr></hr>

                <div className="form-area flex flex-col justify-between items-center">
                    <div className="py-5 px-10 rounded-xl hover:shadow-xl">
                        <form
                            onSubmit={onUpdateNotificationSettings}
                            className="flex flex-col py-5"
                        >
                            <h3 className="text-xl font-bold text-evergreen-100">
                                Notifications
                            </h3>
                            {/* TODO: Insert Checkboxes for notifications here */}
                            <Button
                                classNames="bg-evergreen-80 text-dorian"
                                value="Update Settings"
                                type="submit"
                            />
                        </form>
                        <hr></hr>
                        <form
                            onSubmit={onUpdatePaymentMethods}
                            className="flex flex-col py-5"
                        >
                            <h3 className="text-xl font-bold text-evergreen-100">
                                Set Payment Methods
                            </h3>
                            {paymentMethods &&
                                [...Array(3)].map((_, i) => {
                                    const paymentMethod =
                                        paymentMethods.paymentMethods[i];
                                    return paymentMethod &&
                                        paymentMethod.length > 0 ? (
                                        <FieldInput
                                            name={`paymentMethod${i + 1}`}
                                            type="text"
                                            value={paymentMethod}
                                            placeholder={paymentMethod}
                                            key={i}
                                        />
                                    ) : (
                                        <FieldInput
                                            name={`paymentMethod${i + 1}`}
                                            type="text"
                                            placeholder="Enter payment method here"
                                            key={i}
                                        />
                                    );
                                })}
                            <Button
                                classNames="bg-evergreen-80 text-dorian"
                                value="Update Payment"
                                type="submit"
                            />
                        </form>
                        <hr></hr>
                        <form
                            onSubmit={onUploadProfileImage}
                            className="flex flex-col py-5"
                        >
                            <h3 className="text-xl font-bold text-evergreen-100">
                                Upload Profile Picture
                            </h3>
                            {profileImageURL && (
                                <div className="sm:bg-transparent md:bg-slate-600 items-center mx-10 my-5 rounded-xl flex flex-col sm:text-black md:text-dorian text-base justify-between">
                                    <div className="rounded-full bg-evergreen-80 w-24 h-24 flex flex-col items-center justify-center">
                                        <Image
                                            src={profileImageURL}
                                            alt="Profile Image"
                                            width="64px"
                                            height="64px"
                                        />
                                    </div>
                                </div>
                            )}
                            <ImageFileFieldInput
                                fileRef={fileRef}
                                title="Upload a profile image"
                            />
                            <Button
                                classNames="bg-evergreen-80 text-dorian"
                                value="Upload"
                                type="submit"
                            />
                        </form>
                        <hr></hr>
                        <h3 className="py-5 text-xl font-bold text-evergreen-100">
                            Sign out of your account
                        </h3>
                        <Button
                            onClick={logOut}
                            classNames="bg-evergreen-80 text-dorian"
                            value="Sign Out"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserPage;
