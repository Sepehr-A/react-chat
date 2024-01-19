import {Link} from "react-router-dom";

export const formatTimestamp = (timestampMilliseconds) => {
    const date = new Date(timestampMilliseconds);
    return `${date.getHours()}:${date.getMinutes()}`;
};


export const NavLink = ({to, currentPath, children}) => {
    const isActive = currentPath === to;
    return (
        <Link to={to} className={`nav-link ${isActive ? 'active-nav-link' : ''}`}>
            {children}
        </Link>
    );
};
