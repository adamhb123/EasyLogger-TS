# EasyLogger-TS
EasyLogger-TS is a simple logging module to aid in debugging. All functions
are asynchronous by default, but soon(tm) every async function will have a
synchronous counterpart.

## Installation
```
npm install easylogger-ts --save
```
## Usage
```
const { Logger } = require("easylogger-ts");
// Outputs: 
Logger.log("Log function");
// Outputs: [EasyLogger-TS][DEBUG] Debug function
Logger.debug("Debug function");
[EasyLogger-TS][WARN] Warn function
Logger.warn("Warn function");
[EasyLogger-TS][DEBUG] Debug function
Logger.error("Error function");
```