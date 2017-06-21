import * as tslint from "tslint";
import * as fs from "fs";
import * as argv from "minimist";
import * as glob from "glob";

var configuration = JSON.parse(fs.readFileSync(argv.config || './tslint.json', 'utf8'));

console.log(configuration);

// let options: tslint.ILinterOptions = {
//     fix: false
// }

// let linter = new tslint.Linter(options);
