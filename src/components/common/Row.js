const Row = ({ full = true, style = {}, className = '', children }) => (
    <div
        className={`flex ${full ? ' w-full' : 'f1'} f-row ${className}`}
        style={style}
    >
        {children}
    </div>
);

export default Row;