import Image from "next/image";

// TODO: WIP fix styles
const Navbar: React.FC = () => {
    return (
        <div className="overflow-hidden rounded-b p-4">
            <a className="center" href="/bill">
                <Image
                    src="/images/bills.png"
                    alt="Home"
                    width="35px"
                    height="35px"
                />
            </a>
            <a className="center" href="#">
                <Image
                    src="/images/thing.png"
                    alt="Home"
                    width="35px"
                    height="35px"
                />
            </a>
            <a className="active center">
                <Image
                    src="/images/add_home.png"
                    alt="Home"
                    width="60px"
                    height="60px"
                />
            </a>
            <a className="center" href="/notification">
                <Image
                    src="/images/notifications.png"
                    alt="Home"
                    width="35px"
                    height="35px"
                />
            </a>
            <a className="center" href="/homes">
                <Image
                    src="/images/user.png"
                    alt="Home"
                    width="35px"
                    height="35px"
                />
            </a>
        </div>
    );
};

export default Navbar;
