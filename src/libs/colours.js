export const hashHex = hex => {
    return `#${hex.toString(16).padStart(6, '0')}`;
};
