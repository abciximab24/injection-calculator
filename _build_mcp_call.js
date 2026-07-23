const d = require("./to_deploy.cjs");
const fs = require("fs");

// Write each file's raw data to a numbered file for reconstruction verification
// and print a single-line JSON of the full payload to stdout for piping

const payload = {
  target: d.target,
  name: d.name,
  teamId: d.teamId,
  projectSettings: d.projectSettings,
  files: d.files.map((f) => ({ file: f.file, data: f.data })),
};

// Validate
const s = JSON.stringify(payload);
if (s.length !== JSON.stringify(d).length) {
  console.error("size mismatch");
  process.exit(1);
}

// Output only to file (avoid console truncation in shell tools)
fs.writeFileSync("_mcp_tool_input.json", s, "utf8");
console.log("WROTE", s.length, "bytes to _mcp_tool_input.json");
console.log(
  "SHA",
  require("crypto").createHash("sha256").update(s).digest("hex").slice(0, 16)
);
