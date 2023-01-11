import Button from "@components/button";
import FieldInput from "@components/fieldinput";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import Image from "next/image";
import { trpc } from "utils/trpc";
import Navbar from "@components/navbar";

const HomesPage: NextPage = () => {

    function showCreateHomeForm() {
        const body = document.getElementById("core");
        if (body != null) {
            body.innerHTML =
                "<div>Create Home</div><br></br><form method='post' onSubmit={createHome}>" +
                "<div><Image src='/images/apartment.png' alt='Home' width='50px' height='50px' /> Upload Home Avatar</div>" +
                "<FieldInput type='text' name='name' placeholder='Home Name' /> <br></br>" +
                "<FieldInput type='text' name='address' placeholder='Location' /> <br></br>" +
                "<FieldInput type='text' name='address' placeholder='' /> <br></br>" +
                "<Button classNames='bg-evergreen-80 text-dorian' value='' type='submit' /> <br></br> </form>";
            // "<div id='homeName'>Home 1</div> <div id='address'>Insert Address Here!</div>";
        }
    }

    return (
        <>
            <Head>
                <title>RBH Homes Page</title>
                <meta
                    name="description"
                    content="Homes page of Roommate budget helper"
                />
            </Head>
            <div className="body flex flex-col text-center">
                <div className="topnav">
                    <a className="center" href="/bill">
                        <Image
                            src="/images/bills.png"
                            alt="Home"
                            width="35px"
                            height="35px"
                        />
                    </a>
                    <a className="center" href="#">
                        <Image
                            src="/images/thing.png"
                            alt="Home"
                            width="35px"
                            height="35px"
                        />
                    </a>
                    <a className="active center" href="/createhome">
                        <Image
                            src="/images/add_home.png"
                            alt="Home"
                            width="60px"
                            height="60px"
                        />
                    </a>
                    <a className="center" href="/notification">
                        <Image
                            src="/images/notifications.png"
                            alt="Home"
                            width="35px"
                            height="35px"
                        />
                    </a>
                    <a className="center" href="/homes">
                        <Image
                            src="/images/user.png"
                            alt="Home"
                            width="35px"
                            height="35px"
                        />
                    </a>
                </div>
                <div id="core">
                    <div className="form-area flex flex-col justify-between items-center ">
                        <div id="top">
                            Welcome to Roomate Budget Helper <a>👋</a>
                        </div>
                        <div className="center">
                            <Image
                                src="/images/logo.png"
                                alt="Home"
                                width="100px"
                                height="100px"
                            />
                        </div>
                        <div>You do not currently belong to any homes...</div>
                        <br></br>
                        <div>
                            Feel free to create one using the plus button, or
                            contact your home creator to invite you!
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomesPage;
