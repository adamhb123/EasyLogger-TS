import Logger, { options } from "./logger";
console.log(
  "[EasyLogger-TS]: 'tests' module imported...hopefully intentionally!"
);
/**
 * All available tests, able to be modified for extensibility
 */
export let tests = {
  testForceLog: (...input: any[]) =>
    Logger.forceLog.bind(this, "", Logger.LogType.DEBUG, ...input),
  testLog: (...input: any[]) => Logger.log.bind(this, "", ...input),
  testDebug: (...input: any[]) => Logger.debug.bind(this, "", ...input),
  testWarn: (...input: any[]) => Logger.warn.bind(this, "", ...input),
  testError: (...input: any[]) => Logger.error.bind(this, "", ...input),
  testSetSilent: (input: boolean) => Logger.setSilent.bind(this, input),
  testSetThrowOnError: (input: boolean) =>
    Logger.setThrowOnError.bind(this, input),
  testRegularLoggingOnly: (input: boolean) =>
    Logger.setRegularLoggingOnly.bind(null, input),
};

/**
 * Runs a test of function given by parameter 'func'
 * @param func - Function to test
 * @param args - Args to test function with
 * @param funcName - Optional | Name of function to test
 */
export async function runTest(
  funcName: string | null,
  func:
    | ((...input: any[]) => () => Promise<string>)
    | ((input: boolean) => () => Promise<string>),
  ...args: any[]
) {
  const text = `Testing function: ${
    funcName ?? func.hasOwnProperty("name")
      ? func.name
      : "(undefined, possibly due to your ES version (versions < ES6 do not have a name property))"
  }`;
  process.stdout.write(`${text}\n\tFunction logging output: `);
  if (args.length > 0) await func.call(null, ...args).call(null);
  // .then((res: any) => console.log(res)).catch((err: any) => console.log(err));
  else await func.call(null, false).call(null); //.then((res: any) => console.log(res)).catch((err: any) => console.log(err));
  console.log(); // Newline
}

/**
 * Runs all tests defined in object 'tests'
 */
export async function runAllTests() {
  console.log(
    `[EasyLogger-TS] (Before Tests) Logger.options=${Logger.objectToPrettyString(
      Logger.options
    )}`
  );
  for (const [funcName, func] of Object.entries(tests)) {
    await runTest(`[EasyLogger-TS] (string test) ${funcName}`, func, ["string test"]);
    await runTest(`[EasyLogger-TS] (boolean (false) test) ${funcName}`, func, [false]);
    await runTest(`[EasyLogger-TS] (boolean (true) test) ${funcName}`, func, [false]);
    await runTest(`[EasyLogger-TS] (options.silenced=true test) ${funcName}`, func, [false]);
    Logger.setRegularLoggingOnly(true);
    await runTest(`[EasyLogger-TS] (options.regularLoggingOnly=true test) ${funcName}`, func, [false]);
    Logger.setRegularLoggingOnly(false);
    Logger.setThrowOnError(true);
    await runTest(`[EasyLogger-TS] (options.setThrowOnError=true test) ${funcName}`, func, [false]);
    Logger.setThrowOnError(false);
  }
  console.log(
    `[EasyLogger-TS] (After Tests) Logger.options=${Logger.objectToPrettyString(
      Logger.options
    )}`
  );
}

export default {
  tests: tests,
  runTest: runTest,
  runAllTests: runAllTests,
};

if (require.main === module) runAllTests();
