import { CELL_SIZE, CELL_NUMBERS, CELL_MAP } from "enums/sectorMap";

export const coordsToSector = (x, y, { size = CELL_SIZE, num = CELL_NUMBERS } = {}) => {
    const i = Math.floor(y / size);
    const j = Math.floor(x / size);
    const il = CELL_MAP[i];
    const jl = j + 1;
    return { i, j, il, jl, id: `${il}_${jl}` };
};