import Image from "next/image";
import Link from "next/link";

// TODO: WIP fix styles
const Navbar: React.FC = () => {
    return (
        <div className="overflow-hidden rounded-b-lg p-4 sm:bottom-0 sm:w-full sm:fixed ">
        <Link href="/bills">
            <a className="w-1/5 m-auto h-full float-left bg-gray-700 text-white text-center p-3 no-underline text-lg hover:bg-gray-100 hover:text-black">
                <Image
                    src="/images/bills.png"
                    alt="Home"
                    width="35px"
                    height="35px"
                />
            </a>
        </Link>
        <Link href="#">
            <a className="w-1/5 m-auto h-full float-left bg-gray-700 text-white text-center p-3 no-underline text-lg hover:bg-gray-100 hover:text-black">
                <Image
                    src="/images/thing.png"
                    alt="Home"
                    width="35px"
                    height="35px"
                />
            </a>
        </Link>
        <Link href="/createhome">
            <a className="text-white bg-green-400 w-1/5 m-auto h-full float-left text-center p-3 no-underline text-lg hover:bg-gray-100 hover:text-black">
                <Image
                    src="/images/add_home.png"
                    alt="Home"
                    width="60px"
                    height="60px"
                />
            </a>
        </Link>
        <Link href="/notification">
            <a className="w-1/5 m-auto h-full float-left bg-gray-700 text-white text-center p-3 no-underline text-lg hover:bg-gray-100 hover:text-black">
                <Image
                    src="/images/notifications.png"
                    alt="Home"
                    width="35px"
                    height="35px"
                />
            </a>
        </Link>
        <Link href="/homes">
            <a className="w-1/5 m-auto h-full float-left bg-gray-700 text-white text-center p-3 no-underline text-lg hover:bg-gray-100 hover:text-black">
                <Image
                    src="/images/user.png"
                    alt="Home"
                    width="35px"
                    height="35px"
                />
            </a>
        </Link>
    </div>
    );
};

export default Navbar;
