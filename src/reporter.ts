import * as tslint from "tslint";
import * as fs from "fs";

export interface ILintError {
    severity: string;
    line: number;
    column: number;
    message: string;
    source: string;
}

export interface IErrorList {
    [filename: string]: ILintError[];
}

export class Reporter {
    private pairs: {[index: string]: string} = {
                "&": "&amp;",
                '"': "&quot;",
                "'": "&apos;",
                "<": "&lt;",
                ">": "&gt;"
            };

    report(results: tslint.RuleFailure[], verbose?: boolean, outfile?: string): void {
        let files: IErrorList = {};
        let out: string[] = [];

        results.forEach((result: tslint.RuleFailure) => {
            // Register the file
            let filename = result.getFileName();
            filename = filename.replace(/^\.\//, '');
            if (!files[filename]) {
                files[filename] = [];
            }

            // Create the error message
            let errorMessage = result.getFailure();
            if (verbose) {
                errorMessage += ' (' + result.getRuleName() + ')';
            }

            // Add the error
            files[filename].push({
                severity: 'error',
                line: result.getStartPosition().getLineAndCharacter().line + 1,
                column: result.getStartPosition().getLineAndCharacter().character,
                message: errorMessage,
                source: 'tslint.' + result.getRuleName()
            });
        });


        out.push("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
        out.push("<checkstyle version=\"4.3\">");

        for (let fileName in files) {
            if (files.hasOwnProperty(fileName)) {
                out.push("\t<file name=\"" + fileName + "\">");
                for (let i = 0; i < files[fileName].length; i++) {
                    let issue = files[fileName][i];
                    out.push(
                    "\t\t<error " +
                        "line=\"" + issue.line + "\" " +
                        "column=\"" + issue.column + "\" " +
                        "severity=\"" + issue.severity + "\" " +
                        "message=\"" + this.encode(issue.message) + "\" " +
                        "source=\"" + this.encode(issue.source) + "\" " +
                        "/>"
                    );
                }
                out.push("\t</file>");
            }
        }

        out.push("</checkstyle>");

        let filename = outfile || "checkstyle.xml";
        fs.writeFileSync(filename, out.join('\n'));

        console.log("Output written to " + filename);
    }

    private encode(s: string): string {
        for (let r in this.pairs) {
            if (typeof(s) !== "undefined") {
                s = s.replace(new RegExp(r, "g"), this.pairs[r]);
            }
        }
        return s || "";
    }
}
