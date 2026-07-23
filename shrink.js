const fs = require("fs");
const p = require("./min_deploy.json");
const css = p.files.find((f) => f.file.includes("css"));
css.data = css.data
  .replace(/\s*\{\s*/g, "{")
  .replace(/\s*\}\s*/g, "}")
  .replace(/\s*:\s*/g, ":")
  .replace(/\s*;\s*/g, ";")
  .replace(/\n+/g, "");
fs.writeFileSync("min_deploy.json", JSON.stringify(p));
console.log("size", fs.statSync("min_deploy.json").size);
p.files.forEach((f) => console.log(f.file, f.data.length));
