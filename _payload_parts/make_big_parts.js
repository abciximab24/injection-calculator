const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "b64s");
const parts = fs.readdirSync(dir).filter((f) => f.endsWith(".txt")).sort();
const b64 = parts
  .map((f) => fs.readFileSync(path.join(dir, f), "utf8").replace(/\s+/g, ""))
  .join("");

const out = path.join(__dirname, "b64big");
fs.mkdirSync(out, { recursive: true });
const chunk = 6000;
let n = 0;
for (let i = 0; i < b64.length; i += chunk) {
  const part = b64.slice(i, i + chunk);
  const wrapped = part.match(/.{1,80}/g).join("\n") + "\n";
  fs.writeFileSync(path.join(out, "b" + n + ".txt"), wrapped);
  n++;
}

const json = Buffer.from(b64, "base64").toString("utf8");
const obj = JSON.parse(json);
const orig = require("../final_deploy.json");
console.log("big parts", n);
console.log("match", JSON.stringify(obj) === JSON.stringify(orig));
console.log(
  JSON.stringify({
    target: obj.target,
    name: obj.name,
    files: obj.files.length,
  })
);
