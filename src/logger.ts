import Tests from "./tests";

/**
 * Loggan be modified directly or through the various setter functions
 */
export const options = {
  silenced: false,
  throwOnError: false,
  regularLoggingOnly: false,
};

export enum LogType {
  LOG,
  DEBUG,
  WARN,
  ERROR,
}

/**
 * Logs the given 'text' parameter to console, determining the type of log
 * (log, debug, warn, error) based on the given 'logType' parameter.
 * @param text - The text to output to console
 * @param logType - The type of log to output
 * @param appendToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 */
function monolithLog(
  text: string,
  logType: LogType = LogType.DEBUG,
  ...appendToLog: any[]
): Promise<void> {
  return new Promise((resolve) => {
    appendToLog = appendToLog.map((item: any) => {
      if (typeof item !== "string") {
        try {
          return item.toString();
        } catch (err) {
          warn(`One or more variable length arguments supplied to Logger have no toString() method!
          ...appending [NO TOSTRING()!] instead`);
          return "[NO TOSTRING()";
        }
      }
      return item;
    });
    if (!options.silenced) {
      text = `${text}${appendToLog.join(" ")}`;
      switch (logType) {
        case LogType.LOG:
          console.log(text);
        case LogType.DEBUG:
          console.log(`[DEBUG] ${text}`);
        case LogType.WARN:
          (options.regularLoggingOnly ? console.log : console.warn)(
            `[WARNING] ${text}`
          );
        case LogType.ERROR:
          (options.regularLoggingOnly ? console.log : console.error)(
            `[ERROR] ${text}`
          );
      }
      resolve();
    }
  });
}

/**
 * Forces a log, ignoring whether the Logger is SILENCED or not
 * @param text - The text to output to console
 * @param logType - The type of log to output
 * @param appendToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 */
export function forceLog(
  text: string,
  logType: LogType,
  ...appendToLog: any[]
): Promise<void> {
  return new Promise((resolve) => {
    setSilent(false).then(() => {
      monolithLog(text, logType, ...appendToLog).then(() => {
        setSilent(true).then(() => resolve());
      });
    });
  });
}

/**
 * @param silent - Whether or not the logger should log to console
 * @returns A promise resolving to the boolean value provided
 */
export function setSilent(silent: boolean): Promise<boolean> {
  return new Promise((resolve) => {
    options.silenced = silent;
    resolve(options.silenced);
  });
}

/**
 * @param throwOnError - Whether or not the logger should throw on an error
 * @returns A promise resolving to the boolean value provided
 */
export function setThrowOnError(throwOnError: boolean): Promise<boolean> {
  return new Promise((resolve) => {
    options.throwOnError = throwOnError;
    resolve(options.throwOnError);
  });
}

/**
 * @param consoleLogOnly - Whether or not the logger should only log using 'console.log'
 * @returns A promise resolving to the boolean value provided
 */
export function setConsoleLogOnly(consoleLogOnly: boolean): Promise<boolean> {
  return new Promise((resolve) => {
    options.regularLoggingOnly = consoleLogOnly;
    resolve(options.regularLoggingOnly);
  });
}

/**
 * @param text - The text to output to console
 * @param appendToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 * @returns Promise<void>
 */
export function log(text: string, ...appendToLog: any[]): Promise<void> {
  return new Promise((resolve) => {
    monolithLog(text, LogType.LOG, ...appendToLog).then(resolve);
  });
}

/**
 * @param text - The text to output to console
 * @param appendToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 * @returns Promise<void>
 */
export function debug(text: string, ...appendToLog: any[]): Promise<void> {
  return new Promise((resolve) => {
    monolithLog(text, LogType.DEBUG, ...appendToLog).then(resolve);
  });
}

/**
 * @param text - The text to output to console
 * @param appendToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 * @returns void
 */
export function warn(text: string, ...appendToLog: any[]): Promise<void> {
  return new Promise((resolve) =>
    monolithLog(text, LogType.WARN, ...appendToLog).then(() => resolve())
  );
}

/**
 * @param text - The text to output to console
 * @param appendToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 * @returns Promise<void>
 */
export function error(text: string, ...appendToLog: any[]): Promise<void> {
  return new Promise((resolve) =>
    monolithLog(text, LogType.ERROR, ...appendToLog)
      .then(() => {
        if (options.throwOnError) throw new Error(text);
        resolve();
      })
      .catch(resolve)
  );
}

export default {
  options: options,
  LogType: LogType,
  setSilent: setSilent,
  setThrowOnError: setThrowOnError,
  setConsoleLogOnly: setConsoleLogOnly,
  forceLog: forceLog,
  log: log,
  debug: debug,
  warn: warn,
  error: error,
};

if (require.main === module) Tests.runAllTests();
