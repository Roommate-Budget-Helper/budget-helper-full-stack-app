import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";

export { RouteGuard };
interface RouteGuardProps{
    children: any;
}

function RouteGuard({ children } : RouteGuardProps) {
    const router = useRouter();
    const session = useSession();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const publicPaths = ["login", "register", "forgot_password"];
        const path = router.asPath.split('/')[1];
        if(session.status === "unauthenticated" && path && !publicPaths.includes(path)){
            setAllowed(false);
            router.push("/login");
        } if(session.status === "authenticated" && path && publicPaths.includes(path)){
            setAllowed(true);
            router.push("/homes");
        } else{
            setAllowed(true);
        }
    }, [session.status, router.asPath])

    return (allowed && children);
}