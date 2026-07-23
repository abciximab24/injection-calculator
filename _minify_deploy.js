const d = require("./to_deploy.cjs");
const fs = require("fs");

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .trim();
}

const files = d.files.map((f) => {
  if (f.file.endsWith(".css")) {
    return { file: f.file, data: minifyCss(f.data) + "\n" };
  }
  return f;
});

const p = {
  target: d.target,
  name: d.name,
  teamId: d.teamId,
  projectSettings: d.projectSettings,
  files,
};

const s = JSON.stringify(p);
console.log("minified size", s.length, "saved", JSON.stringify(d).length - s.length);
fs.writeFileSync("_min_payload.json", s);

// Also write pure ASCII version
const pure = s.replace(/[^\x00-\x7F]/g, (ch) => {
  return "\\u" + ch.charCodeAt(0).toString(16).padStart(4, "0");
});
fs.writeFileSync("_min_ascii.json", pure);
console.log("ascii size", pure.length, "isAscii", /^[\x00-\x7F]*$/.test(pure));
console.log("parse ok", JSON.parse(pure).files.length);
