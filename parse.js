import fs from "fs";
import url from "url";
import program from "commander";
import Parser from "./parser";

program
  .usage("[options] <url>")
  .option("-l --limit <limit>", "Maximum number of packages to parse", parseInt)
  .parse(process.argv);

let siteURL = program.args[0];
let limit = program.limit;

if (!/https?:\/\//.test(siteURL)) {
  siteURL = "http://" + siteURL;
}

let parser = new Parser({ url: siteURL, limit });

parser.parseAll().then(json => {
  let fileName = url.parse(siteURL).hostname.replace(/\./g, "_") + ".json";
  console.log(`Storing results in output/${fileName}`.bold);
  fs.writeFileSync(`output/${fileName}`, JSON.stringify(json));
});
