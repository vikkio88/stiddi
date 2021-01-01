import './styles/Button.css';

const VARIANTS = {
    RED: 'red',
    BLUE: 'blue',
    GREEN: 'green',
    EMPTY_GREEN: 'empty_green',
    WHITE: 'white',
    TRANSPARENT: 'transparent'
};
const Button = ({ onClick = () => { }, style = {}, label, disabled, variant, className = '', children }) => {
    variant = Object.values(VARIANTS).includes(variant) ? variant : null;

    return (
        <button
            className={`Button ${variant ? `Button-variant-${variant}` : ''} ${className}`}
            onClick={onClick}
            disabled={disabled}
            style={style}
        >
            {label || children}
        </button>
    );
};

Button.Variants = VARIANTS;

export default Button;