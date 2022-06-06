import Tests from "./tests";

/**
 * Record<string, boolean> containing all Logger settings. Logger
 * options can be modified through the various setter functions.
 */
export const options = {
  silenced: false,
  debugMode: true,
  throwOnLogError: false,
  regularLoggingOnly: false,
};

/**
 * Returns a string describing the options object. To set options,
 * utilize the various setter functions available.
 * @returns A string describing the options object.
 */
export const getOptions = () => options;

/** Enum describing the various  */
export enum LogType {
  LOG = "LOG",
  DEBUG = "DEBUG",
  WARN = "WARN",
  ERROR = "ERROR",
}

/**
 * Object containing various helper functions for constructing Promise resolve/reject messages.
 */
export const PromiseResolutionMessages = {
  resolve: {
    success: (additionalInfo?: string) =>
      `[EasyLogger-TS] Successful log${`: ${additionalInfo}`}`,
    silent: (logType: LogType) =>
      `[EasyLogger-TS] Refusal to log (LogType: ${logType}): logger is set to silent`,
  },
  reject: {
    criticalError: (caughtErrorMessage?: string) =>
      `[EasyLogger-TS] Critical error! ${caughtErrorMessage ?? ""}`,
  },
};

/** console.log as a promise */
export const promisifiedConsoleLog = async (text: string) => console.log(text);
/** console.debug as a promise */
export const promisifiedConsoleDebug = async (text: string) =>
  console.debug(text);
/** console.warn as a promise */
export const promisifiedConsoleWarn = async (text: string) =>
  console.warn(text);
/** console.error as a promise */
export const promisifiedConsoleError = async (text: string) =>
  console.error(text);

/**
 * Stringifies the given Record<string, unknown>
 * @param record - Record to stringify Record<string, unknown>
 * @param name - Optional. Prepend
 */
export const objectToPrettyString = (
  record: Record<string, unknown>,
  name?: string
): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      (async () =>
        `${name ?? ""}{\n\t${Object.entries(record)
          .map((entry) => `${entry[0]}: ${entry[1]}`)
          .join(",\n\t")}\n}`)().then((prettifiedObjectString: string) =>
        resolve(prettifiedObjectString)
      );
    } catch (err: any) {
      reject(PromiseResolutionMessages.reject.criticalError(err.message));
    }
  });

/**
 * Monolithic, centralized logging function, used by all exported logging functions.
 * @param text - Text to log
 * @param logType - Type of log
 * @param concatToLog - Any additional data to concat to the log
 */
function monolithLog(
  text: string,
  logType: LogType = LogType.DEBUG,
  ...concatToLog: any[]
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      (async () =>
        (concatToLog = concatToLog.map((item: unknown) => {
          if (typeof item !== "string") {
            try {
              if (Array.isArray(item) !== true && typeof item === "object")
                return objectToPrettyString(<Record<string, unknown>>item);
              else if (typeof (<any>item).toString === "function")
                return (<any>item).toString();
            } catch (err: any) {
              warn(`One or more variable length arguments supplied to Logger have no toString() method!
            ...appending [NO TOSTRING()!] instead. Specific error: ${err.message}`);
              return "[NO TOSTRING()]";
            }
          }
          return item;
        })))()
        .then(() => {
          if (!options.silenced) {
            (async () => (text = `${text}${concatToLog.join(" ")}`))()
              .then(() => {
                (logType === LogType.LOG || options.regularLoggingOnly
                  ? promisifiedConsoleLog
                  : logType === LogType.DEBUG && options.debugMode
                  ? promisifiedConsoleDebug
                  : logType === LogType.WARN
                  ? promisifiedConsoleWarn
                  : promisifiedConsoleError
                ).call(null, `[EasyLogger-TS][${logType}] ${text}`);
                resolve(PromiseResolutionMessages.resolve.success());
              })
              .catch((err: string) =>
                reject(PromiseResolutionMessages.reject.criticalError(err))
              );
          } else resolve(PromiseResolutionMessages.resolve.silent(logType));
        })
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
      (async () => (options.silenced = silent))()
        .then(() =>
          resolve(
            PromiseResolutionMessages.resolve.success(
              `options.silenced set to: ${options.silenced}`
            )
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
 * Setter for the Logger.options.debugMode variable. When options.debugMode is false,
 * LogType.DEBUG logs are disabled.
 * @param debugMode - Whether or not the logger should be in debug mode
 * @returns Promise<string> resolving to the boolean value provided
 */
export function setDebugMode(debugMode: boolean) {
  return new Promise((resolve, reject) => {
    (async () => (options.debugMode = debugMode))()
      .then(() =>
        resolve(
          PromiseResolutionMessages.resolve.success(
            `options.debugMode set to: ${options.debugMode}`
          )
        )
      )
      .catch((err: string) =>
        reject(PromiseResolutionMessages.reject.criticalError(err))
      );
  });
}

/**
 * @param throwOnLogError - Whether or not the logger should throw on an error
 * @returns Promise<string> resolving to the boolean value provided
 */
export function setThrowOnLogError(throwOnLogError: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      (async () => (options.throwOnLogError = throwOnLogError))()
        .then(() =>
          resolve(
            PromiseResolutionMessages.resolve.success(
              `options.throwOnLogError set to: ${options.throwOnLogError}`
            )
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
 * @param regularLoggingOnly - Whether or not the logger should only log using 'console.log'
 * @returns Promise<string> resolving to the boolean value provided
 */
export function setRegularLoggingOnly(
  regularLoggingOnly: boolean
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      (async () => (options.regularLoggingOnly = regularLoggingOnly))()
        .then(() =>
          resolve(
            PromiseResolutionMessages.resolve.success(
              `options.regularLoggingOnly set to: ${options.regularLoggingOnly}`
            )
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
 * Forces a log, ignoring whether the Logger is silenced or not
 * @param text - The text to output to console
 * @param logType - The type of log to output
 * @param concatToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 */
export function forceLog(
  text: string,
  logType: LogType,
  ...concatToLog: any[]
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      let originalSilenceSetting: boolean;
      (async () => (originalSilenceSetting = options.silenced))()
        .then(() =>
          setSilent(false)
            .then(() =>
              monolithLog(text, logType, ...concatToLog)
                .then((monolithLogResult: string) =>
                  setSilent(originalSilenceSetting).then(() =>
                    resolve(monolithLogResult)
                  )
                )
                .catch((err: string) =>
                  setSilent(originalSilenceSetting).then(() =>
                    reject(PromiseResolutionMessages.reject.criticalError(err))
                  )
                )
            )
            .catch((err: string) =>
              setSilent(originalSilenceSetting).then(() =>
                reject(PromiseResolutionMessages.reject.criticalError(err))
              )
            )
        )
        .catch((err: string) =>
          setSilent(originalSilenceSetting).then(() =>
            reject(PromiseResolutionMessages.reject.criticalError(err))
          )
        );
    } catch (err: any) {
      reject(PromiseResolutionMessages.reject.criticalError(err.message));
    }
  });
}

/**
 * @param text - The text to output to console
 * @param concatToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 * @returns Promise<string>
 */
export function log(text: string, ...concatToLog: any[]): Promise<string> {
  return monolithLog(text, LogType.LOG, ...concatToLog);
}

/**
 * @param text - The text to output to console
 * @param concatToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 * @returns Promise<string>
 */
export function debug(text: string, ...concatToLog: any[]): Promise<string> {
  return monolithLog(text, LogType.DEBUG, ...concatToLog);
}

/**
 * @param text - The text to output to console
 * @param concatToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 * @returns Promise<string>
 */
export function warn(text: string, ...concatToLog: any[]): Promise<string> {
  return monolithLog(text, LogType.WARN, ...concatToLog);
}

/**
 * @param text - The text to output to console
 * @param concatToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 * @returns Promise<string>
 */
export function error(text: string, ...concatToLog: any[]): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      monolithLog(text, LogType.ERROR, ...concatToLog)
        .then((monolithLogResult: string) => {
          if (options.throwOnLogError)
            throw new Error(
              `Throwing on error, because Logger has been advised to do so. Logged error: ${text}`
            );
          resolve(monolithLogResult);
        })
        .catch((err: string) =>
          reject(PromiseResolutionMessages.reject.criticalError(err))
        );
    } catch (err: any) {
      reject(PromiseResolutionMessages.reject.criticalError(err.message));
    }
  });
}

export default {
  options: options,
  getOptions: getOptions,
  LogType: LogType,
  PromiseResolutionMessages: PromiseResolutionMessages,
  promisifiedConsoleLog: promisifiedConsoleLog,
  promisifiedConsoleDebug: promisifiedConsoleDebug,
  promisifiedConsoleWarn: promisifiedConsoleWarn,
  promisifiedConsoleError: promisifiedConsoleError,
  objectToPrettyString: objectToPrettyString,
  setSilent: setSilent,
  setDebugMode: setDebugMode,
  setThrowOnLogError: setThrowOnLogError,
  setRegularLoggingOnly: setRegularLoggingOnly,
  forceLog: forceLog,
  log: log,
  debug: debug,
  warn: warn,
  error: error,
};

if (require.main === module) Tests.runAllTests();
