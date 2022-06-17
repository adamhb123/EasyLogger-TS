import Tests from "./tests";
import Utility, { LogType } from "./utility";
/**
 * Record<string, boolean> containing all Logger settings. Logger
 * options can be modified through the various setter functions.
 */
export const options = {
  silenced: false,
  debugMode: true,
  rejectOnLogError: false,
  regularLoggingOnly: false,
};

/**
 * Returns a string describing the options object. To set options,
 * utilize the various setter functions available.
 * @returns A string describing the options object.
 */
export const getOptions = () => options;


/** console.log as a promise */
export const promisifiedConsoleLog = async (text: any) => console.log(text);
/** console.debug as a promise */
export const promisifiedConsoleDebug = async (text: any) => console.debug(text);
/** console.warn as a promise */
export const promisifiedConsoleWarn = async (text: any) => console.warn(text);
/** console.error as a promise */
export const promisifiedConsoleError = async (text: any) => console.error(text);

/**
 * Monolithic, centralized logging function, used by all exported logging functions.
 * @param text - Text to log
 * @param logType - Type of log
 * @param concatToLog - Any additional data to concat to the log
 */
function monolithLog(
  text: any,
  logType: LogType = LogType.DEBUG,
  ...concatToLog: any[]
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      (async () =>
        (concatToLog = [text].concat(concatToLog).map((item: unknown) => {
          if (typeof item !== "string") {
            try {
              if (Array.isArray(item) !== true && typeof item === "object")
                return Utility.objectToPrettyString(<Record<string, unknown>>item);
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
            (async () => (text = `${concatToLog.join(" ")}`))()
              .then(() => {
                (logType === LogType.LOG || options.regularLoggingOnly
                  ? promisifiedConsoleLog
                  : logType === LogType.DEBUG && options.debugMode
                  ? promisifiedConsoleDebug
                  : logType === LogType.WARN
                  ? promisifiedConsoleWarn
                  : promisifiedConsoleError
                ).call(null, `[EasyLogger-TS][${logType}] ${text}`);
                resolve(Utility.PromiseResolutionMessages.resolve.success());
              })
              .catch((err: string) =>
                reject(Utility.PromiseResolutionMessages.reject.criticalError(err))
              );
          } else resolve(Utility.PromiseResolutionMessages.resolve.silent(logType));
        })
        .catch((err: string) =>
          reject(Utility.PromiseResolutionMessages.reject.criticalError(err))
        );
    } catch (err: any) {
      reject(Utility.PromiseResolutionMessages.reject.criticalError(err.message));
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
            Utility.PromiseResolutionMessages.resolve.success(
              `options.silenced set to: ${options.silenced}`
            )
          )
        )
        .catch((err: string) =>
          reject(Utility.PromiseResolutionMessages.reject.criticalError(err))
        );
    } catch (err: any) {
      reject(Utility.PromiseResolutionMessages.reject.criticalError(err.message));
    }
  });
}

/**
 * Setter for the Logger.options.debugMode variable. When options.debugMode is false,
 * LogType.DEBUG logs are disabled.
 * @param debugMode - Whether or not the logger should be in debug mode
 * @returns Promise<string> resolving to the boolean value provided
 */
export function setDebugMode(debugMode: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    (async () => (options.debugMode = debugMode))()
      .then(() =>
        resolve(
          Utility.PromiseResolutionMessages.resolve.success(
            `options.debugMode set to: ${options.debugMode}`
          )
        )
      )
      .catch((err: string) =>
        reject(Utility.PromiseResolutionMessages.reject.criticalError(err))
      );
  });
}

/**
 * @param rejectOnLogError - Whether or not the logger should reject on an error
 * @returns Promise<string> resolving to the boolean value provided
 */
export function setRejectOnLogError(
  rejectOnLogError: boolean
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      (async () => (options.rejectOnLogError = rejectOnLogError))()
        .then(() =>
          resolve(
            Utility.PromiseResolutionMessages.resolve.success(
              `options.rejectOnLogError set to: ${options.rejectOnLogError}`
            )
          )
        )
        .catch((err: string) =>
          reject(Utility.PromiseResolutionMessages.reject.criticalError(err))
        );
    } catch (err: any) {
      reject(Utility.PromiseResolutionMessages.reject.criticalError(err.message));
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
            Utility.PromiseResolutionMessages.resolve.success(
              `options.regularLoggingOnly set to: ${options.regularLoggingOnly}`
            )
          )
        )
        .catch((err: string) =>
          reject(Utility.PromiseResolutionMessages.reject.criticalError(err))
        );
    } catch (err: any) {
      reject(Utility.PromiseResolutionMessages.reject.criticalError(err.message));
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
  text: any,
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
                    reject(Utility.PromiseResolutionMessages.reject.criticalError(err))
                  )
                )
            )
            .catch((err: string) =>
              setSilent(originalSilenceSetting).then(() =>
                reject(Utility.PromiseResolutionMessages.reject.criticalError(err))
              )
            )
        )
        .catch((err: string) =>
          setSilent(originalSilenceSetting).then(() =>
            reject(Utility.PromiseResolutionMessages.reject.criticalError(err))
          )
        );
    } catch (err: any) {
      reject(Utility.PromiseResolutionMessages.reject.criticalError(err.message));
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
export function log(text: any, ...concatToLog: any[]): Promise<string> {
  return monolithLog(text, LogType.LOG, ...concatToLog);
}

/**
 * @param text - The text to output to console
 * @param concatToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 * @returns Promise<string>
 */
export function debug(text: any, ...concatToLog: any[]): Promise<string> {
  if (options.debugMode)
    return monolithLog(text, LogType.DEBUG, ...concatToLog);
  else return new Promise((resolve) => resolve(""));
}

/**
 * @param text - The text to output to console
 * @param concatToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 * @returns Promise<string>
 */
export function warn(text: any, ...concatToLog: any[]): Promise<string> {
  return monolithLog(text, LogType.WARN, ...concatToLog);
}

/**
 * @param text - The text to output to console
 * @param concatToLog - Strings to append to text, if provided parameter is not a string,
 * then a conversion using toString() is attempted. If this fails, then we catch it, warn
 * that conversion failed, and move on
 * @returns Promise<string>
 */
export function error(text: any, ...concatToLog: any[]): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      monolithLog(text, LogType.ERROR, ...concatToLog)
        .then((monolithLogResult: string) => {
          if (options.rejectOnLogError)
            reject(
              Utility.PromiseResolutionMessages.reject.criticalError(
                `Rejecting on error, because Logger has been advised to do so. Logged error: ${text}`
              )
            );
          resolve(monolithLogResult);
        })
        .catch((err: string) =>
          reject(Utility.PromiseResolutionMessages.reject.criticalError(err))
        );
    } catch (err: any) {
      reject(Utility.PromiseResolutionMessages.reject.criticalError(err.message));
    }
  });
}

export default {
  // Utility exports
  LogType: Utility.LogType,
  PromiseResolutionMessages: Utility.PromiseResolutionMessages,
  objectToPrettyString: Utility.objectToPrettyString,
  objectToPrettyStringSync: Utility.objectToPrettyStringSync,
  // Logger exports
  options,
  getOptions,
  promisifiedConsoleLog,
  promisifiedConsoleDebug,
  promisifiedConsoleWarn,
  promisifiedConsoleError,
  setSilent,
  setDebugMode,
  setRejectOnLogError,
  setRegularLoggingOnly,
  forceLog,
  log,
  debug,
  warn,
  error,
};

if (require.main === module) Tests.runAllTests();
