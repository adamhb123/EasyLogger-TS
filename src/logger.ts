import Tests from "./tests";

/**
 * Logger options can be modified directly or through the various setter functions
 */
export const options = {
  silenced: false,
  throwOnError: false,
  regularLoggingOnly: false,
};

export enum LogType {
  LOG = "LOG",
  DEBUG = "DEBUG",
  WARN = "WARN",
  ERROR = "ERROR",
}
const PromiseResolutionMessages = {
  resolve: {
    success: (additionalInfo?: string) =>
      `[EasyLogger-TS] Successful log${`: ${additionalInfo}`}`,
  },
  reject: {
    silent: (logType: LogType) =>
      `[EasyLogger-TS] Refusal to log (LogType: ${logType}): logger is set to silent`,
    criticalError: (caughtErrorMessage?: string) =>
      `[EasyLogger-TS] Critical error! ${caughtErrorMessage ?? ""}`,
  },
};

/**
 * Logs the given 'text' parameter to console, determining the type of log
 * (log, debug, warn, error) based on the given 'logType' parameter.
 * @param text - The text to output to console
 * @param logType - The type of log to output
 * @param appendToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 */

export const objectToPrettyString = (object: Object, name?: string) =>
  `${name ?? ""}{\n\t${Object.entries(object)
    .map((entry) => `${entry[0]}: ${entry[1]}`)
    .join(",\n\t")}\n}`;

function monolithLog(
  text: string,
  logType: LogType = LogType.DEBUG,
  ...appendToLog: any[]
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      appendToLog = appendToLog.map((item: any) => {
        if (typeof item !== "string") {
          try {
            if (typeof item === "object") return objectToPrettyString(item);
            return item.toString();
          } catch (err: any) {
            warn(`One or more variable length arguments supplied to Logger have no toString() method!
            ...appending [NO TOSTRING()!] instead. Specific error: ${err.message}`);
            return "[NO TOSTRING()]";
          }
        }
        return item;
      });
      if (!options.silenced) {
        text = `${text}${appendToLog.join(" ")}`;
        switch (logType) {
          case LogType.LOG || options.regularLoggingOnly:
            console.log(text);
            break;
          default:
            (logType === LogType.WARN ? console.warn : console.error)(
              `[${logType}] ${text}`
            );
        }
        resolve(PromiseResolutionMessages.resolve.success());
      } else reject(PromiseResolutionMessages.reject.silent(logType));
    } catch (err: any) {
      reject(PromiseResolutionMessages.reject.criticalError(err.message));
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
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      setSilent(false)
        .then(() =>
          monolithLog(text, logType, ...appendToLog)
            .then((monolithLogResult: string) =>
              setSilent(true).then(() => resolve(monolithLogResult))
            )
            .catch((err: string) =>
              reject(PromiseResolutionMessages.reject.criticalError(err))
            )
        )
        .catch((err: string) =>
          reject(PromiseResolutionMessages.reject.criticalError(err))
        );
    } catch (err: any) {
      reject(PromiseResolutionMessages.reject.criticalError(err.message));
    }
  });
}

/**
 * @param silent - Whether or not the logger should log to console
 * @returns Promise<string> resolving to the boolean value provided
 */
export function setSilent(silent: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      options.silenced = silent;
      resolve(
        PromiseResolutionMessages.resolve.success(
          `options.silenced set to: ${options.silenced}`
        )
      );
    } catch (err: any) {
      reject(PromiseResolutionMessages.reject.criticalError(err.message));
    }
  });
}

/**
 * @param throwOnError - Whether or not the logger should throw on an error
 * @returns Promise<string> resolving to the boolean value provided
 */
export function setThrowOnError(throwOnError: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      options.throwOnError = throwOnError;
      resolve(
        PromiseResolutionMessages.resolve.success(
          `options.throwOnError set to: ${options.throwOnError}`
        )
      );
    } catch (err: any) {
      reject(PromiseResolutionMessages.reject.criticalError(err.message));
    }
  });
}

/**
 * @param regularLoggingOnly - Whether or not the logger should only log using 'console.log'
 * @returns Promise<string> resolving to the boolean value provided
 */
export function setRegularLoggingOnly(
  regularLoggingOnly: boolean
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      options.regularLoggingOnly = regularLoggingOnly;
      resolve(
        PromiseResolutionMessages.resolve.success(
          `options.regularLoggingOnly set to: ${options.regularLoggingOnly}`
        )
      );
    } catch (err: any) {
      reject(PromiseResolutionMessages.reject.criticalError(err.message));
    }
  });
}

/**
 * @param text - The text to output to console
 * @param appendToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 * @returns Promise<string>
 */
export function log(text: string, ...appendToLog: any[]): Promise<string> {
  return monolithLog(text, LogType.LOG, ...appendToLog);
}

/**
 * @param text - The text to output to console
 * @param appendToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 * @returns Promise<string>
 */
export function debug(text: string, ...appendToLog: any[]): Promise<string> {
  return monolithLog(text, LogType.DEBUG, ...appendToLog);
}

/**
 * @param text - The text to output to console
 * @param appendToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 * @returns Promise<string>
 */
export function warn(text: string, ...appendToLog: any[]): Promise<string> {
  return monolithLog(text, LogType.WARN, ...appendToLog);
}

/**
 * @param text - The text to output to console
 * @param appendToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 * @returns Promise<string>
 */
export function error(text: string, ...appendToLog: any[]): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      monolithLog(text, LogType.ERROR, ...appendToLog)
        .then((monolithLogResult: string) => {
          if (options.throwOnError) throw new Error(text);
          resolve(monolithLogResult);
        })
        .catch((monolithLogError: string) => reject(PromiseResolutionMessages.reject.criticalError(monolithLogError)));
    } catch (err: any) {
      reject(PromiseResolutionMessages.reject.criticalError(err.message));
    }
  });
}

export default {
  options: options,
  LogType: LogType,
  objectToPrettyString: objectToPrettyString,
  setSilent: setSilent,
  setThrowOnError: setThrowOnError,
  setRegularLoggingOnly: setRegularLoggingOnly,
  forceLog: forceLog,
  log: log,
  debug: debug,
  warn: warn,
  error: error,
};

if (require.main === module) Tests.runAllTests();
