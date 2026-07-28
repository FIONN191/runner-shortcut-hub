const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appPath = path.resolve(
  __dirname,
  "..",
  "outputs",
  "chrome-new-tab-dashboard-extension",
  "app.js"
);
const source = fs.readFileSync(appPath, "utf8");
const start = source.indexOf("function classifyIconPixels(");
const end = source.indexOf("\nfunction iconCandidates(", start);

assert.notEqual(start, -1, "classifyIconPixels must exist");
assert.notEqual(end, -1, "icon classifier block must remain extractable");

const context = {};
vm.createContext(context);
vm.runInContext(`${source.slice(start, end)}\nglobalThis.classifyIconPixels = classifyIconPixels;`, context);

function pixels(width, height, color, alpha = 255) {
  return Uint8ClampedArray.from(
    Array.from({ length: width * height }, () => [...color, alpha]).flat()
  );
}

const transparent = pixels(4, 4, [255, 0, 0], 0);
assert.equal(context.classifyIconPixels(transparent, 4, 4), "alpha");

const roundedLightTile = pixels(4, 4, [242, 242, 242]);
roundedLightTile[3] = 0;
assert.equal(context.classifyIconPixels(roundedLightTile, 4, 4), "opaque-light");

const dark = pixels(4, 4, [12, 12, 12]);
assert.equal(context.classifyIconPixels(dark, 4, 4), "opaque-dark");

const light = pixels(4, 4, [242, 242, 242]);
assert.equal(context.classifyIconPixels(light, 4, 4), "opaque-light");

console.log("Minimal theme icon tests passed");
