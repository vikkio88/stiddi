import './styles/Button.css';

const VARIANTS = {
    RED: 'red',
    BLUE: 'blue',
    GREEN: 'green',
    WHITE: 'white',
    TRANSPARENT: 'transparent'
};
const Button = ({ onClick = () => { }, label, disabled, variant, children }) => {
    variant = Object.values(VARIANTS).includes(variant) ? variant : null;

    return (
        <button
            className={`Button ${variant ? `Button-variant-${variant}` : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {label || children}
        </button>
    );
};

Button.Variants = VARIANTS;

export default Button;