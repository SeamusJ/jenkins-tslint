import * as tslint from "tslint";
import * as fs from "fs";
import * as parseArgs from "minimist";
import * as glob from "glob";
import { Reporter } from "./reporter";

let argv = parseArgs(process.argv.slice(2));

let configurationLoadResult: tslint.Configuration.IConfigurationLoadResult = tslint.Configuration.findConfiguration(null, "./");
let configuration = configurationLoadResult.results;

let options: tslint.ILinterOptions = {
    fix: false,
    formatter: "json"
};

let files = glob.sync(argv._[0]);

let results: tslint.RuleFailure[] = [];
let linter = new tslint.Linter(options);

files.forEach((filename: string) => {
    let contents = fs.readFileSync(filename, "utf8");

    linter.lint(filename, contents, configuration);
    let failures = linter.getResult().failures;

    for (let failure of failures) {
        results.push(failure);
    }
});

let reporter = new Reporter();

reporter.report(results);