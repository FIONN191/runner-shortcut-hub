const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const extensionRoot = path.join(root, "outputs", "chrome-new-tab-dashboard-extension");
const app = fs.readFileSync(path.join(extensionRoot, "app.js"), "utf8");
const html = fs.readFileSync(path.join(extensionRoot, "newtab.html"), "utf8");
const baseStyles = fs.readFileSync(path.join(extensionRoot, "styles.css"), "utf8");
const styles = fs.readFileSync(path.join(extensionRoot, "styles", "v2.css"), "utf8");

assert.doesNotMatch(app, /\balert\s*\(/);
assert.doesNotMatch(app, /\bconfirm\s*\(/);
assert.doesNotMatch(app, /\bprompt\s*\(/);
assert.match(app, /function openConfirmDialog\(/);
assert.match(app, /function openTextPrompt\(/);
assert.match(app, /function showToast\(/);
assert.match(html, /id="feedbackDialog"/);
assert.match(html, /id="bookmarkImportDialog"/);
assert.match(html, /id="importBookmarksBtn"/);
assert.match(html, /id="toastRegion"/);
assert.match(styles, /\.toast-region\s*\{/);
assert.match(styles, /\.feedback-modal\s*\{/);
assert.doesNotMatch(styles, /animation:\s*runner-enter/);
assert.match(app, /els\.searchEngineBtn\.textContent = t\("searchEngine"\)/);
assert.doesNotMatch(app, /state\.showSearchHistory = !state\.showSearchHistory/);
assert.match(app, /showSearchHistoryPanel\(true\)/);
assert.match(app, /function showSearchHistoryPanel\(forceOpen = false\)/);
assert.match(baseStyles, /\.topbar\s*\{[^}]*z-index:\s*50/s);
assert.match(baseStyles, /\.search-history-panel\s*\{[^}]*z-index:\s*200/s);

console.log("Interaction v2 tests passed");
