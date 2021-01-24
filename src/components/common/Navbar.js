import "./styles/Navbar.css";

const TabLink = ({ onClick, children, isActive, isDisabled = false }) => {
    return (
        <div
            className={`
            TabLink
            flex
            f-ac f-jc
            ${isActive ? 'active-tab-link' : ''}
            ${isDisabled ? 'disabled-tab-link' : ''}
            `}
            onClick={!isActive ? onClick : () => { }}
        >
            {children}
        </div>
    );
};

const Navbar = ({ current = null, onChange = () => { }, tabs = [], className = "", disabled = [] }) => {
    return (
        <div className={`Navbar flex ui-section mb-5 p-5 ${className}`}>
            {tabs.map(t => (
                <TabLink
                    key={t}
                    isDisabled={disabled.includes(t)}
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