import fs from "node:fs";
import path from "node:path";
import pino, { type Logger } from "pino";

/**
 * Central Pino logger setup for sync scripts, aligned with mmaappss behavior.
 *
 * Invariants:
 * - Logging defaults to disabled.
 * - `CLANKGSTERS_LOGGING_ENABLED` can force enable or disable.
 * - When enabled, logs write to `.clankgsters/logs/clankgsters-sync.log` under output root or repo root.
 *
 * `getLogger()` is safe before initialization: it returns a silent logger until context is set.
 */
const LOG_DIR = ".clankgsters/logs";
const LOG_FILE = "clankgsters-sync.log";

let currentLogger: Logger | null = null;
let currentDestination: { flushSync?: () => void; end?: () => void } | null = null;
let currentFd: number | null = null;

function closeCurrentLogger(): void {
  if (currentDestination != null) {
    if (typeof currentDestination.flushSync === "function") currentDestination.flushSync();
    if (typeof currentDestination.end === "function") currentDestination.end();
    currentDestination = null;
  }
  if (currentFd != null) {
    fs.closeSync(currentFd);
    currentFd = null;
  }
}

const silentLogger: Logger = pino({ level: "silent" });

export interface ClankLoggerContextInput {
  /** Request file logging when true; omitted means off unless env forces it. */
  loggingEnabled?: boolean;
  /** Root directory for `.clankgsters/logs/`; defaults to `repoRoot`. */
  outputRoot?: string;
  /** Repository root (used for log path and context). */
  repoRoot: string;
}

export const clankLogger = {
  /** Active Pino logger, or `silent` until `setLoggerContext` enables file logging. */
  getLogger(): Logger {
    if (currentLogger == null) return silentLogger;
    return currentLogger;
  },
  /** Reconfigures logging from `input` and `CLANKGSTERS_LOGGING_ENABLED`; closes any prior file logger when disabling or replacing. */
  setLoggerContext(input: ClankLoggerContextInput): void {
    const envLoggingEnabled = process.env.CLANKGSTERS_LOGGING_ENABLED;
    const envEnabled =
      envLoggingEnabled === "true" || envLoggingEnabled === "1"
        ? true
        : envLoggingEnabled === "false" || envLoggingEnabled === "0"
          ? false
          : undefined;
    const enabled = envEnabled ?? input.loggingEnabled ?? false;
    if (!enabled) {
      closeCurrentLogger();
      currentLogger = silentLogger;
      return;
    }

    const logRoot = input.outputRoot ?? input.repoRoot;
    const logDirPath = path.join(logRoot, LOG_DIR);
    const logFilePath = path.join(logDirPath, LOG_FILE);
    fs.mkdirSync(logDirPath, { recursive: true });

    const fd = fs.openSync(logFilePath, "a");
    const destination = pino.destination(fd);
    const logger = pino(
      { name: "@clankgsters/sync", level: "debug", base: undefined },
      destination,
    );

    closeCurrentLogger();
    currentFd = fd;
    currentDestination = destination;
    currentLogger = logger;
  },
};
