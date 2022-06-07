# EasyLogger-TS
EasyLogger-TS is a simple logging module to aid in debugging. All functions
are asynchronous by default, but soon(tm) every async function will have a
synchronous counterpart.

## Installation
```
npm install easylogger-ts --save
```
## Basic Usage
```
const { Logger } = require("easylogger-ts");
// Outputs: [EasyLogger-TS][LOG] Log function
Logger.log("Log function");
// Outputs: [EasyLogger-TS][DEBUG] Debug function
Logger.debug("Debug function");
// Outputs: [EasyLogger-TS][WARN] Warn function
Logger.warn("Warn function");
// Outputs: [EasyLogger-TS][ERROR] Error function
Logger.error("Error function");
```
## Advanced Usage
For more advanced use cases and functionality, take a peek at the functions exported in src/logger.ts and src/tests.ts, and their relevant source documentation
