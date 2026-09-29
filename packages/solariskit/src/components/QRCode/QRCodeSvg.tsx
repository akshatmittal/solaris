/**
 * QR code SVG renderer adapted from cuer@0.0.3 (https://github.com/wevm/cuer).
 * Only the rendering path used by `QRCode` is kept: rounded cells, rounded
 * finder patterns and an optional center arena, with fixed styling.
 *
 * MIT License
 *
 * Copyright (c) 2025-present weth, LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import React from "react";

import { type ErrorCorrection, encodeQR } from "qr";

/** Side length of a finder pattern, in modules. */
const FINDER_LENGTH = 7;
/** Corner radius scale (0 to 1) of the finder patterns. */
const FINDER_RADIUS = 0.25;
/** Half the side length of a cell after a 10% inset on each side, in modules. */
const CELL_HALF_SIZE = (1 - 0.1 * 2) / 2;

interface Props {
  ecc: ErrorCorrection;
  /** Content drawn in the center of the QR code. Cells behind it are not drawn. */
  logo?: React.ReactNode;
  /** Width and height of the SVG, in pixels. */
  size: number;
  value: string;
}

/** Module grid without the quiet zone. `true` is a dark module. */
function encodeGrid(value: string, ecc: ErrorCorrection): boolean[][] {
  // qr >= 0.6 rejects `border: 0`, so request the smallest quiet zone and slice it off.
  return encodeQR(value, "raw", { border: 1, ecc, scale: 1 })
    .slice(1, -1)
    .map((row) => row.slice(1, -1));
}

function isInFinder(i: number, j: number, edgeLength: number): boolean {
  const top = i < FINDER_LENGTH;
  const left = j < FINDER_LENGTH;
  const right = j >= edgeLength - FINDER_LENGTH;
  const bottom = i >= edgeLength - FINDER_LENGTH;
  return (top && left) || (top && right) || (bottom && left);
}

/** SVG path of rounded squares for every dark module outside the finders and the arena. */
function cellsPath(grid: boolean[][], arenaSize: number): string {
  const edgeLength = grid.length;
  const arenaStart = edgeLength / 2 - arenaSize / 2;
  const arenaEnd = arenaStart + arenaSize;
  const r = CELL_HALF_SIZE;

  let path = "";
  grid.forEach((row, i) => {
    row.forEach((dark, j) => {
      if (!dark) return;
      if (i >= arenaStart && i <= arenaEnd && j >= arenaStart && j <= arenaEnd) return;
      if (isInFinder(i, j, edgeLength)) return;

      const cx = j + 0.5;
      const cy = i + 0.5;
      const left = cx - CELL_HALF_SIZE;
      const right = cx + CELL_HALF_SIZE;
      const top = cy - CELL_HALF_SIZE;
      const bottom = cy + CELL_HALF_SIZE;

      path += [
        `M ${left + r},${top}`,
        `L ${right - r},${top}`,
        `A ${r},${r} 0 0,1 ${right},${top + r}`,
        `L ${right},${bottom - r}`,
        `A ${r},${r} 0 0,1 ${right - r},${bottom}`,
        `L ${left + r},${bottom}`,
        `A ${r},${r} 0 0,1 ${left},${bottom - r}`,
        `L ${left},${top + r}`,
        `A ${r},${r} 0 0,1 ${left + r},${top}`,
        "z",
      ].join(" ");
    });
  });
  return path;
}

export function QRCodeSvg({ ecc, logo, size, value }: Props) {
  const hasArena = logo !== undefined;
  // Raise "low" to "medium" when the arena hides cells, so the code stays readable.
  const effectiveEcc = hasArena && ecc === "low" ? "medium" : ecc;

  const grid = React.useMemo(() => encodeGrid(value, effectiveEcc), [value, effectiveEcc]);
  const edgeLength = grid.length;
  const arenaSize = hasArena ? Math.floor(edgeLength / 4) : 0;
  const path = React.useMemo(() => cellsPath(grid, arenaSize), [grid, arenaSize]);

  const finderOrigins: ReadonlyArray<readonly [number, number]> = [
    [0, 0],
    [edgeLength - FINDER_LENGTH, 0],
    [0, edgeLength - FINDER_LENGTH],
  ];
  const outerSize = FINDER_LENGTH - 1;
  const innerSize = 3;

  const arenaStart = Math.ceil(edgeLength / 2 - arenaSize / 2);
  const arenaBoxSize = arenaSize + (arenaSize % 2);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${edgeLength} ${edgeLength}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>QR Code</title>
      <path
        d={path}
        fill="currentColor"
      />
      {finderOrigins.map(([x, y]) => (
        <React.Fragment key={`${x},${y}`}>
          <rect
            stroke="currentColor"
            fill="transparent"
            x={x + 0.5}
            y={y + 0.5}
            width={outerSize}
            height={outerSize}
            rx={FINDER_RADIUS * (outerSize - 1)}
            ry={FINDER_RADIUS * (outerSize - 1)}
            strokeWidth={1}
          />
          <rect
            fill="currentColor"
            x={x + 2}
            y={y + 2}
            width={innerSize}
            height={innerSize}
            rx={2 * FINDER_RADIUS}
            ry={2 * FINDER_RADIUS}
          />
        </React.Fragment>
      ))}
      {hasArena && (
        <foreignObject
          x={arenaStart}
          y={arenaStart}
          width={arenaBoxSize}
          height={arenaBoxSize}
        >
          <div
            style={{
              alignItems: "center",
              boxSizing: "border-box",
              display: "flex",
              fontSize: 1,
              height: "100%",
              justifyContent: "center",
              overflow: "hidden",
              padding: 0.5,
              width: "100%",
            }}
          >
            {logo}
          </div>
        </foreignObject>
      )}
    </svg>
  );
}
