import Image from "next/image";
import Link from "next/link";
import Icon from '@mdi/react';
import { mdiCashMultiple, mdiFileDocumentOutline, mdiBellOutline, mdiAccountCircleOutline, mdiPlus } from '@mdi/js';
import { useHomeContext } from "@stores/HomeStore";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { IconProps } from "@mdi/react/dist/IconProps";


const navItemStyle = "h-full py-4 flex-grow flex items-start justify-center text-white text-center p-3 no-underline text-lg hover:text-evergreen-80";
// TODO: WIP fix styles

const WrappedIcon = (props: {
    activepath: string,
    currentpath: string,
}&IconProps) => {
    const classes = () => {
        if(props.activepath === props.currentpath){
            return "text-evergreen-80";
        }
    }
    return <Icon {...props} className={classes()}/>
}
const Navbar: React.FC = () => {
    const router = useRouter();
    const selectedHome = useHomeContext(s => s.selectedHome);
    const homes = useHomeContext(s => s.homes);
    const setSelectedHome = useHomeContext(s => s.setSelectedHome);
    const clearSelectedHome = useHomeContext((s) => s.clearSelectedHome);
    const [isSelecting, setSelecting] = useState<boolean>(false);
    const onItemClicked = (id: string) => (event: React.MouseEvent) => {
        event.preventDefault();
        if(router.asPath !== "/homes") router.push("/homes")
        if(!isSelecting){
            setSelecting(true);
            return;
        }
        setSelectedHome(id);
        setSelecting(false);
    }


    return (
        <div className="overflow-show rounded-b-lg flex">
        <Link href="/billing">
            <a className={navItemStyle+ " bg-gray-700"}>
                <WrappedIcon activepath="/billing" currentpath={router.asPath} path={mdiCashMultiple} size="35px" />
            </a>
        </Link>
        <Link href="/history">
            <a className={navItemStyle+ " bg-gray-700"}>
              <WrappedIcon activepath="/history" currentpath={router.asPath} path={mdiFileDocumentOutline} size="35px" />
            </a>
        </Link>
        <div id="Home" className="bg-gray-700 relative h-12 w-24">
            {homes.map(home => (
            <div id={home.name}
                key={home.id}
                style={{
                    zIndex: home.id === selectedHome ? 200 : 100,
                    position: isSelecting ? "static" : "absolute"
                }} 
                className="rounded-full bg-slate-300 w-24 h-24 flex items-center justify-center" 
                onClick={onItemClicked(home.id)}    
            >
                {home.image ?<Image className="rounded-full" src={home.image} alt="home icon" width="96px" height="96px" />:<p>{home.name.split(" ").reduce((a,c) => {
                    a += c[0];
                    return a;
                }, "")}</p>}
            </div>))}
            <Link href="/createhome" style={{
                zIndex: 100,
                position: isSelecting ? "static" : "absolute"
            }}>
                <a className="w-100 h-full flex-grow flex items-start justify-center text-white text-center no-underline text-lg hover:text-evergreen-80">
                <div id="createHome" className="bg-dorian text-slate-600 border-solid border-slate-600 border-2 w-24 h-24 flex justify-center items-center rounded-full">
                    <Icon path={mdiPlus} size={1} />
                </div>
                </a>
            </Link>
        </div>
        <Link href="/notifications">
            <a className={navItemStyle+ " bg-gray-700"}>
                <WrappedIcon activepath="/notifications" currentpath={router.asPath} path={mdiBellOutline} size="35px" />
            </a>
        </Link>
        <Link href="/user" >
            <a className={navItemStyle+ " bg-gray-700"} >
                <WrappedIcon activepath="/user" currentpath={router.asPath} path={mdiAccountCircleOutline} size="35px" />
            </a>
        </Link>
    </div>
    );
};

export default Navbar;
