import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import { LoadingPage } from '@components/loadingspinner';

export { RouteGuard };
interface RouteGuardProps{
    children: any;
}

function RouteGuard({ children } : RouteGuardProps) {
    const router = useRouter();
    const session = useSession();
    const [allowed, setAllowed] = useState(false);
    const publicPaths = ["login", "register", "forgot_password", "/"];
    const path = router.asPath === "/" ? "/" : router.asPath.split("/")[1];

    useEffect(() => {
        if(session.status === "unauthenticated" && path && !publicPaths.includes(path)){
            setAllowed(false);
            router.push("/login");
        } if(session.status === "authenticated" && path && publicPaths.includes(path)){
            setAllowed(true);
            router.push("/homes");
        } else{
            setAllowed(true);
        }
    }, [session.status, path, router])


    if (path && !publicPaths.includes(path)) {
        if (session.status === "loading" || session.status === 'unauthenticated') {
            return <LoadingPage />;
        }
    }
    return (allowed && children);
}