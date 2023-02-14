import type { NextPage } from "next";
import Head from "next/head";
import React, { useMemo } from "react";
import Image from "next/image";
import Navbar from "@components/navbar";
import { useState } from 'react';
import { useHomeContext } from "@stores/HomeStore";
import Icon from "@mdi/react";
import { mdiDotsVertical } from "@mdi/js";
import Modal from '@components/modal';
import Button from '@components/button';
import { trpc } from "utils/trpc";
import Link from "next/link";


const HomesPage: NextPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [isLeaveModalOpen, setLeaveModalOpen] = useState<boolean>(false);

    const homes = useHomeContext((s) => s.homes);
    const selectedHome = useHomeContext((s) => s.selectedHome);
    const setSelectedHome = useHomeContext((s) => s.setSelectedHome);
    const refetchHomes = useHomeContext((s) => s.refetchHomes);
    
    const deleteHome = trpc.useMutation(["home.deleteHome"]);
    const leaveHome = trpc.useMutation(["occupies.removeUserFromHome"]);

    const homeData = useMemo(() => {
        return homes.find(home => home.id === selectedHome);
    }, [selectedHome, homes]);

    const handleToggleModal = (setterFunction: React.SetStateAction<boolean>) => () => setterFunction(state => !state);
    
    const handleDelete = async () => {
        setDeleteModalOpen(false);
        if(selectedHome != null) await deleteHome.mutateAsync({id: selectedHome});
        await refetchHomes();
        setSelectedHome(homes.length > 0 && homes[0] ? homes[0].id : null);        
    };

    const handleLeave = async () => {
        setLeaveModalOpen(false);
        if(selectedHome != null) await leaveHome.mutateAsync({homeId: selectedHome});
        await refetchHomes();
        setSelectedHome(homes.length > 0 && homes[0] ? homes[0].id : null);
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
                <Navbar />
                <div className="text-xl p-5">
                    {selectedHome && homeData ? 
                    <div className="body flex flex-col text-center">
                        <div 
                        className="self-end mr-6 rounded-full hover:bg-slate-200 w-12 h-12 flex items-center relative"
                        onClick={handleToggleModal(setMenuOpen)}>
                            <Icon path={mdiDotsVertical} size={1} className="mx-auto"/>
                            {isMenuOpen && <div className="absolute top-10 right-10 w-96 bg-slate-50">
                                <div className="hover:bg-slate-200 border-b-2 border-black py-2">Invite Roommate</div>
                                <div className="hover:bg-slate-200 border-b-2 border-black py-2">Remove Roommate</div>
                                <div className="hover:bg-slate-200 border-b-2 border-black py-2">Edit Permissions</div>
                                <div className="hover:bg-slate-200 border-b-2 border-black py-2"><Link href="/updatehome">Update Home</Link> </div>
                                <div className="hover:bg-slate-200 border-b-2 border-black py-2" onClick={handleToggleModal(setLeaveModalOpen)}>Leave Home</div>
                                <div className="hover:bg-slate-200 border-b-2 border-black py-2" onClick={handleToggleModal(setDeleteModalOpen)}>Delete Home</div>
                            </div>}
                        </div>
                        <div className="text-xl p-5">
                            <div className="form-area flex flex-col justify-between items-center">
                                {homeData.image &&
                                <div className="relative -z-10">
                                    <Image alt="Home Image" src={homeData.image} width="128px" height="128px"/>
                                </div>}
                                <div className="p-5">{homeData.name}</div>
                                <div className="p-1 text-sm">📍Address: {homeData.address}</div>
                                <div className="p-5" >This is the roommates cost chart</div>
                                <br></br>
                                <div>
                                    This Month&apos;s Spendings
                                </div>
                            </div>
                        </div>
                        {error&&<p className="text-xl font-light text-red-600">{error}</p>}
                    </div> :
                    <div className="form-area flex flex-col justify-between items-center">
                        <div className="p-5">
                            Welcome to Roomate Budget Helper <a className="text-5xl">👋</a>
                        </div>
                        <div className="w-1/5 m-auto h-full p-3 relative -z-10">
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
                            Feel free to create more homes using the plus button, or
                            contact your home creator to invite you!
                        </div>
                        {error&&<p className="text-xl font-light text-red-600">{error}</p>}
                    </div>}
                </div>              
            </div>
            <Modal show={isDeleteModalOpen} onHide={handleToggleModal(setDeleteModalOpen)}>
                <Modal.Header onHide={handleToggleModal(setDeleteModalOpen)}>
                    Delete Home 
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this home? Deleting will remove this home for all occupants, and cannot be undone.</Modal.Body>
                <Modal.Footer>
                    <Button classNames="bg-red-600" onClick={handleToggleModal(setDeleteModalOpen)} value="Cancel"/>
                    <Button classNames="bg-evergreen-80" onClick={handleDelete} value="Delete Permanently" />
                </Modal.Footer> 
            </Modal> 
            <Modal show={isLeaveModalOpen} onHide={handleToggleModal(setLeaveModalOpen)}>
                <Modal.Header onHide={handleToggleModal(setLeaveModalOpen)}>
                    Leave Home 
                </Modal.Header>
                <Modal.Body>Are you sure you want to leave this home? Leaving will remove yourself from this home, and cannot be undone without another user to invite you back.</Modal.Body>
                <Modal.Footer>
                    <Button classNames="bg-red-600" onClick={handleToggleModal(setLeaveModalOpen)} value="Cancel"/>
                    <Button classNames="bg-evergreen-80" onClick={handleLeave} value="Leave" />
                </Modal.Footer> 
            </Modal>   

        </>
    );
};


export default HomesPage;
