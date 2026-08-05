const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const extensionRoot = path.join(root, "outputs", "chrome-new-tab-dashboard-extension");
const app = fs.readFileSync(path.join(extensionRoot, "app.js"), "utf8");
const html = fs.readFileSync(path.join(extensionRoot, "newtab.html"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(extensionRoot, "manifest.json"), "utf8"));

assert.equal(manifest.chrome_url_overrides.newtab, "newtab.html");
assert.equal(manifest.permissions.includes("bookmarks"), true);
assert.equal(manifest.permissions.includes("management"), true);
assert.equal(manifest.permissions.includes("unlimitedStorage"), true);

assert.match(app, /async function disableExtension\(\)/);
assert.match(app, /const extensionId = globalThis\.chrome\?\.runtime\?\.id/);
assert.match(app, /setEnabled\.call\(chrome\.management, extensionId, false\)/);
assert.doesNotMatch(app, /window\.location\.assign\("chrome:\/\/new-tab-page\/"\)/);
assert.match(app, /const mode = "runner";/);
assert.match(app, /if \(data\.mode === "classic"\) needsDataMigration = true;/);
assert.match(app, /nativeHome: "关闭插件"/);
assert.match(app, /nativeHome: "Disable Extension"/);

assert.match(html, /id="importBookmarksBtn"/);
assert.match(html, /id="bookmarkImportDialog"/);
assert.match(html, /src="src\/core\/bookmark-import\.js"/);

console.log("Extension disable and permission tests passed");
