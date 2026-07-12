const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const extensionRoot = path.join(root, "outputs", "chrome-new-tab-dashboard-extension");
const app = fs.readFileSync(path.join(extensionRoot, "app.js"), "utf8");
const html = fs.readFileSync(path.join(extensionRoot, "newtab.html"), "utf8");

assert.match(app, /const DATA_BACKUP_TYPE = "runner-shortcut-hub-data-backup"/);
assert.match(app, /const DATA_BACKUP_VERSION = 2/);
assert.match(app, /function exportCompleteData\(/);
assert.match(app, /async function onDataBackupFileChange\(/);
assert.match(app, /function validateAndNormalizeDataBackup\(/);
assert.match(app, /await writeDataSnapshot\(candidate\);\s*state = candidate;/);
assert.match(app, /designTheme:\s*designThemes\.some/);
assert.match(html, /id="exportDataBtn"/);
assert.match(html, /id="importDataBtn"/);
assert.match(html, /id="dataBackupFileInput"[^>]+accept="\.json,application\/json"/);

console.log("Data backup v2 tests passed");
