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

const Navbar = ({ current = null, onChange = () => { }, tabs = [], className = "", disabled = [], labels = {} }) => {
    return (
        <div className={`Navbar flex ui-section mb-5 p-5 ${className}`}>
            {tabs.map(t => {
                const isDisabled = disabled.includes(t);
                const onClick = isDisabled ? () => { } : () => onChange(t);
                return (
                    <TabLink
                        key={t}
                        isDisabled={isDisabled}
                        isActive={current === t}
                        onClick={onClick}
                    >
                        {labels[t] || t}
                    </TabLink>
                );
            })}
        </div>
    );
};

export default Navbar;