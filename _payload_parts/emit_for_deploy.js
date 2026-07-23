/**
 * Emits final_deploy.json as a single-line file for MCP tool_input paste.
 * Also writes per-file base64 multi-line for reconstruction if needed.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const d = require(path.join(root, "final_deploy.json"));

// Ensure payload is exact
const outPath = path.join(__dirname, "tool_input.json");
fs.writeFileSync(outPath, JSON.stringify(d));
console.log("wrote", outPath, fs.statSync(outPath).size);

// Also write a copy the agent can require
module.exports = d;
