const Col = ({ full = true, style = {}, className = '', children }) => (
    <div
        className={`flex ${full ? ' w-full' : 'f1'} f-col ${className}`}
        style={style}
    >
        {children}
    </div>
);

export default Col;