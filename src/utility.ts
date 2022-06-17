/** Enum describing the various log types */
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
      `[EasyLogger-TS] Promsie resolved successfully${`: ${additionalInfo}`}`,
    silent: (logType: LogType) =>
      `[EasyLogger-TS] Refusal to log (LogType: ${logType}): logger is set to silent`,
  },
  reject: {
    criticalError: (caughtErrorMessage?: string) =>
      `[EasyLogger-TS] Critical error! ${caughtErrorMessage ?? ""}`,
  },
};

/**
 * Stringifies the given Record<string, unknown>, asynchronously
 * 
 * @param record - Record to stringify Record<string, unknown>
 * @param name - (optional) Prepended to string.
 * @returns Promise<string> resolving to the stringified Record
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
 * Stringifies the given Record<string, unknown>, synchronously
 * 
 * @param record - Record to stringify Record<string, unknown>
 * @param name - (optional) Prepend
 * @returns The stringified Record
 */
export const objectToPrettyStringSync = (
  record: Record<string, unknown>,
  name?: string
): string =>
  `${name ?? ""}{\n\t${Object.entries(record)
    .map((entry) => `${entry[0]}: ${entry[1]}`)
    .join(",\n\t")}\n}`;

export default {
  LogType,
  PromiseResolutionMessages,
  objectToPrettyString,
  objectToPrettyStringSync
};
