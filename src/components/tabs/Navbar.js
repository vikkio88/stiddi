import "./styles/Navbar.css";

const TabLink = ({ onClick, children, isActive }) => {
    return (
        <div
            className={`TabLink flex f-ac f-jc ${isActive ? 'active-tab-link' : ''}`}
            onClick={!isActive ? onClick : () => { }}
        >
            {children}
        </div>
    );
};


const Navbar = ({ onChange }) => {
    return (
        <div className="flex ui-section mb-5 p-5">
            <TabLink isActive>Navigation</TabLink>
            <TabLink>Maps</TabLink>
        </div>
    );
};

export default Navbar;