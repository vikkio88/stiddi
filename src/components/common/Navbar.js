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

const Navbar = ({ current = null, onChange = () => { }, tabs = [], className = "" }) => {
    return (
        <div className={`Navbar flex ui-section mb-5 p-5 ${className}`}>
            {tabs.map(t => (
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