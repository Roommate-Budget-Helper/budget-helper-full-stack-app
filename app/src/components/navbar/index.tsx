import Image from "next/image";
import Link from "next/link";
import Icon from '@mdi/react';
import { mdiCashMultiple, mdiFileDocumentOutline, mdiBellOutline, mdiAccountCircleOutline, mdiPlus } from '@mdi/js';


const navItemStyle = "w-1/5 m-auto h-full float-left flex items-start justify-center text-white text-center p-3 no-underline text-lg hover:text-evergreen-80";
// TODO: WIP fix styles
const Navbar: React.FC = () => {
    return (
        <div className="overflow-show rounded-b-lg p-4 sm:bottom-0 sm:w-full sm:fixed">
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
        <Link href="/createhome">
            <a className={"bg-white " +navItemStyle}>
             <div className="bg-dorian text-slate-600 border-solid border-slate-600 border-2 w-24 h-24 sm:w-16 sm:h-16 flex justify-center items-center rounded-full">
                <Icon path={mdiPlus} size={1} />
             </div>
            </a>
        </Link>
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
