const fs = require("fs");
const files = require("./full_deploy_files.json");

const page = files.find((f) => f.file.endsWith("page.tsx"));
const css = files.find((f) => f.file.endsWith("globals.css"));

function shrink(s) {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{2,}/g, "\n");
}

page.data = shrink(page.data);
css.data = shrink(css.data);

const payload = {
  target: "production",
  name: "injection-calculator",
  teamId: "team_hC9PnVUFWAJDr1j3L9QwNZkZ",
  projectSettings: { framework: "nextjs" },
  files,
};

fs.writeFileSync("min_deploy.json", JSON.stringify(payload));
console.log("size", fs.statSync("min_deploy.json").size);
files.forEach((f) => console.log(f.file, f.data.length));
