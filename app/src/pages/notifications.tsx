import Navbar from "@components/navbar";
import { NextPage } from "next"
import Head from "next/head"
import { trpc } from "utils/trpc";
import Image from "next/image";
import Button from "@components/button";
import { useHomeContext } from "@stores/HomeStore";

const NotificationsPage: NextPage = () => {
    
    const { data: invitations, refetch: refetchInvitations } = trpc.useQuery(["invite.getInvitations"]);
    
    const acceptInvite = trpc.useMutation(["invite.acceptInvitation"]);
    const refetchHomes = useHomeContext(home => home.refetchHomes);

    const handleInviteSelection = (accepted: boolean, homeId: string) => async () => {
        await acceptInvite.mutateAsync({
            homeId,
            accepted,
        });
        await refetchInvitations();
        await refetchHomes();
    }

    return (
    <>
        <Head>
            <title>RBH Notifications</title>
                <meta
                    name="description"
                    content="Notifications"
                />
        </Head>
        <div className="body flex flex-col text-center">
            <Navbar />
            <div className="text-2xl p-5">
                <h1 className="text-left font-bold">Notifications</h1>
                <hr/>
                <h2 className="font-bold">Invitations</h2>
                {invitations && invitations.length > 0 ? <div>
                    {invitations.map(home => 
                    <div key={home.id} className="bg-slate-600 mx-10 my-10 p-3 rounded-xl text-dorian text-base">
                        {home.image && <Image src={home.image} alt="home logo" width="128px" height="128px"/>}
                        <p>Name: {home.name}</p>
                        <p>Address: {home.address}</p>
                        <div className="flex space-x-5">
                            <Button classNames="bg-evergreen-80" value="Accept" onClick={handleInviteSelection(true, home.id)}/>
                            <Button classNames="bg-red-600" value="Reject" onClick={handleInviteSelection(false, home.id)}/>
                        </div>
                    </div>)}
                </div>:<div>
                You have no invitations.
                </div>
                }
                <hr/>
                <h2 className="font-bold">Reminders</h2>
                <div> You have no reminders.</div>
            </div>
        </div>
    </>);
}

export default NotificationsPage