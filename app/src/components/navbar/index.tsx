import Image from "next/image";
import Link from "next/link";
import Icon from '@mdi/react';
import { mdiCashMultiple, mdiFileDocumentOutline, mdiBellOutline, mdiAccountCircleOutline, mdiPlus } from '@mdi/js';
import { useHomeContext } from "@stores/HomeStore";
import { useState } from "react";


const navItemStyle = "h-full py-4 flex-grow flex items-start justify-center text-white text-center p-3 no-underline text-lg hover:text-evergreen-80";
// TODO: WIP fix styles
const Navbar: React.FC = () => {
    const selectedHome = useHomeContext(s => s.selectedHome);
    const homes = useHomeContext(s => s.homes);
    const setSelectedHome = useHomeContext(s => s.setSelectedHome);
    const [isSelecting, setSelecting] = useState<boolean>(false);

    const onItemClicked = (id: string) => (event: React.MouseEvent) => {
        event.preventDefault();
        if(!isSelecting){
            setSelecting(true);
            return;
        }
        setSelectedHome(id);
        setSelecting(false);
    }
    return (
        <div className="overflow-show rounded-b-lg p-4 flex">
        <Link href="/bills">
            <a className={navItemStyle+ " bg-gray-700"}>
                <Icon path={mdiCashMultiple} size="35px" />
            </a>
        </Link>
        <Link href="#">
            <a className={navItemStyle+ " bg-gray-700"}>
              <Icon path={mdiFileDocumentOutline} size="35px" />
            </a>
        </Link>
        <div className="bg-gray-700 relative h-12 w-24">
            {homes.map(home => (
            <div 
                key={home.id}
                style={{
                    zIndex: home.id == selectedHome ? 200 : 100,
                    position: isSelecting ? "static" : "absolute"
                }} 
                className="rounded-full bg-slate-300 w-24 h-24 flex items-center justify-center" 
                onClick={onItemClicked(home.id)}    
            >
                {home.image ?<Image src={home.image} alt="home icon" width="64px" height="64px" />:<p>T</p>}
            </div>))}
            <Link href="/createhome" style={{
                zIndex: 100,
                position: isSelecting ? "static" : "absolute"
            }}>
                <a className="w-100 h-full flex-grow flex items-start justify-center text-white text-center no-underline text-lg hover:text-evergreen-80">
                <div className="bg-dorian text-slate-600 border-solid border-slate-600 border-2 w-24 h-24 flex justify-center items-center rounded-full">
                    <Icon path={mdiPlus} size={1} />
                </div>
                </a>
            </Link>
        </div>
        <Link href="/notification">
            <a className={navItemStyle+ " bg-gray-700"}>
                <Icon path={mdiBellOutline} size="35px" />
            </a>
        </Link>
        <Link href="/homes">
            <a className={navItemStyle+ " bg-gray-700"}>
                <Icon path={mdiAccountCircleOutline} size="35px" />
            </a>
        </Link>
    </div>
    );
};

export default Navbar;
