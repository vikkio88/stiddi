import { CELL_SIZE, CELL_NUMBERS, CELL_MAP } from "enums/sectorMap";

export const coordsToSector = (x, y, { size = CELL_SIZE, num = CELL_NUMBERS } = {}) => {
    const i = Math.floor(y / size);
    const j = Math.floor(x / size);

    return { i, j, il: CELL_MAP[i], jl: j + 1 };
};