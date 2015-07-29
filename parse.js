import fs from "fs";
import url from "url";
import ejs from "ejs";
import program from "commander";
import Parser from "./parser";

program
  .usage("[options] <url>")
  .option("-l --limit <limit>", "Maximum number of packages to parse", parseInt)
  .parse(process.argv);

let siteURL = program.args[0];
let limit = program.limit;

if (siteURL) {

  if (!/https?:\/\//.test(siteURL)) {
    siteURL = "http://" + siteURL;
  }

  let parser = new Parser({ url: siteURL, limit });

  parser.parseAll().then(json => {
    let fileName = url.parse(siteURL).hostname.replace(/\./g, "_") + ".json";
    console.log(`Storing results in public/output/${fileName}`.bold);
    fs.writeFileSync(`public/output/${fileName}`, JSON.stringify(json));
    rebuild();
  }, error => {
    console.error(error);
  });
} else {
  rebuild();
}


function rebuild() {
  console.log("Rebuilding index.html...");
  let template = fs.readFileSync("views/index.ejs").toString();
  fs.readdir("public/output", function(error, files) {
    fs.writeFileSync("public/index.html", ejs.render(template, { files }, {}));
  });
}
