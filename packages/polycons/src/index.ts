const neutralPairs = [
  ["#FF5C16", "#FCFCFC"],
  ["#FF5C16", "#131416"],
  ["#D075FF", "#FCFCFC"],
  ["#D075FF", "#131416"],
  ["#BAF24A", "#FCFCFC"],
  ["#BAF24A", "#131416"],
  ["#89B0FF", "#FCFCFC"],
  ["#89B0FF", "#131416"],
  ["#FCFCFC", "#FF5C16"],
  ["#131416", "#FF5C16"],
  ["#FCFCFC", "#D075FF"],
  ["#131416", "#D075FF"],
  ["#FCFCFC", "#BAF24A"],
  ["#131416", "#BAF24A"],
  ["#FCFCFC", "#89B0FF"],
  ["#131416", "#89B0FF"],
] as const;

const tonalPairs = [
  ["#FFA680", "#FF5C16"],
  ["#661800", "#FF5C16"],
  ["#EAC2FF", "#D075FF"],
  ["#3D065F", "#D075FF"],
  ["#E5FFC3", "#BAF24A"],
  ["#013330", "#BAF24A"],
  ["#CCE7FF", "#89B0FF"],
  ["#190066", "#89B0FF"],
  ["#FF5C16", "#FFA680"],
  ["#FF5C16", "#661800"],
  ["#D075FF", "#EAC2FF"],
  ["#D075FF", "#3D065F"],
  ["#BAF24A", "#E5FFC3"],
  ["#BAF24A", "#013330"],
  ["#89B0FF", "#CCE7FF"],
  ["#89B0FF", "#190066"],
  ["#661800", "#FFA680"],
  ["#FFA680", "#661800"],
  ["#3D065F", "#EAC2FF"],
  ["#EAC2FF", "#3D065F"],
  ["#013330", "#E5FFC3"],
  ["#E5FFC3", "#013330"],
  ["#190066", "#CCE7FF"],
  ["#CCE7FF", "#190066"],
] as const;

const complementaryPairs = [
  ["#EAC2FF", "#013330"],
  ["#013330", "#EAC2FF"],
  ["#CCE7FF", "#661800"],
  ["#661800", "#CCE7FF"],
  ["#E5FFC3", "#3D065F"],
  ["#3D065F", "#E5FFC3"],
  ["#FFA680", "#190066"],
  ["#190066", "#FFA680"],
  ["#CCE7FF", "#013330"],
  ["#013330", "#CCE7FF"],
] as const;

const colorPairs: ReadonlyArray<readonly [string, string]> = [...neutralPairs, ...tonalPairs, ...complementaryPairs];

function hashSeed(seed: string) {
  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
  }

  return hash;
}

export function polyconDataUri(seed: string, size: number) {
  const normalizedSeed = seed.length < 6 ? seed.padEnd(6, " ") : seed;
  const hash = hashSeed(normalizedSeed);
  const defaultColorPair: readonly [string, string] = ["#FF5C16", "#FCFCFC"];
  const [backgroundColor, foregroundColor] = colorPairs[Math.abs(hash) % colorPairs.length] ?? defaultColorPair;
  const grid = 2;
  const margin = size * 0.25;
  const innerSize = size - 2 * margin;
  const cellSize = innerSize / grid;
  const filledGrid = Array.from({ length: grid }, () => Array.from({ length: grid }, () => false));
  const stack: Array<[number, number]> = [[Math.floor(grid / 2), Math.floor(grid / 2)]];
  let pathData = "";

  if (filledGrid[1]) {
    filledGrid[1][1] = true;
  }

  while (stack.length > 0) {
    const currentCell = stack.pop();

    if (!currentCell) {
      continue;
    }

    const [x, y] = currentCell;
    const cellHash = Math.abs(hash >> (x * 3 + y * 5)) & 15;
    const neighbors: Array<[number, number]> = [];
    const directions: Array<[number, number]> = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    for (const [dx, dy] of directions) {
      const nextX = x + dx;
      const nextY = y + dy;

      if (nextX >= 0 && nextX < grid && nextY >= 0 && nextY < grid && !filledGrid[nextX]?.[nextY]) {
        neighbors.push([nextX, nextY]);
      }
    }

    while (neighbors.length > 0) {
      const neighborIndex = Math.abs(cellHash + neighbors.length) % neighbors.length;
      const nextCell = neighbors.splice(neighborIndex, 1)[0];

      if (!nextCell) {
        continue;
      }

      const [nextX, nextY] = nextCell;
      stack.push(nextCell);
      if (filledGrid[nextX]) {
        filledGrid[nextX][nextY] = true;
      }
    }

    const rotation = (cellHash % 4) * 90;
    const isSquare = cellHash % 5 === 0;
    const cx = margin + x * cellSize;
    const cy = margin + y * cellSize;

    if (isSquare) {
      pathData += `M${cx},${cy} h${cellSize} v${cellSize} h-${cellSize}z `;
      continue;
    }

    if (rotation === 0) {
      pathData += `M${cx},${cy} h${cellSize} v${cellSize}z `;
    } else if (rotation === 90) {
      pathData += `M${cx + cellSize},${cy} v${cellSize} h-${cellSize}z `;
    } else if (rotation === 180) {
      pathData += `M${cx + cellSize},${cy + cellSize} h-${cellSize} v-${cellSize}z `;
    } else {
      pathData += `M${cx},${cy + cellSize} v-${cellSize} h${cellSize}z `;
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="${backgroundColor}"/><path d="${pathData.trim()}" fill="${foregroundColor}"/></svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
