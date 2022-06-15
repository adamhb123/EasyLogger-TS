import Logger, { setRegularLoggingOnly, setRejectOnLogError } from "./logger";

console.log(
  "[EasyLogger-TS] 'tests' module imported...hopefully intentionally!"
);
/**
 * All available tests, able to be modified for extensibility
 */
export const tests = {
  testSetSilent: (input: boolean) => Logger.setSilent.bind(this, input),
  testSetRejectOnLogError: (input: boolean) =>
    Logger.setRejectOnLogError.bind(this, input),
  testRegularLoggingOnly: (input: boolean) =>
    Logger.setRegularLoggingOnly.bind(null, input),
  testForceLog: (...input: any[]) =>
    Logger.forceLog.bind(this, "", Logger.LogType.DEBUG, ...input),
  testLog: (...input: any[]) => Logger.log.bind(this, "", ...input),
  testDebug: (...input: any[]) => Logger.debug.bind(this, "", ...input),
  testWarn: (...input: any[]) => Logger.warn.bind(this, "", ...input),
  testError: (...input: any[]) => Logger.error.bind(this, "", ...input),
};

type RestParameterizedFunction = (...input: unknown[]) => () => Promise<string>;
type BooleanParameterizedFunction = (
  ...input: unknown[]
) => () => Promise<string>;
/**
 * Runs a test of function given by parameter 'func'
 * @param func - Function to test
 * @param args - Args to test function with
 * @param funcName - Optional | Name of function to test
 */
export async function runTest(
  funcName: string | null,
  func: RestParameterizedFunction | BooleanParameterizedFunction,
  ...args: unknown[]
) {
  const text = `Testing function: ${
    funcName ??
    (Object.prototype.hasOwnProperty.call(func, "name")
      ? func.name
      : "(undefined, possibly due to your ES version (versions < ES6 do not have a name property))")
  }`;
  process.stdout.write(`${text}\n\tFunction logging output: `);
  if (args.length > 0)
    await (<(...input: unknown[]) => () => Promise<string>>func)
      .call(null, ...args)
      .call(null);
  // .then((res: any) => console.log(res)).catch((err: any) => console.log(err));
  else await func.call(null, false).call(null); //.then((res: any) => console.log(res)).catch((err: any) => console.log(err));
  process.stdout.write("\n\n"); // Double Newline
}

/**
 * Runs all tests defined in object 'tests'
 */
export async function runAllTests() {
  await Logger.promisifiedConsoleLog(
    `[EasyLogger-TS] (Before Tests) Logger.options=${await Logger.objectToPrettyString(
      Logger.getOptions()
    )}`
  );
  for (const [funcName, func] of Object.entries(tests)) {
    // string argument test
    await runTest(
      `[EasyLogger-TS] (string test) ${funcName}`,
      <any>func,
      "string test"
    );
    // false argument test (all options get set to false)
    await runTest(
      `[EasyLogger-TS] (all options false test) ${funcName}`,
      <any>func,
      false
    );

    // true argument test (all options get set to true)
    await runTest(
      `[EasyLogger-TS] (all options true test) ${funcName}`,
      <any>func,
      true
    ).catch((err: string) =>
      Logger.warn(
        `Caught the error rejectn by options.rejectOnError=true: ${err}`
      )
    );
    await Logger.setSilent(false);
    await Logger.setRegularLoggingOnly(false);
    await Logger.setRejectOnLogError(false);
    // options.silenced test
    await Logger.setSilent(true);
    await runTest(
      `[EasyLogger-TS] (options.silenced=true test) ${funcName}`,
      <any>func,
      "DON'T LOG ME"
    );
    await Logger.setSilent(false);
    // options.setRegularLoggingOnly test
    await Logger.setRegularLoggingOnly(true);
    await runTest(
      `[EasyLogger-TS] (options.regularLoggingOnly=true test) ${funcName}`,
      <any>func,
      "LOG ME"
    );
    await Logger.setRegularLoggingOnly(false);
    // options.setRejectOnLogError test
    await Logger.setRejectOnLogError(true);
    await runTest(
      `[EasyLogger-TS] (options.setRejectOnLogError=true test) ${funcName}`,
      <any>func,
      "LOG ME"
    ).catch((err: string) =>
      Logger.warn(
        `Caught the error rejectn by options.rejectOnError=true: ${err}`
      )
    );
    await Logger.setRejectOnLogError(false);
  }
  await Logger.promisifiedConsoleLog(
    `\n[EasyLogger-TS] (After Tests) Logger.options=${await Logger.objectToPrettyString(
      Logger.options
    )}`
  );
}

export default {
  tests: tests,
  runTest: runTest,
  runAllTests: runAllTests,
};

function main() {
  runAllTests();
}

if (require.main === module) main();
