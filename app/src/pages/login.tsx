import Button from "@components/button";
import FieldInput from "@components/fieldinput";
import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import React, { useState } from "react";


const LoginPage: NextPage = () => {
    const [username, setUsername]= useState<string>("");
    const [password, setPassword] = useState<string>("");
    return (<>
        <Head>
            <title>RBH Login</title>
            <meta
                name="description"
                content="Login page of Roommate Budget Helper" />
        </Head>
        <div className="body flex flex-col text-center">
            <div className="headertext-center pt-4">
                <h1 className="text-5xl font-bold text-evergreen-100">Welcome Back 👋</h1>
                <p className="text-xl font-light">We are excited to have you back but to get started please login!</p>
            </div>
            <div className="form-area flex flex-col justify-between items-center ">
                <FieldInput 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.currentTarget.value)}
                    placeholder="Username or Email" />
                 <FieldInput 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.currentTarget.value)}
                    placeholder="Password" />
                <Button 
                    classNames="bg-evergreen-80 text-dorian"
                    value="Login" 
                    type="button" />
            </div>
            <div className="divider my-4">
                <hr/>
            </div>
            <div className="providers">
                <Button
                    classNames="bg-dorian text-black"
                    value="Google"
                    type="button" />
            </div>
            <div className="actions">
                <p>Don't have an account? &nbsp;
                    <Link href="#"> 
                        <a className="text-evergreen-80">Sign Up</a>
                    </Link>
                </p>
                <p>Forgot your password? &nbsp;
                    <Link href="#">
                        <a className="text-evergreen-80">
                            Reset
                        </a>
                     </Link>
                </p>
            </div>
        </div>
    </>);
};

export default LoginPage;