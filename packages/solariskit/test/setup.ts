import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

const litGlobals = globalThis as typeof globalThis & {
  litIssuedWarnings?: Set<string>;
};

litGlobals.litIssuedWarnings ??= new Set();
litGlobals.litIssuedWarnings.add("dev-mode");

afterEach(() => {
  cleanup();
});
