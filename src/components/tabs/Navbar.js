import { TABS } from "enums/ui";
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

const Navbar = ({ current, onChange }) => {
    return (
        <div className="Navbar flex ui-section mb-5 p-5">
            {Object.values(TABS).map(t => (
                <TabLink
                    key={t}
                    isActive={current === t}
                    onClick={() => onChange(t)}
                >
                    {t}
                </TabLink>
            ))}
        </div>
    );
};

export default Navbar;