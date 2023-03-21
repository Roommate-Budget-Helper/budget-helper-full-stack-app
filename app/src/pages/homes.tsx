import type { NextPage } from "next";
import Head from "next/head";
import React, { useCallback, useEffect, useMemo } from "react";
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
import FieldInput from "@components/fieldinput";
import { Permission } from "types/permissions";


const HomesPage: NextPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [isLeaveModalOpen, setLeaveModalOpen] = useState<boolean>(false);
    const [isInviteModalOpen, setInviteModalOpen] = useState<boolean>(false);
    const [isEditPermissionsModalOpen, setEditPermissionsModalOpen] = useState<boolean>(false);


    const homes = useHomeContext((s) => s.homes);
    const selectedHome = useHomeContext((s) => s.selectedHome);
    const setSelectedHome = useHomeContext((s) => s.setSelectedHome);
    const refetchHomes = useHomeContext((s) => s.refetchHomes);
    
    const deleteHome = trpc.useMutation(["home.deleteHome"]);
    const leaveHome = trpc.useMutation(["occupies.removeUserFromHome"]);
    const inviteRoommate = trpc.useMutation(["invite.sendInvitation"]);
    const editPermissions = trpc.useMutation(["occupies.UpdatePermissions"]);

    const { data: userPermissions, refetch: getPermissions } = trpc.useQuery(["occupies.getPermissions", {
        homeId: selectedHome ?? ''
    }], {  enabled: false });

    const { data: occupants, refetch: getOccupants} = trpc.useQuery(["occupies.getUsersInHome", {
        homeId: selectedHome ?? ''
    }], { enabled: false})

    const hasPermission = useCallback((permission: Permission) => {
        if(permission === Permission.Owner)
            return !! userPermissions?.find(perm => perm.name === permission);
        return !! userPermissions?.find(perm => ([Permission.Owner, Permission.Admin, permission] as string[]).includes(perm.name));
    }, [userPermissions]);

    const homeData = useMemo(() => {
        return homes.find(home => home.id === selectedHome);
    }, [selectedHome, homes]);

    useEffect(() => {
        if(!selectedHome) return;
        getPermissions();
        getOccupants();
    }, [selectedHome, getPermissions, getOccupants]);

    const handleToggleModal = (setterFunction: React.Dispatch<React.SetStateAction<boolean>>) => () => setterFunction(state => !state);
    
    const handleDelete = async () => {
        setDeleteModalOpen(false);
        if(selectedHome !== null) await deleteHome.mutateAsync({id: selectedHome});
        await refetchHomes();
        setSelectedHome(homes.length > 0 && homes[0] ? homes[0].id : null);        
    };

    const handleLeave = async () => {
        setLeaveModalOpen(false);
        if(selectedHome != null) await leaveHome.mutateAsync({homeId: selectedHome});
        await refetchHomes();
        setSelectedHome(homes.length > 0 && homes[0] ? homes[0].id : null);
    }

    const handleUpdatePermission = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!selectedHome){
            return;
        }

        const form = (event.target as HTMLFormElement);
        const permissionsInputs = form.elements["Permissions"].entries();
        const permissions: Permission[] = []
        for(const [_, input] of permissionsInputs){
            if(input.checked){
                permissions.push(input.value);
            }
        }
       await editPermissions.mutateAsync({
            user: form.elements["User"].value as string,
            homeId: selectedHome,
            permissions,
        });
        setEditPermissionsModalOpen(false);
    }

    const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = (event.target as HTMLFormElement);
        if(!selectedHome) return;
        await inviteRoommate.mutateAsync({
            homeId: selectedHome,
            email: form.elements["email"].value,
        });
        setInviteModalOpen(false);
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
                                {hasPermission(Permission.Invite) && <div className="hover:bg-slate-200 border-b-2 border-black py-2" onClick={handleToggleModal(setInviteModalOpen)}>Invite Roommate</div>}
                                {hasPermission(Permission.Evict) && <div className="hover:bg-slate-200 border-b-2 border-black py-2">Remove Roommate</div>}
                                {hasPermission(Permission.Owner) && <div className="hover:bg-slate-200 border-b-2 border-black py-2" onClick={handleToggleModal(setEditPermissionsModalOpen)}>Edit Permissions</div>}
                                {hasPermission(Permission.Edit) && <div className="hover:bg-slate-200 border-b-2 border-black py-2"><Link href="/updatehome">Update Home</Link> </div>}
                                <div className="hover:bg-slate-200 border-b-2 border-black py-2" onClick={handleToggleModal(setLeaveModalOpen)}>Leave Home</div>
                                {hasPermission(Permission.Delete) &&<div className="hover:bg-slate-200 border-b-2 border-black py-2" onClick={handleToggleModal(setDeleteModalOpen)}>Delete Home</div>}
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
            <Modal show={isEditPermissionsModalOpen} onHide={handleToggleModal(setEditPermissionsModalOpen)}>
                <Modal.Header onHide={handleToggleModal(setEditPermissionsModalOpen)}>
                    Set User Permissions 
                </Modal.Header>
                <form onSubmit={handleUpdatePermission}>
                <Modal.Body>
                    <p>User: <select name="User">
                        {occupants?.map(occupant => (
                        <option 
                            key={occupant.user.id} 
                            value={occupant.user.id}

                         >{occupant.user.name}</option>))}
                    </select></p>
                    {Object.values(Permission).map(permission => (
                        <div key={permission}>
                            <input
                                name="Permissions"
                                value={permission} 
                                type="checkbox" />
                            {permission}
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button classNames="bg-red-600" onClick={handleToggleModal(setEditPermissionsModalOpen)} value="Cancel"/>
                    <Button classNames="bg-evergreen-80" type="submit" value="Submit" />
                </Modal.Footer>
                </form>
            </Modal>
            <Modal show={isInviteModalOpen} onHide={handleToggleModal(setInviteModalOpen)}>
                <Modal.Header onHide={handleToggleModal(setInviteModalOpen)}>
                   Invite Roommate
                </Modal.Header>
                <form onSubmit={handleInvite}>
                    <Modal.Body>
                        <FieldInput
                        name="email"
                        placeholder="email"/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button classNames="bg-red-600" onClick={handleToggleModal(setLeaveModalOpen)} value="Cancel"/>
                        <Button classNames="bg-evergreen-80" value="Submit" type="submit" />
                    </Modal.Footer> 
                </form>
            </Modal>
        </>
    );
};


export default HomesPage;
