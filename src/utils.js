import { fill, random, map, toNumber, split, forEach, get, size } from 'lodash';

export const emptyInitial = fill(Array(10), fill(Array(10)));

const EMPTY_CELL = { type: null, id: null, oldId: null };

function checkCross(array, id, type) {
    const [outer, inner] = map(split(id, ':'), toNumber);
    let top = get(array, [outer + 1, inner])
    let bottom = get(array, [outer -1, inner])
    let left = get(array, [outer, inner - 1])
    let right = get(array, [outer, inner + 1])

    forEach([top, right, bottom, left], side => {
        if (side && side.type === type) {
            removeCell(array, side.id, side.type)
        }
    })
}

function checkCorners(array, id, type) {
    const [outer, inner] = map(split(id, ':'), toNumber);
    let top = get(array, [outer + 1, inner + 1])
    let bottom = get(array, [outer - 1, inner - 1])
    let left = get(array, [outer + 1, inner - 1])
    let right = get(array, [outer - 1, inner + 1])

    forEach([top, right, bottom, left], side => {
        if (side && side.type === type) {
            removeCell(array, side.id, side.type)
        }
    })
}

export function removeCell(array, id, type) {
    if (!array || !id || !type) return;

    const [outer, inner] = map(split(id, ':'), toNumber);

    array[outer][inner] = EMPTY_CELL;
    checkCross(array, id, type);
    checkCorners(array, id, type);

    return array;
}

export function fillArray(array) {
    const refilled = map(array, (row, outer)=>
        map(row, (cell, inner) => cell && cell.id
        ? ({ ...cell, oldId: null })
        : ({
            type: random(1, 4),
            id : `${outer}:${inner}`,
            oldId: null
          })
        )
    );

    return refilled
}

export function dropDownArray(array) {
    const len = size(array) - 1;

    for (let outer = len; outer >= 0; --outer) {
        for (let inner = len; inner >= 0; --inner) {
            /* is there empty cell? */
            const cell = get(array, [outer, inner]);

            if (outer > 0 && !cell.id) {
                /* empty cell, need to find nearest non-empty cell above */
                const topCell = getNearestNonEmptyCellAbove(array, outer, inner);

                if (topCell) {
                    const [outerTop, _] = map(split(topCell.id, ':'), toNumber);
                    /* need to swap */
                    topCell.id = `${outer}:${inner}`;
                    topCell.oldId = `${outerTop}:${inner}`;
                    topCell.y = Math.abs((outerTop - outer) * 60);
                    array[outer][inner] = topCell;
                    // const newCell = EMPTY_CELL;
                    array[outerTop][inner] = EMPTY_CELL;
                }
            }
        }
    }

    return array;
}

function getNearestNonEmptyCellAbove(array, outer, inner) {
    /* very top row */
    if (outer === 0) {
        return null;
    }

    for (let i = outer; i >= 0; i--) {
        const nextCell = get(array, [i, inner]);

        if (nextCell && nextCell.id) {
            return nextCell;
        }
    }

    /* there is no non-empty cells above */
    return null;
}
