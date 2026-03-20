import { NavLink } from "react-router-dom";
import style from "../NavBar.module.css";

type Props = {
    sectionName: string;
    image: string;
    to: string;
};

export default function NavItem({ sectionName, image, to }: Props) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                isActive ? `${style.navItem} ${style.active}` : style.navItem
            }
        >
            <img src={image} alt="icon" />
            <h6>{sectionName}</h6>
        </NavLink>
    );
}