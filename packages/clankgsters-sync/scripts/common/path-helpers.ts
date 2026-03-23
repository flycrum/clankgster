import path from "node:path";

/** Resolves sync runtime root paths with e2e-test override support; `CLANKGSTERS_REPO_ROOT` takes precedence so sandbox runs stay isolated. */
export const pathHelpers = {
  /** Absolute repo root: `CLANKGSTERS_REPO_ROOT` when set, otherwise `process.cwd()`. */
  getRepoRoot(): string {
    const envRoot = process.env.CLANKGSTERS_REPO_ROOT;
    if (typeof envRoot === "string" && envRoot.length > 0) return path.resolve(envRoot);
    return process.cwd();
  },
};
