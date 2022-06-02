import Logger from "./logger";

console.log("[EasyLoggerTS]: 'tests' module imported...hopefully intentionally!");

/**
 * All available tests, able to be modified for extensibility
 */
export let tests = {
  testForceLog: (...input: any[]) => Logger.forceLog("", Logger.LogType.DEBUG, ...input),
  testSetSilent: (silent: boolean) => Logger.setSilent(silent),
  testSetThrowOnError: (throwOnError: boolean) => Logger.setThrowOnError(throwOnError),
  testConsoleLogOnly: (consoleLogOnly: boolean) => Logger.setConsoleLogOnly(consoleLogOnly),
  testLog: (...input: any[]) => Logger.log("", ...input),
  testDebug: (...input: any[]) => Logger.debug("", ...input),
  testWarn: (...input: any[]) => Logger.warn("", ...input),
  testError: (...input: any[]) => Logger.error("", ...input),
}

/**
 * Runs a test of function given by parameter 'func'
 * @param func - Function to test
 * @param funcName - Optional | Name of function to test
 */
export function runTest(func: Function, funcName?: string) {
  console.log(`Logger.options=${Logger.options}`)
  const text = `Testing function: ${funcName ? funcName : func.hasOwnProperty("name") ? func.name : "(undefined, as functions in this version of TS/JS do not have a name property)"}`; 
  process.stdout.write(`${text}\nOutput: `);
  func(text);
}

/**
 * Runs all tests defined in object 'tests'
 */
export function runAllTests() {
  for(const [funcName, func] of Object.entries(tests)){
    runTest(func, funcName);
  }
}

export default {
  tests: tests,
  runTest: runTest,
  runAllTests: runAllTests
}

if (require.main === module) runAllTests();
