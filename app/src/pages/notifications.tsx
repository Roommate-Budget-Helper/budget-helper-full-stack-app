import Navbar from "@components/navbar";
import { NextPage } from "next"
import Head from "next/head"
import { trpc } from "utils/trpc";
import Image from "next/image";
import Button from "@components/button";
import { useHomeContext } from "@stores/HomeStore";
import LoadingSpinner from "@components/loadingspinner";

const NotificationsPage: NextPage = () => {
    
    const { data: invitations, refetch: refetchInvitations, isLoading: invitationsLoading } = trpc.useQuery(["invite.getInvitations"]);
    
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
                <meta name="description" content="Notifications" />
            </Head>
            <Navbar />
                <div className="body flex flex-col text-center text-2xl p-5">
                    <h1 className="text-5xl my-5 font-bold text-evergreen-100">
                        Notifications
                    </h1>
                    <hr/>
                    <h2 className="my-2 font-bold text-evergreen-100">
                        Invitations
                    </h2>
                    {!invitationsLoading && invitations && invitations.length > 0 ? (
                        <div>
                            {invitations.map((home) => (
                                <div
                                    key={home.id}
                                    className="bg-slate-600 mx-10 mb-10 p-3 rounded-xl text-dorian text-base"
                                >
                                    {home.image && (
                                        <Image
                                            src={home.image}
                                            alt="home logo"
                                            width="128px"
                                            height="128px"
                                        />
                                    )}
                                    <p>Name: {home.name}</p>
                                    <p>Address: {home.address}</p>
                                    <div className="flex space-x-5 justify-center my-2">
                                        <Button
                                            classNames="bg-evergreen-80"
                                            value="Accept"
                                            onClick={handleInviteSelection(
                                                true,
                                                home.id
                                            )}
                                        />
                                        <Button
                                            classNames="bg-red-600"
                                            value="Reject"
                                            onClick={handleInviteSelection(
                                                false,
                                                home.id
                                            )}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>You have no invitations.</div>
                    )}
                    {invitationsLoading && <LoadingSpinner/> }
                    <hr/>
                    <h2 className="my-1 font-bold text-evergreen-100">
                        Reminders
                    </h2>
                    <div> You have no reminders.</div>
                </div>
        </>
    );
}

export default NotificationsPage