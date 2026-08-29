const STORAGE_KEY = "shortcutDashboardData";
const UI_PREFERENCES_KEY = "runnerShortcutHubUiPreferences";
const UI_PREFERENCES_VERSION = 1;
const SEARCH_HISTORY_LIMIT = 12;
const SEARCH_SUGGESTION_LIMIT = 10;
const BACKGROUND_IMAGE_MAX_WIDTH = 1440;
const BACKGROUND_IMAGE_MAX_HEIGHT = 900;
const BACKGROUND_IMAGE_QUALITY = 0.72;
const BACKGROUND_IMAGE_OPTIMIZE_THRESHOLD = 520000;
const BACKGROUND_STORAGE_OPTIMIZE_THRESHOLD = 1200000;
const APPEARANCE_PRESET_IMPORT_TYPE = "runner-shortcut-hub-appearance-preset";
const APPEARANCE_PRESET_IMPORT_VERSION = 1;
const APPEARANCE_PRESET_IMPORT_MAX_BYTES = 5 * 1024 * 1024;
const DATA_BACKUP_TYPE = "runner-shortcut-hub-data-backup";
const DATA_BACKUP_VERSION = 2;
const DATA_BACKUP_MAX_BYTES = 20 * 1024 * 1024;
const IMPORTED_WALLPAPER_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const IMPORTED_APPEARANCE_FIELDS = new Set([
  "designTheme",
  "theme",
  "background",
  "activeCustomBackgroundId",
  "accentColor",
  "backgroundOpacity",
  "backgroundBlur",
  "panelOpacity",
  "panelBlur",
  "iconRadius",
  "iconRadiusUnit",
  "cardRadius",
  "panelRadius",
  "buttonRadius",
  "cornerAccentsEnabled",
  "fontScale",
  "cardDensity"
]);

const defaultSearchEngines = [
  { id: "google", name: "Google", shortcut: "GO", searchUrl: "https://www.google.com/search?q={query}", builtin: true },
  { id: "bing", name: "Bing", shortcut: "BI", searchUrl: "https://www.bing.com/search?q={query}", builtin: true },
  { id: "duckduckgo", name: "DuckDuckGo", shortcut: "DDG", searchUrl: "https://duckduckgo.com/?q={query}", builtin: true },
  { id: "baidu", name: "百度", shortcut: "BD", searchUrl: "https://www.baidu.com/s?wd={query}", builtin: true },
  { id: "youtube", name: "YouTube", shortcut: "YT", searchUrl: "https://www.youtube.com/results?search_query={query}", builtin: true },
  { id: "rednote", name: "小红书", shortcut: "RED", searchUrl: "https://www.xiaohongshu.com/search_result?keyword={query}", builtin: true },
  { id: "bilibili", name: "Bilibili", shortcut: "BILI", searchUrl: "https://search.bilibili.com/all?keyword={query}", builtin: true }
];

const defaultData = {
  schemaVersion: 2,
  locale: "zh-CN",
  mode: "runner",
  searchEngines: structuredClone(defaultSearchEngines),
  activeSearchEngineId: "google",
  appearance: {
    designTheme: "lost-starship",
    theme: "dark",
    background: "runner-grid",
    customBackgroundImages: [],
    activeCustomBackgroundId: "",
    accentColor: "#d8ff3d",
    backgroundOpacity: 1,
    backgroundBlur: 0,
    panelOpacity: 0.94,
    panelBlur: 0,
    iconRadius: 8,
    iconRadiusUnit: "px",
    cardRadius: 0,
    panelRadius: 0,
    buttonRadius: 0,
    cornerAccentsEnabled: false,
    fontScale: 1,
    cardDensity: "comfortable"
  },
  appearancePresets: [],
  activeAppearancePresetId: "",
  commonShortcutsSeeded: true,
  searchHistory: [],
  showSearchHistory: true,
  sortShortcutsByUsage: false,
  categories: [
    { id: "ai-tools", name: "AI 工具", icon: "AI", order: 0, useCount: 0 },
    { id: "social", name: "社媒平台", icon: "社", order: 1, useCount: 0 },
    { id: "common", name: "常用", icon: "+", order: 2, useCount: 0 },
    { id: "video", name: "视频创作", icon: "影", order: 3, useCount: 0 },
    { id: "assets", name: "素材灵感", icon: "灵", order: 4, useCount: 0 },
    { id: "work", name: "工作后台", icon: "工", order: 5, useCount: 0 },
    { id: "projects", name: "项目常用", icon: "项", order: 6, useCount: 0 },
    { id: "custom", name: "自定义", icon: "+", order: 7, useCount: 0 }
  ],
  shortcuts: [
    { id: "chatgpt", categoryId: "ai-tools", title: "ChatGPT", url: "https://chatgpt.com/", color: "#f2f6f3" },
    { id: "claude", categoryId: "ai-tools", title: "Claude", url: "https://claude.ai/", color: "#f4b168" },
    { id: "fotor", categoryId: "ai-tools", title: "Fotor", url: "https://www.fotor.com/", color: "#f7d94c" },
    { id: "higgsfield", categoryId: "ai-tools", title: "Higgsfield", url: "https://higgsfield.ai/", color: "#d8ff3f" },
    { id: "kimi", categoryId: "ai-tools", title: "Kimi", url: "https://kimi.moonshot.cn/", color: "#78d7ff" },
    { id: "rednote", categoryId: "social", title: "小红书", url: "https://www.xiaohongshu.com/", color: "#ff3f52" },
    { id: "tiktok", categoryId: "social", title: "TikTok", url: "https://www.tiktok.com/", color: "#55f7ff" },
    { id: "youtube", categoryId: "social", title: "YouTube", url: "https://www.youtube.com/", color: "#ff4d4d" },
    { id: "bilibili", categoryId: "social", title: "Bilibili", url: "https://www.bilibili.com/", color: "#6ad6ff" },
    { id: "common-chatgpt", categoryId: "common", title: "ChatGPT", url: "https://chatgpt.com/", color: "#f2f6f3" },
    { id: "common-claude", categoryId: "common", title: "Claude", url: "https://claude.ai/", color: "#f4b168" },
    { id: "common-ai-studio", categoryId: "common", title: "Google AI Studio", url: "https://aistudio.google.com/", color: "#8fd3ff" },
    { id: "common-fotor", categoryId: "common", title: "Fotor", url: "https://www.fotor.com/", color: "#f7d94c" },
    { id: "common-rednote", categoryId: "common", title: "小红书", url: "https://www.xiaohongshu.com/", color: "#ff3f52" },
    { id: "common-youtube", categoryId: "common", title: "YouTube", url: "https://www.youtube.com/", color: "#ff4d4d" },
    { id: "common-qianwen", categoryId: "common", title: "通义千问", url: "https://tongyi.aliyun.com/qianwen/", color: "#76c7ff" },
    { id: "common-wps", categoryId: "common", title: "WPS Office", url: "https://www.wps.cn/", color: "#ff6b6b" },
    { id: "common-dingtalk", categoryId: "common", title: "钉钉", url: "https://im.dingtalk.com/", color: "#70a7ff" },
    { id: "common-quark", categoryId: "common", title: "夸克网盘", url: "https://pan.quark.cn/", color: "#c6f6d5" },
    { id: "pinterest", categoryId: "assets", title: "Pinterest", url: "https://www.pinterest.com/", color: "#ff6b7a" },
    { id: "flow", categoryId: "video", title: "Flow", url: "https://labs.google/fx/tools/flow", color: "#ffffff" },
    { id: "runway", categoryId: "video", title: "Runway", url: "https://runwayml.com/", color: "#b6f09c" },
    { id: "capcut", categoryId: "video", title: "CapCut", url: "https://www.capcut.com/", color: "#9ae6ff" },
    { id: "github", categoryId: "work", title: "GitHub", url: "https://github.com/", color: "#e5e7eb" },
    { id: "netlify", categoryId: "work", title: "Netlify", url: "https://app.netlify.com/", color: "#67e8f9" },
    { id: "vercel", categoryId: "work", title: "Vercel", url: "https://vercel.com/dashboard", color: "#f8fafc" },
    { id: "tencent-cloud", categoryId: "work", title: "腾讯云", url: "https://console.cloud.tencent.com/", color: "#70a7ff" },
    { id: "nanhong", categoryId: "projects", title: "南虹官网", url: "https://nanhong-website-fod00bjf.edgeone.cool/index.html", color: "#a7f3d0" },
    { id: "babydance", categoryId: "projects", title: "Babydance", url: "https://www.tiktok.com/", color: "#ffc0d9" },
    { id: "douyin-ad", categoryId: "projects", title: "剧情广告", url: "https://www.xiaohongshu.com/", color: "#ffd166" }
  ],
  activeCategoryId: "ai-tools"
};

let state = structuredClone(defaultData);
let categoryIconImageDraft = "";
let needsDataMigration = false;
let backgroundStorageOptimizationScheduled = false;
let pendingImportedPresetId = "";
let presetImportResultState = null;
let feedbackResolver = null;
let bookmarkImportGroups = [];
let bookmarkImportSelectedIds = new Set();
let bookmarkImportBusy = false;
let focusSearchMatches = [];
let focusSearchActiveIndex = -1;
let focusSearchOpening = false;
const CATEGORY_LONG_PRESS_MS = 500;
const CATEGORY_DRAG_MOVE_PX = 7;
const SHORTCUT_LONG_PRESS_MS = 500;

const categoryDrag = {
  timer: 0,
  pointerId: null,
  sourceId: "",
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  dragging: false,
  suppressClick: false,
  ghost: null,
  sourceButton: null,
  dropTarget: null
};

const shortcutDrag = {
  timer: 0,
  pointerId: null,
  sourceId: "",
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  dragging: false,
  suppressClick: false,
  ghost: null,
  sourceCard: null,
  dropTarget: null
};

const els = {
  doc: document.documentElement,
  globalRail: document.querySelector("#globalRail"),
  railHomeBtn: document.querySelector("#railHomeBtn"),
  railSearchBtn: document.querySelector("#railSearchBtn"),
  railCategoriesBtn: document.querySelector("#railCategoriesBtn"),
  railCustomizeBtn: document.querySelector("#railCustomizeBtn"),
  topbar: document.querySelector("#topbar"),
  brandKicker: document.querySelector("#brandKicker"),
  brandTitle: document.querySelector("#brandTitle"),
  todayText: document.querySelector("#todayText"),
  shortcutTotal: document.querySelector("#shortcutTotal"),
  categoryTotal: document.querySelector("#categoryTotal"),
  languageToggleBtn: document.querySelector("#languageToggleBtn"),
  customizeBtn: document.querySelector("#customizeBtn"),
  nativeHomeBtn: document.querySelector("#nativeHomeBtn"),
  runnerHomeBtn: document.querySelector("#runnerHomeBtn"),
  classicLanguageBtn: document.querySelector("#classicLanguageBtn"),
  classicHome: document.querySelector("#classicHome"),
  classicSearchForm: document.querySelector("#classicSearchForm"),
  classicSearchInputLabel: document.querySelector("#classicSearchInputLabel"),
  classicSearchInput: document.querySelector("#classicSearchInput"),
  classicShortcutGrid: document.querySelector("#classicShortcutGrid"),
  systemPanel: document.querySelector("#systemPanel"),
  sidebar: document.querySelector("#sidebar"),
  signalLabel: document.querySelector("#signalLabel"),
  clustersStatLabel: document.querySelector("#clustersStatLabel"),
  clustersLabel: document.querySelector("#clustersLabel"),
  searchPrefix: document.querySelector("#searchPrefix"),
  searchForm: document.querySelector("#searchForm"),
  searchInputLabel: document.querySelector("#searchInputLabel"),
  searchInput: document.querySelector("#searchInput"),
  searchEngineBtn: document.querySelector("#searchEngineBtn"),
  searchClearBtn: document.querySelector("#searchClearBtn"),
  searchSubmitBtn: document.querySelector("#searchSubmitBtn"),
  historyToggleBtn: document.querySelector("#historyToggleBtn"),
  searchHistoryPanel: document.querySelector("#searchHistoryPanel"),
  searchPanelTitle: document.querySelector("#searchPanelTitle"),
  searchSuggestionList: document.querySelector("#searchSuggestionList"),
  clearHistoryBtn: document.querySelector("#clearHistoryBtn"),
  hideHistoryBtn: document.querySelector("#hideHistoryBtn"),
  focusSearchDialog: document.querySelector("#focusSearchDialog"),
  focusSearchEyebrow: document.querySelector("#focusSearchEyebrow"),
  focusSearchDialogTitle: document.querySelector("#focusSearchDialogTitle"),
  closeFocusSearchBtn: document.querySelector("#closeFocusSearchBtn"),
  focusSearchInputLabel: document.querySelector("#focusSearchInputLabel"),
  focusSearchInput: document.querySelector("#focusSearchInput"),
  clearFocusSearchBtn: document.querySelector("#clearFocusSearchBtn"),
  focusSearchStatus: document.querySelector("#focusSearchStatus"),
  focusSearchResults: document.querySelector("#focusSearchResults"),
  categoryList: document.querySelector("#categoryList"),
  shortcutGrid: document.querySelector("#shortcutGrid"),
  emptyState: document.querySelector("#emptyState"),
  panelEyebrow: document.querySelector("#panelEyebrow"),
  activeCategoryName: document.querySelector("#activeCategoryName"),
  addCategoryBtn: document.querySelector("#addCategoryBtn"),
  editCategoryBtn: document.querySelector("#editCategoryBtn"),
  addShortcutBtn: document.querySelector("#addShortcutBtn"),
  categoryDialog: document.querySelector("#categoryDialog"),
  categoryForm: document.querySelector("#categoryForm"),
  categoryDialogTitle: document.querySelector("#categoryDialogTitle"),
  categoryId: document.querySelector("#categoryId"),
  categoryNameInput: document.querySelector("#categoryNameInput"),
  categoryIconInput: document.querySelector("#categoryIconInput"),
  categoryIconPreview: document.querySelector("#categoryIconPreview"),
  categoryIconFileInput: document.querySelector("#categoryIconFileInput"),
  uploadCategoryIconBtn: document.querySelector("#uploadCategoryIconBtn"),
  removeCategoryIconBtn: document.querySelector("#removeCategoryIconBtn"),
  categoryError: document.querySelector("#categoryError"),
  deleteCategoryBtn: document.querySelector("#deleteCategoryBtn"),
  moveCategoryUpBtn: document.querySelector("#moveCategoryUpBtn"),
  moveCategoryDownBtn: document.querySelector("#moveCategoryDownBtn"),
  cancelCategoryBtn: document.querySelector("#cancelCategoryBtn"),
  saveCategoryBtn: document.querySelector("#saveCategoryBtn"),
  searchEngineDialog: document.querySelector("#searchEngineDialog"),
  searchEngineDialogTitle: document.querySelector("#searchEngineDialogTitle"),
  searchEngineList: document.querySelector("#searchEngineList"),
  searchEngineForm: document.querySelector("#searchEngineForm"),
  searchEngineFormTitle: document.querySelector("#searchEngineFormTitle"),
  newSearchEngineBtn: document.querySelector("#newSearchEngineBtn"),
  searchEngineId: document.querySelector("#searchEngineId"),
  searchEngineNameInput: document.querySelector("#searchEngineNameInput"),
  searchEngineShortcutInput: document.querySelector("#searchEngineShortcutInput"),
  searchEngineUrlInput: document.querySelector("#searchEngineUrlInput"),
  searchEngineTemplateHelp: document.querySelector("#searchEngineTemplateHelp"),
  searchEngineError: document.querySelector("#searchEngineError"),
  deleteSearchEngineBtn: document.querySelector("#deleteSearchEngineBtn"),
  cancelSearchEngineBtn: document.querySelector("#cancelSearchEngineBtn"),
  saveSearchEngineBtn: document.querySelector("#saveSearchEngineBtn"),
  customizeDialog: document.querySelector("#customizeDialog"),
  customizeDialogTitle: document.querySelector("#customizeDialogTitle"),
  designThemeTitle: document.querySelector("#designThemeTitle"),
  designThemeOptions: document.querySelector("#designThemeOptions"),
  languageTitle: document.querySelector("#languageTitle"),
  languageOptions: document.querySelector("#languageOptions"),
  appearanceTitle: document.querySelector("#appearanceTitle"),
  appearanceOptions: document.querySelector("#appearanceOptions"),
  themeColorTitle: document.querySelector("#themeColorTitle"),
  themeColorOptions: document.querySelector("#themeColorOptions"),
  themeColorInput: document.querySelector("#themeColorInput"),
  customThemeColorLabel: document.querySelector("#customThemeColorLabel"),
  appearancePresetTitle: document.querySelector("#appearancePresetTitle"),
  appearancePresetFileInput: document.querySelector("#appearancePresetFileInput"),
  importAppearancePresetBtn: document.querySelector("#importAppearancePresetBtn"),
  saveAppearancePresetBtn: document.querySelector("#saveAppearancePresetBtn"),
  updateAppearancePresetBtn: document.querySelector("#updateAppearancePresetBtn"),
  exportAppearancePresetBtn: document.querySelector("#exportAppearancePresetBtn"),
  appearancePresetList: document.querySelector("#appearancePresetList"),
  presetImportResultDialog: document.querySelector("#presetImportResultDialog"),
  presetImportResultTitle: document.querySelector("#presetImportResultTitle"),
  presetImportResultMessage: document.querySelector("#presetImportResultMessage"),
  presetImportResultWarning: document.querySelector("#presetImportResultWarning"),
  closePresetImportResultBtn: document.querySelector("#closePresetImportResultBtn"),
  keepCurrentAppearanceBtn: document.querySelector("#keepCurrentAppearanceBtn"),
  applyImportedPresetBtn: document.querySelector("#applyImportedPresetBtn"),
  dismissPresetImportResultBtn: document.querySelector("#dismissPresetImportResultBtn"),
  sizeRadiusTitle: document.querySelector("#sizeRadiusTitle"),
  iconRadiusLabel: document.querySelector("#iconRadiusLabel"),
  iconRadiusInput: document.querySelector("#iconRadiusInput"),
  iconRadiusValue: document.querySelector("#iconRadiusValue"),
  iconRadiusQuickOptions: document.querySelector("#iconRadiusQuickOptions"),
  cardRadiusLabel: document.querySelector("#cardRadiusLabel"),
  cardRadiusInput: document.querySelector("#cardRadiusInput"),
  cardRadiusValue: document.querySelector("#cardRadiusValue"),
  panelRadiusLabel: document.querySelector("#panelRadiusLabel"),
  panelRadiusInput: document.querySelector("#panelRadiusInput"),
  panelRadiusValue: document.querySelector("#panelRadiusValue"),
  buttonRadiusLabel: document.querySelector("#buttonRadiusLabel"),
  buttonRadiusInput: document.querySelector("#buttonRadiusInput"),
  buttonRadiusValue: document.querySelector("#buttonRadiusValue"),
  cornerAccentsLabel: document.querySelector("#cornerAccentsLabel"),
  cornerAccentsDescription: document.querySelector("#cornerAccentsDescription"),
  cornerAccentsInput: document.querySelector("#cornerAccentsInput"),
  fontScaleLabel: document.querySelector("#fontScaleLabel"),
  fontScaleInput: document.querySelector("#fontScaleInput"),
  fontScaleValue: document.querySelector("#fontScaleValue"),
  cardDensityLabel: document.querySelector("#cardDensityLabel"),
  cardDensityOptions: document.querySelector("#cardDensityOptions"),
  shortcutSettingsTitle: document.querySelector("#shortcutSettingsTitle"),
  sortShortcutsByUsageLabel: document.querySelector("#sortShortcutsByUsageLabel"),
  sortShortcutsByUsageDescription: document.querySelector("#sortShortcutsByUsageDescription"),
  sortShortcutsByUsageInput: document.querySelector("#sortShortcutsByUsageInput"),
  shapePreviewCardLabel: document.querySelector("#shapePreviewCardLabel"),
  shapePreviewButton: document.querySelector("#shapePreviewButton"),
  wallpaperTitle: document.querySelector("#wallpaperTitle"),
  backgroundGrid: document.querySelector("#backgroundGrid"),
  backgroundOpacityInput: document.querySelector("#backgroundOpacityInput"),
  backgroundOpacityValue: document.querySelector("#backgroundOpacityValue"),
  backgroundOpacityLabel: document.querySelector("#backgroundOpacityLabel"),
  backgroundBlurInput: document.querySelector("#backgroundBlurInput"),
  backgroundBlurValue: document.querySelector("#backgroundBlurValue"),
  backgroundBlurLabel: document.querySelector("#backgroundBlurLabel"),
  panelOpacityInput: document.querySelector("#panelOpacityInput"),
  panelOpacityValue: document.querySelector("#panelOpacityValue"),
  panelOpacityLabel: document.querySelector("#panelOpacityLabel"),
  panelBlurInput: document.querySelector("#panelBlurInput"),
  panelBlurValue: document.querySelector("#panelBlurValue"),
  panelBlurLabel: document.querySelector("#panelBlurLabel"),
  backgroundFileInput: document.querySelector("#backgroundFileInput"),
  uploadBackgroundBtn: document.querySelector("#uploadBackgroundBtn"),
  removeBackgroundBtn: document.querySelector("#removeBackgroundBtn"),
  dataTransferTitle: document.querySelector("#dataTransferTitle"),
  dataTransferCopy: document.querySelector("#dataTransferCopy"),
  dataBackupFileInput: document.querySelector("#dataBackupFileInput"),
  importBookmarksBtn: document.querySelector("#importBookmarksBtn"),
  exportDataBtn: document.querySelector("#exportDataBtn"),
  importDataBtn: document.querySelector("#importDataBtn"),
  resetAppearanceBtn: document.querySelector("#resetAppearanceBtn"),
  resetTitle: document.querySelector("#resetTitle"),
  resetDescription: document.querySelector("#resetDescription"),
  resetAppearanceDialog: document.querySelector("#resetAppearanceDialog"),
  resetAppearanceDialogTitle: document.querySelector("#resetAppearanceDialogTitle"),
  resetAppearanceMessage: document.querySelector("#resetAppearanceMessage"),
  closeResetAppearanceDialogBtn: document.querySelector("#closeResetAppearanceDialogBtn"),
  cancelResetAppearanceBtn: document.querySelector("#cancelResetAppearanceBtn"),
  confirmResetAppearanceBtn: document.querySelector("#confirmResetAppearanceBtn"),
  shortcutDialog: document.querySelector("#shortcutDialog"),
  shortcutForm: document.querySelector("#shortcutForm"),
  shortcutDialogTitle: document.querySelector("#shortcutDialogTitle"),
  shortcutId: document.querySelector("#shortcutId"),
  shortcutTitleInput: document.querySelector("#shortcutTitleInput"),
  shortcutUrlInput: document.querySelector("#shortcutUrlInput"),
  shortcutCategorySelect: document.querySelector("#shortcutCategorySelect"),
  shortcutColorInput: document.querySelector("#shortcutColorInput"),
  shortcutIconPreview: document.querySelector("#shortcutIconPreview"),
  refreshIconBtn: document.querySelector("#refreshIconBtn"),
  previewTitle: document.querySelector("#previewTitle"),
  previewCopy: document.querySelector("#previewCopy"),
  shortcutError: document.querySelector("#shortcutError"),
  deleteShortcutBtn: document.querySelector("#deleteShortcutBtn"),
  cancelShortcutBtn: document.querySelector("#cancelShortcutBtn"),
  saveShortcutBtn: document.querySelector("#saveShortcutBtn"),
  footerStatus: document.querySelector("#footerStatus"),
  footerTheme: document.querySelector("#footerTheme"),
  footerVersion: document.querySelector("#footerVersion"),
  feedbackDialog: document.querySelector("#feedbackDialog"),
  feedbackDialogTitle: document.querySelector("#feedbackDialogTitle"),
  feedbackDialogMessage: document.querySelector("#feedbackDialogMessage"),
  feedbackInputWrap: document.querySelector("#feedbackInputWrap"),
  feedbackInputLabel: document.querySelector("#feedbackInputLabel"),
  feedbackInput: document.querySelector("#feedbackInput"),
  feedbackCloseBtn: document.querySelector("#feedbackCloseBtn"),
  feedbackCancelBtn: document.querySelector("#feedbackCancelBtn"),
  feedbackConfirmBtn: document.querySelector("#feedbackConfirmBtn"),
  bookmarkImportDialog: document.querySelector("#bookmarkImportDialog"),
  bookmarkImportTitle: document.querySelector("#bookmarkImportTitle"),
  bookmarkImportCopy: document.querySelector("#bookmarkImportCopy"),
  bookmarkImportSummary: document.querySelector("#bookmarkImportSummary"),
  bookmarkImportList: document.querySelector("#bookmarkImportList"),
  bookmarkImportError: document.querySelector("#bookmarkImportError"),
  toggleAllBookmarkGroupsBtn: document.querySelector("#toggleAllBookmarkGroupsBtn"),
  closeBookmarkImportBtn: document.querySelector("#closeBookmarkImportBtn"),
  cancelBookmarkImportBtn: document.querySelector("#cancelBookmarkImportBtn"),
  confirmBookmarkImportBtn: document.querySelector("#confirmBookmarkImportBtn"),
  toastRegion: document.querySelector("#toastRegion")
};

const translations = {
  "zh-CN": {
    htmlLang: "zh-CN",
    brandKicker: "RUNNER / 控制台",
    brandTitle: "快捷中心",
    ready: "就绪",
    topbarLabel: "搜索和状态",
    searchInputLabel: "搜索或输入网址",
    systemPanelLabel: "快捷方式统计",
    sidebarLabel: "分类",
    classicShortcutsLabel: "Chrome 原版快捷方式",
    closeDialog: "关闭",
    addCategoryTitle: "添加分类",
    languageToggle: "中文 / English",
    searchPrefix: "搜索",
    searchEngineGo: "搜索引擎",
    searchPlaceholder: "搜索 Google 或输入网址",
    searchButton: "打开",
    clearSearchInput: "清除输入",
    historyToggle: "历史",
    searchHistory: "搜索历史",
    relatedSearches: "相关搜索",
    hideHistory: "隐藏",
    showHistory: "显示历史",
    clearHistory: "清空",
    noSearchHistory: "暂无搜索历史",
    noRelatedSearches: "输入关键词后显示相关搜索",
    relatedSuffixes: "教程|官网|怎么用|下载|价格|替代工具|案例|最新",
    historyLabel: "历史",
    siteLabel: "站点",
    clusterLabel: "分类",
    googleLabel: "GOOGLE",
    searchEngine: "搜索引擎",
    switchSearchEngine: "切换搜索引擎",
    searchEngineDialogTitle: "搜索引擎",
    addSearchEngine: "添加自定义搜索引擎",
    editSearchEngine: "编辑搜索引擎",
    newSearchEngine: "新增",
    searchEngineName: "名称",
    searchEngineShortcut: "短标识",
    searchEngineUrl: "搜索 URL 模板",
    searchEngineUrlPlaceholder: "https://example.com/search?q={query}",
    searchEngineTemplateHelp: "用 {query} 作为搜索词占位，也支持 %s。",
    setSearchEngine: "使用",
    activeSearchEngine: "当前",
    builtinSearchEngine: "内置",
    customSearchEngine: "自定义",
    edit: "编辑",
    invalidSearchEngine: "请输入名称，并填写包含 {query} 或 %s 的有效 http/https 搜索 URL。",
    deleteSearchEngineConfirm: "删除搜索引擎「{name}」吗？",
    urlLabel: "URL",
    signal: "网站",
    clusters: "分类",
    nativeHome: "关闭插件",
    disableExtensionTitle: "关闭 Runner Shortcut Hub",
    disableExtensionConfirm: "关闭后将立即恢复 Chrome 原生新标签页。需要重新开启时，请进入 chrome://extensions。确定关闭吗？",
    disableExtensionFailed: "无法关闭插件，请在 chrome://extensions 中手动关闭。",
    disableExtensionUnavailable: "当前环境不支持直接关闭插件。",
    customize: "自定义",
    customizeTitle: "自定义",
    designThemeTitle: "界面主题",
    designThemeLostStarship: "失落星船",
    designThemeLiquidGlass: "液态玻璃",
    designThemeCustom: "自定义",
    designThemeMinimal: "简洁模式",
    designThemeLostStarshipCopy: "工业网格、酸性高亮与系统数据界面",
    designThemeLiquidGlassCopy: "通透层次、柔和景深与流动高光",
    designThemeCustomCopy: "使用你的主题色、圆角和壁纸组合",
    designThemeMinimalCopy: "严格灰度、纯色剪影与无干扰界面",
    railHome: "主页",
    railSearch: "聚焦搜索",
    railCategories: "分类导航",
    railCustomize: "打开自定义",
    focusSearchEyebrow: "本地网站索引",
    focusSearchTitle: "查找已保存网站",
    focusSearchInputLabel: "搜索已保存网站",
    focusSearchPlaceholder: "输入网站名称、网址或分类",
    focusSearchGuidance: "输入关键词后显示已保存的网站",
    focusSearchNoSites: "暂无可搜索的已保存网站",
    focusSearchNoMatches: "没有找到匹配的网站",
    focusSearchClear: "清除网站搜索",
    focusSearchResultsLabel: "已保存网站搜索结果",
    footerReady: "本地数据已就绪",
    footerTheme: "主题：{theme}",
    confirmationTitle: "确认操作",
    renameTitle: "重命名",
    textInputLabel: "名称",
    confirm: "确认",
    operationComplete: "操作已完成",
    languageTitle: "语言",
    languageChinese: "简体中文",
    languageEnglish: "English",
    appearanceTitle: "外观模式",
    themeColorTitle: "主题颜色",
    customThemeColor: "自定义颜色",
    sizeRadiusTitle: "尺寸与圆角",
    iconRadius: "图标圆角",
    cardRadius: "网站卡片圆角",
    panelRadius: "面板圆角",
    buttonRadius: "按钮圆角",
    cornerAccents: "L 形直角装饰线",
    cornerAccentsDescription: "控制全站面板与卡片边角的加粗 L 形装饰线。",
    fontScale: "字体大小",
    cardDensity: "卡片密度",
    shortcutSettings: "快捷方式",
    sortShortcutsByUsage: "分类和网站按使用频次排序",
    sortShortcutsByUsageDescription: "开启后，常用分类和网站会优先显示；关闭后恢复手动排序。",
    categoryUsageSortActiveHint: "当前按使用频次排序，关闭后可拖动调整分类位置。",
    shortcutUsageSortActiveHint: "当前按使用频次排序，关闭后可拖动调整网站位置。",
    densityCompact: "紧凑",
    densityComfortable: "标准",
    densitySpacious: "宽松",
    radiusSquare: "直角",
    radiusSubtle: "轻微",
    radiusMedium: "中等",
    radiusLarge: "大圆角",
    radiusCircle: "圆形",
    previewCard: "网站卡片",
    previewButton: "按钮",
    appearancePresets: "外观预设",
    importPreset: "导入预设",
    exportPreset: "导出全部预设",
    savePreset: "保存为预设",
    updatePreset: "更新当前预设",
    noAppearancePresets: "暂无保存的预设",
    usePreset: "应用",
    renamePreset: "重命名",
    deletePreset: "删除",
    presetNamePrompt: "输入预设名称",
    defaultPresetName: "预设 {number}",
    deletePresetConfirm: "删除预设「{name}」吗？",
    activePreset: "当前",
    presetImportTitle: "导入界面预设",
    importSuccessful: "导入成功",
    importedPresetCount: "已导入 {count} 个界面预设。",
    applyNow: "立即应用",
    keepCurrent: "保持当前",
    close: "关闭",
    customWallpaperMissing: "预设已导入，但其自定义壁纸无法恢复，已使用回退背景。",
    invalidPresetFile: "无效的预设文件",
    unsupportedPresetVersion: "不支持的预设版本",
    presetFileEmpty: "预设文件为空",
    presetFileTooLarge: "预设文件超过 5 MB 限制",
    presetReadFailed: "文件读取失败",
    importFailed: "导入失败",
    storageWriteFailed: "无法保存导入的预设",
    dataTransferTitle: "完整数据导入与导出",
    dataTransferCopy: "备份或恢复网站、分类、排序、搜索引擎、历史记录和全部外观数据。导入前会要求确认。",
    importChromeBookmarks: "从 Chrome 书签导入",
    bookmarkImportTitle: "导入 Chrome 书签",
    bookmarkImportCopy: "书签栏一级文件夹会成为分类，子文件夹中的网站将递归导入。此操作只读取书签，不会修改或删除书签。",
    bookmarkImportReading: "正在读取 Chrome 书签…",
    bookmarksBar: "书签栏",
    bookmarkImportGroupCount: "{count} 个网站",
    bookmarkImportSummary: "已选择 {groups} 个分类，共 {sites} 个有效网站",
    bookmarkImportSelectAll: "全选",
    bookmarkImportClearAll: "取消全选",
    bookmarkImportAction: "导入所选",
    bookmarkImporting: "正在导入…",
    bookmarkImportEmpty: "书签栏中没有可导入的网站。",
    bookmarkImportBarMissing: "未找到可导入的 Chrome 书签栏。",
    bookmarkImportReadFailed: "无法读取 Chrome 书签。请检查扩展权限后重试。",
    bookmarkImportUnavailable: "当前环境不支持读取 Chrome 书签。",
    bookmarkImportResult: "导入完成：新增 {categories} 个分类、{imported} 个网站；跳过 {duplicates} 个重复网址和 {invalid} 个无效网址。",
    bookmarkImportNoChanges: "没有新增网站；重复或无效网址已跳过。",
    bookmarkImportStorageFailed: "导入失败，现有数据未修改。",
    exportAllData: "导出完整备份",
    importAllData: "导入完整备份",
    dataExported: "完整数据备份已导出",
    presetsExported: "外观预设已导出",
    dataImportConfirm: "导入完整备份会替换当前的网站、分类、排序和设置。确定继续吗？",
    dataImported: "完整数据已恢复",
    invalidDataBackup: "无效的 Runner Shortcut Hub 数据备份",
    dataBackupTooLarge: "数据备份超过 20 MB 限制",
    wallpaperTitle: "更换壁纸",
    backgroundOpacity: "背景不透明度",
    backgroundBlur: "高斯模糊",
    panelOpacity: "黑色方块不透明度",
    panelBlur: "黑色方块高斯模糊",
    themeLight: "浅色",
    themeDark: "深色",
    themeSystem: "跟随系统",
    customBackground: "自定义",
    uploadBackground: "上传背景（可多选）",
    removeBackground: "移除当前背景",
    resetTitle: "恢复默认",
    resetDescription: "只恢复语言和外观设置，不会删除网站、分类或排序。",
    resetAppearance: "恢复默认设置",
    resetAppearanceDialogTitle: "恢复默认设置",
    resetAppearanceConfirm: "确定要恢复默认外观设置吗？此操作不会删除网站和分类数据。",
    confirmReset: "确认恢复",
    invalidBackground: "请选择有效的背景图片。",
    runnerHome: "Runner 主页",
    classicSearchPlaceholder: "搜索 Google 或输入网址",
    aiMode: "AI 模式",
    panelEyebrow: "当前分类",
    editCluster: "编辑分类",
    addNode: "添加网站",
    emptyState: "这个分类还没有快捷方式。",
    addCategory: "添加分类",
    editCategory: "编辑分类",
    categoryName: "分类名称",
    categoryIcon: "分类图标",
    categoryIconPlaceholder: "如 AI / 工 / ⚡",
    categoryIconImage: "图片图标",
    categoryIconImageCopy: "可上传本地图片作为分类 icon。",
    uploadIcon: "上传",
    removeIcon: "移除",
    invalidImage: "请选择有效的图片文件。",
    categoryDragHint: "右键编辑，长按 0.5 秒拖动排序",
    shortcutDragHint: "长按 0.5 秒拖动排序",
    moveUp: "上移",
    moveDown: "下移",
    delete: "删除",
    cancel: "取消",
    save: "保存",
    addShortcut: "添加网站",
    editShortcut: "编辑网站",
    shortcutTitle: "名称（可选）",
    shortcutUrl: "网址",
    shortcutCategory: "分类",
    autoIcon: "自动图标",
    autoIconCopy: "保存后会按网址自动匹配网站 icon。",
    refresh: "刷新",
    backupColor: "备用底色",
    categoryNameRequired: "请输入分类名称。",
    duplicateCategory: "这个分类名称已经存在。",
    autoShortcutTitle: "网站",
    invalidUrl: "请输入有效网址。",
    chooseCategory: "请选择分类。",
    deleteShortcutConfirm: "删除「{title}」吗？",
    deleteCategoryConfirm: "删除「{category}」后，里面的网站会移动到「{target}」。继续吗？"
  },
  en: {
    htmlLang: "en",
    brandKicker: "RUNNER / CONSOLE",
    brandTitle: "SHORTCUT HUB",
    ready: "READY",
    topbarLabel: "Search and status",
    searchInputLabel: "Search or enter a URL",
    systemPanelLabel: "Shortcut statistics",
    sidebarLabel: "Categories",
    classicShortcutsLabel: "Chrome original shortcuts",
    closeDialog: "Close",
    addCategoryTitle: "Add category",
    languageToggle: "中文 / English",
    searchPrefix: "SEARCH",
    searchEngineGo: "Search Engine",
    searchPlaceholder: "Search Google or enter a URL",
    searchButton: "OPEN",
    clearSearchInput: "Clear input",
    historyToggle: "History",
    searchHistory: "Search History",
    relatedSearches: "Related Searches",
    hideHistory: "Hide",
    showHistory: "Show History",
    clearHistory: "Clear",
    noSearchHistory: "No search history",
    noRelatedSearches: "Type to see related searches",
    relatedSuffixes: "official|tutorial|pricing|alternatives|download|examples|guide|latest",
    historyLabel: "History",
    siteLabel: "Site",
    clusterLabel: "Category",
    googleLabel: "GOOGLE",
    searchEngine: "Search Engine",
    switchSearchEngine: "Switch search engine",
    searchEngineDialogTitle: "Search Engine",
    addSearchEngine: "Add Custom Search Engine",
    editSearchEngine: "Edit Search Engine",
    newSearchEngine: "New",
    searchEngineName: "Name",
    searchEngineShortcut: "Short Code",
    searchEngineUrl: "Search URL Template",
    searchEngineUrlPlaceholder: "https://example.com/search?q={query}",
    searchEngineTemplateHelp: "Use {query} as the query placeholder. %s is also supported.",
    setSearchEngine: "Use",
    activeSearchEngine: "Current",
    builtinSearchEngine: "Built-in",
    customSearchEngine: "Custom",
    edit: "Edit",
    invalidSearchEngine: "Enter a name and a valid http/https search URL with {query} or %s.",
    deleteSearchEngineConfirm: "Delete search engine \"{name}\"?",
    urlLabel: "URL",
    signal: "WEBSITES",
    clusters: "CATEGORIES",
    nativeHome: "Disable Extension",
    disableExtensionTitle: "Disable Runner Shortcut Hub",
    disableExtensionConfirm: "Disabling the extension immediately restores Chrome's original New Tab page. To turn it on again, open chrome://extensions. Disable it now?",
    disableExtensionFailed: "The extension could not be disabled. Turn it off manually at chrome://extensions.",
    disableExtensionUnavailable: "This environment cannot disable the extension directly.",
    customize: "Customize",
    customizeTitle: "Customize",
    designThemeTitle: "Interface Theme",
    designThemeLostStarship: "Lost Starship",
    designThemeLiquidGlass: "Liquid Glass",
    designThemeCustom: "Custom",
    designThemeMinimal: "Minimal",
    designThemeLostStarshipCopy: "Industrial grid, acid highlights, and system data",
    designThemeLiquidGlassCopy: "Translucent depth, soft focus, and fluid light",
    designThemeCustomCopy: "Use your color, radius, and wallpaper settings",
    designThemeMinimalCopy: "Strict grayscale, solid silhouettes, and distraction-free surfaces",
    railHome: "Home",
    railSearch: "Focus Search",
    railCategories: "Category Navigation",
    railCustomize: "Open Customize",
    focusSearchEyebrow: "LOCAL SITE INDEX",
    focusSearchTitle: "Find Saved Websites",
    focusSearchInputLabel: "Search saved websites",
    focusSearchPlaceholder: "Enter a website, URL, or category",
    focusSearchGuidance: "Type to find a saved website",
    focusSearchNoSites: "No saved websites are available to search",
    focusSearchNoMatches: "No matching websites found",
    focusSearchClear: "Clear website search",
    focusSearchResultsLabel: "Saved website search results",
    footerReady: "Local data ready",
    footerTheme: "Theme: {theme}",
    confirmationTitle: "Confirm Action",
    renameTitle: "Rename",
    textInputLabel: "Name",
    confirm: "Confirm",
    operationComplete: "Action completed",
    languageTitle: "Language",
    languageChinese: "简体中文",
    languageEnglish: "English",
    appearanceTitle: "Appearance Mode",
    themeColorTitle: "Theme Color",
    customThemeColor: "Custom Color",
    sizeRadiusTitle: "Size and Corner Radius",
    iconRadius: "Icon Corner Radius",
    cardRadius: "Website Card Radius",
    panelRadius: "Panel Radius",
    buttonRadius: "Button Radius",
    cornerAccents: "L-shaped Corner Accents",
    cornerAccentsDescription: "Show the bold L-shaped accents on panel and card corners across the interface.",
    fontScale: "Font Size",
    cardDensity: "Card Density",
    shortcutSettings: "Shortcuts",
    sortShortcutsByUsage: "Sort Categories and Websites by Usage",
    sortShortcutsByUsageDescription: "Frequently used categories and websites appear first. Turn it off to restore manual order.",
    categoryUsageSortActiveHint: "Usage sorting is active. Turn it off to drag and reorder categories.",
    shortcutUsageSortActiveHint: "Usage sorting is active. Turn it off to drag and reorder websites.",
    densityCompact: "Compact",
    densityComfortable: "Comfortable",
    densitySpacious: "Spacious",
    radiusSquare: "Square",
    radiusSubtle: "Subtle",
    radiusMedium: "Medium",
    radiusLarge: "Large",
    radiusCircle: "Circle",
    previewCard: "Website Card",
    previewButton: "Button",
    appearancePresets: "Appearance Presets",
    importPreset: "IMPORT PRESET",
    exportPreset: "EXPORT ALL",
    savePreset: "SAVE PRESET",
    updatePreset: "UPDATE CURRENT",
    noAppearancePresets: "NO SAVED PRESETS",
    usePreset: "APPLY",
    renamePreset: "RENAME",
    deletePreset: "DELETE",
    presetNamePrompt: "Preset name",
    defaultPresetName: "Preset {number}",
    deletePresetConfirm: "Delete preset \"{name}\"?",
    activePreset: "ACTIVE",
    presetImportTitle: "IMPORT APPEARANCE PRESET",
    importSuccessful: "Import successful",
    importedPresetCount: "{count} appearance presets imported.",
    applyNow: "APPLY NOW",
    keepCurrent: "KEEP CURRENT",
    close: "CLOSE",
    customWallpaperMissing: "The preset was imported, but its custom wallpaper could not be restored. A fallback wallpaper was used.",
    invalidPresetFile: "Invalid preset file",
    unsupportedPresetVersion: "Unsupported preset version",
    presetFileEmpty: "Preset file is empty",
    presetFileTooLarge: "Preset file exceeds the 5 MB limit",
    presetReadFailed: "File read failed",
    importFailed: "Import failed",
    storageWriteFailed: "The imported presets could not be saved",
    dataTransferTitle: "Complete Data Import / Export",
    dataTransferCopy: "Back up or restore websites, categories, ordering, search engines, history, and all appearance data. Import requires confirmation.",
    importChromeBookmarks: "IMPORT CHROME BOOKMARKS",
    bookmarkImportTitle: "IMPORT CHROME BOOKMARKS",
    bookmarkImportCopy: "Top-level Bookmarks Bar folders become categories. Websites inside nested folders are imported recursively. Runner only reads bookmarks and never changes or deletes them.",
    bookmarkImportReading: "Reading Chrome bookmarks...",
    bookmarksBar: "Bookmarks Bar",
    bookmarkImportGroupCount: "{count} websites",
    bookmarkImportSummary: "{groups} categories selected, {sites} valid websites",
    bookmarkImportSelectAll: "SELECT ALL",
    bookmarkImportClearAll: "CLEAR ALL",
    bookmarkImportAction: "IMPORT SELECTED",
    bookmarkImporting: "IMPORTING...",
    bookmarkImportEmpty: "No importable websites were found in the Bookmarks Bar.",
    bookmarkImportBarMissing: "Chrome's Bookmarks Bar could not be found.",
    bookmarkImportReadFailed: "Chrome bookmarks could not be read. Check the extension permission and try again.",
    bookmarkImportUnavailable: "Chrome bookmarks are unavailable in this environment.",
    bookmarkImportResult: "Import complete: {categories} categories and {imported} websites added; {duplicates} duplicates and {invalid} invalid URLs skipped.",
    bookmarkImportNoChanges: "No websites were added. Duplicate or invalid URLs were skipped.",
    bookmarkImportStorageFailed: "Import failed. Existing data was not changed.",
    exportAllData: "EXPORT FULL BACKUP",
    importAllData: "IMPORT FULL BACKUP",
    dataExported: "Complete data backup exported",
    presetsExported: "Appearance presets exported",
    dataImportConfirm: "Importing a complete backup replaces current websites, categories, ordering, and settings. Continue?",
    dataImported: "Complete data restored",
    invalidDataBackup: "Invalid Runner Shortcut Hub data backup",
    dataBackupTooLarge: "Data backup exceeds the 20 MB limit",
    wallpaperTitle: "WALLPAPER",
    backgroundOpacity: "BACKGROUND OPACITY",
    backgroundBlur: "GAUSSIAN BLUR",
    panelOpacity: "PANEL OPACITY",
    panelBlur: "PANEL BLUR",
    themeLight: "LIGHT",
    themeDark: "DARK",
    themeSystem: "SYSTEM",
    customBackground: "CUSTOM",
    uploadBackground: "UPLOAD BGS",
    removeBackground: "REMOVE SELECTED",
    resetTitle: "Reset to Default",
    resetDescription: "Reset language and appearance only. Websites, categories, and ordering are preserved.",
    resetAppearance: "Reset to Default",
    resetAppearanceDialogTitle: "Reset to Default",
    resetAppearanceConfirm: "Reset all appearance settings to default? Your websites and categories will not be deleted.",
    confirmReset: "Reset",
    invalidBackground: "Choose a valid background image.",
    runnerHome: "Runner Home",
    classicSearchPlaceholder: "Search Google or enter a URL",
    aiMode: "AI Mode",
    panelEyebrow: "Current Category",
    editCluster: "Edit Categories",
    addNode: "Add Website",
    emptyState: "No shortcuts in this category.",
    addCategory: "Add Category",
    editCategory: "Edit Category",
    categoryName: "Category Name",
    categoryIcon: "Category Icon",
    categoryIconPlaceholder: "AI / W / +",
    categoryIconImage: "Image Icon",
    categoryIconImageCopy: "Upload a local image as this category icon.",
    uploadIcon: "Upload",
    removeIcon: "Remove",
    invalidImage: "Choose a valid image file.",
    categoryDragHint: "Right-click to edit. Hold for 0.5 seconds to reorder.",
    shortcutDragHint: "Hold for 0.5 seconds to reorder.",
    moveUp: "Move Up",
    moveDown: "Move Down",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    addShortcut: "Add Website",
    editShortcut: "Edit Website",
    shortcutTitle: "Name (Optional)",
    shortcutUrl: "URL",
    shortcutCategory: "Category",
    autoIcon: "Automatic Icon",
    autoIconCopy: "The site icon is matched automatically from its URL.",
    refresh: "Refresh",
    backupColor: "Backup Color",
    categoryNameRequired: "Enter a category name.",
    duplicateCategory: "This category name already exists.",
    autoShortcutTitle: "Site",
    invalidUrl: "Enter a valid URL.",
    chooseCategory: "Choose a category.",
    deleteShortcutConfirm: "Delete \"{title}\"?",
    deleteCategoryConfirm: "Delete \"{category}\"? Its websites will move to \"{target}\"."
  }
};

const categoryTranslations = {
  "ai-tools": { "zh-CN": "AI 工具", en: "AI Tools" },
  social: { "zh-CN": "社媒平台", en: "Social" },
  common: { "zh-CN": "常用", en: "Common" },
  video: { "zh-CN": "视频创作", en: "Video" },
  assets: { "zh-CN": "素材灵感", en: "Assets" },
  work: { "zh-CN": "工作后台", en: "Work" },
  projects: { "zh-CN": "项目常用", en: "Projects" },
  custom: { "zh-CN": "自定义", en: "Custom" }
};

const defaultCategoryIcons = {
  "ai-tools": "AI",
  social: "社",
  common: "+",
  video: "影",
  assets: "灵",
  work: "工",
  projects: "项",
  custom: "+"
};

const categoryIconTranslations = {
  "ai-tools": { "zh-CN": "AI", en: "AI" },
  social: { "zh-CN": "社", en: "SO" },
  common: { "zh-CN": "+", en: "+" },
  video: { "zh-CN": "影", en: "VI" },
  assets: { "zh-CN": "灵", en: "AS" },
  work: { "zh-CN": "工", en: "WO" },
  projects: { "zh-CN": "项", en: "PR" },
  custom: { "zh-CN": "+", en: "+" }
};

const commonSoftwareShortcuts = [
  { id: "common-chatgpt", title: "ChatGPT", url: "https://chatgpt.com/", color: "#f2f6f3" },
  { id: "common-claude", title: "Claude", url: "https://claude.ai/", color: "#f4b168" },
  { id: "common-ai-studio", title: "Google AI Studio", url: "https://aistudio.google.com/", color: "#8fd3ff" },
  { id: "common-fotor", title: "Fotor", url: "https://www.fotor.com/", color: "#f7d94c" },
  { id: "common-rednote", title: "小红书", url: "https://www.xiaohongshu.com/", color: "#ff3f52" },
  { id: "common-youtube", title: "YouTube", url: "https://www.youtube.com/", color: "#ff4d4d" },
  { id: "common-qianwen", title: "通义千问", url: "https://tongyi.aliyun.com/qianwen/", color: "#76c7ff" },
  { id: "common-wps", title: "WPS Office", url: "https://www.wps.cn/", color: "#ff6b6b" },
  { id: "common-dingtalk", title: "钉钉", url: "https://im.dingtalk.com/", color: "#70a7ff" },
  { id: "common-quark", title: "夸克网盘", url: "https://pan.quark.cn/", color: "#c6f6d5" }
];

const appearanceModes = [
  { id: "light", labelKey: "themeLight" },
  { id: "dark", labelKey: "themeDark" },
  { id: "system", labelKey: "themeSystem" }
];

const designThemes = [
  {
    id: "lost-starship",
    labelKey: "designThemeLostStarship",
    copyKey: "designThemeLostStarshipCopy",
    code: "LS-01"
  },
  {
    id: "liquid-glass",
    labelKey: "designThemeLiquidGlass",
    copyKey: "designThemeLiquidGlassCopy",
    code: "LG-02"
  },
  {
    id: "custom",
    labelKey: "designThemeCustom",
    copyKey: "designThemeCustomCopy",
    code: "CU-03"
  },
  {
    id: "minimal",
    labelKey: "designThemeMinimal",
    copyKey: "designThemeMinimalCopy",
    code: "MN-04"
  }
];

const localeOptions = [
  { id: "zh-CN", labelKey: "languageChinese" },
  { id: "en", labelKey: "languageEnglish" }
];

const iconRadiusQuickOptions = [
  { value: 0, unit: "px", labelKey: "radiusSquare" },
  { value: 4, unit: "px", labelKey: "radiusSubtle" },
  { value: 8, unit: "px", labelKey: "radiusMedium" },
  { value: 14, unit: "px", labelKey: "radiusLarge" },
  { value: 50, unit: "percent", labelKey: "radiusCircle" }
];

const cardDensityOptions = [
  { id: "compact", labelKey: "densityCompact" },
  { id: "comfortable", labelKey: "densityComfortable" },
  { id: "spacious", labelKey: "densitySpacious" }
];

const themeColorPresets = [
  "#d8ff3d",
  "#3478d4",
  "#2f7d26",
  "#d14b1f",
  "#aa24a8",
  "#d62c86",
  "#f59a2f",
  "#5f8fd8"
];

const backgroundPresets = [
  {
    id: "runner-grid",
    label: { "zh-CN": "Runner", en: "Runner" },
    preview: "linear-gradient(90deg, rgba(216,255,61,.28) 0 1px, transparent 1px 22px), linear-gradient(135deg, #050604, #11180c 52%, #020303)"
  },
  {
    id: "stone",
    label: { "zh-CN": "岩壁", en: "Stone" },
    preview: "linear-gradient(165deg, #1a1c20 0 52%, #4a392e 53% 70%, #141516 71%)"
  },
  {
    id: "night",
    label: { "zh-CN": "深空", en: "Night" },
    preview: "radial-gradient(circle at 75% 26%, rgba(72,111,255,.42), transparent 32%), linear-gradient(135deg, #141522, #060713)"
  },
  {
    id: "aurora",
    label: { "zh-CN": "极光", en: "Aurora" },
    preview: "radial-gradient(circle at 20% 90%, rgba(108,240,255,.34), transparent 36%), radial-gradient(circle at 80% 18%, rgba(216,255,61,.28), transparent 34%), linear-gradient(135deg, #061211, #071c2b)"
  },
  {
    id: "ember",
    label: { "zh-CN": "余烬", en: "Ember" },
    preview: "radial-gradient(circle at 72% 76%, rgba(255,121,52,.42), transparent 34%), linear-gradient(135deg, #170807, #2a180b 52%, #060303)"
  },
  {
    id: "ocean",
    label: { "zh-CN": "海面", en: "Ocean" },
    preview: "radial-gradient(circle at 72% 18%, rgba(108,240,255,.32), transparent 28%), linear-gradient(135deg, #02131b, #083958 54%, #04101a)"
  },
  {
    id: "violet",
    label: { "zh-CN": "紫影", en: "Violet" },
    preview: "radial-gradient(circle at 28% 76%, rgba(119,88,255,.38), transparent 32%), linear-gradient(135deg, #110d22, #030407)"
  },
  {
    id: "glass",
    label: { "zh-CN": "玻璃", en: "Glass" },
    preview: "linear-gradient(135deg, rgba(108,240,255,.24), transparent 32%), linear-gradient(45deg, #111827, #16313a 48%, #2d1740)"
  },
  {
    id: "plain",
    label: { "zh-CN": "纯色", en: "Plain" },
    preview: "linear-gradient(135deg, #080a08, #151811)"
  }
];

function t(key, vars = {}) {
  let text = translations[state.locale]?.[key] || translations.en[key] || key;
  Object.entries(vars).forEach(([name, value]) => {
    text = text.replace(`{${name}}`, value);
  });
  return text;
}

function normalizeLocale(value, fallback = "zh-CN") {
  if (value === "en") return "en";
  if (value === "zh" || value === "zh-CN" || value === "zhCN") return "zh-CN";
  return fallback;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createId(seed) {
  const base = seed
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 28) || "item";

  if (crypto.randomUUID) {
    return `${base}-${crypto.randomUUID().slice(0, 8)}`;
  }

  return `${base}-${Date.now().toString(36)}`;
}

function hasChromeStorage() {
  return Boolean(globalThis.chrome?.storage?.local);
}

async function stabilizeCurrentTabZoom() {
  const tabs = globalThis.chrome?.tabs;
  if (
    typeof tabs?.getCurrent !== "function"
    || typeof tabs?.getZoom !== "function"
    || typeof tabs?.setZoomSettings !== "function"
    || typeof tabs?.setZoom !== "function"
  ) {
    return false;
  }

  try {
    const tab = await tabs.getCurrent();
    if (!Number.isInteger(tab?.id)) return false;

    const zoomFactor = await tabs.getZoom(tab.id);
    if (!Number.isFinite(zoomFactor) || zoomFactor <= 0) return false;

    // Keep Chrome's normal zoom controls while isolating this tab from other origins.
    await tabs.setZoomSettings(tab.id, { mode: "automatic", scope: "per-tab" });
    await tabs.setZoom(tab.id, zoomFactor);
    return true;
  } catch {
    return false;
  }
}

async function readData() {
  if (!hasChromeStorage()) {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      resolve(result[STORAGE_KEY] || null);
    });
  });
}

function readUiPreferences() {
  try {
    const raw = localStorage.getItem(UI_PREFERENCES_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isPlainObject(parsed) || Number(parsed.version) !== UI_PREFERENCES_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function createUiPreferences(data = state) {
  const appearance = normalizeAppearance(data.appearance);
  return {
    version: UI_PREFERENCES_VERSION,
    locale: normalizeLocale(data.locale),
    activeAppearancePresetId: String(data.activeAppearancePresetId || ""),
    appearance: compactUiAppearance(appearance)
  };
}

function compactUiAppearance(appearance) {
  return compactAppearanceSnapshot(appearance);
}

function writeUiPreferences(data = state) {
  try {
    localStorage.setItem(UI_PREFERENCES_KEY, JSON.stringify(createUiPreferences(data)));
  } catch {
    // Chrome Storage remains authoritative when localStorage is unavailable.
  }
}

function mergeUiPreferences(data, preferences) {
  if (!isPlainObject(preferences)) return data;
  const merged = clone(data);
  const currentAppearance = normalizeAppearance(merged.appearance);
  const preferenceAppearance = isPlainObject(preferences.appearance) ? preferences.appearance : {};
  merged.locale = normalizeLocale(preferences.locale, merged.locale);
  merged.appearance = normalizeAppearance({
    ...currentAppearance,
    ...sanitizeImportedAppearanceFields(preferenceAppearance),
    customBackgroundImages: currentAppearance.customBackgroundImages
  });
  if (merged.appearancePresets.some((preset) => preset.id === preferences.activeAppearancePresetId)) {
    merged.activeAppearancePresetId = preferences.activeAppearancePresetId;
  }
  return merged;
}

async function writeData() {
  await writeDataSnapshot(clone(state));
}

async function writeDataSnapshot(data) {
  const snapshot = clone(data);

  if (!hasChromeStorage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    writeUiPreferences(snapshot);
    return;
  }

  await new Promise((resolve, reject) => {
    chrome.storage.local.set({ [STORAGE_KEY]: snapshot }, () => {
      const error = chrome.runtime?.lastError;
      if (error) {
        reject(new Error(error.message || t("storageWriteFailed")));
        return;
      }
      resolve();
    });
  });
  writeUiPreferences(snapshot);
}

async function boot() {
  needsDataMigration = false;
  setDate();
  bindEvents();
  const zoomStabilization = stabilizeCurrentTabZoom();

  try {
    const saved = await readData();
    if (saved?.categories?.length && Array.isArray(saved.shortcuts)) {
      state = normalizeState(saved);
    }
  } catch {
    state = structuredClone(defaultData);
  }

  state = mergeUiPreferences(state, readUiPreferences());

  if (needsDataMigration) {
    await writeData();
  }

  await zoomStabilization;
  render();
  writeUiPreferences(state);
  scheduleBackgroundStorageOptimization();
}

function normalizeState(data) {
  const locale = normalizeLocale(data.locale);
  const mode = "runner";
  if (data.mode === "classic") needsDataMigration = true;
  const searchEngines = normalizeSearchEngines(data.searchEngines);
  const activeSearchEngineId = searchEngines.some((engine) => engine.id === data.activeSearchEngineId)
    ? data.activeSearchEngineId
    : "google";
  const appearance = normalizeAppearance(data.appearance);
  const appearancePresets = normalizeAppearancePresets(data.appearancePresets, appearance.customBackgroundImages, locale);
  const activeAppearancePresetId = appearancePresets.some((preset) => preset.id === data.activeAppearancePresetId)
    ? data.activeAppearancePresetId
    : "";
  const searchHistory = normalizeSearchHistory(data.searchHistory);
  const showSearchHistory = data.showSearchHistory !== false;
  const sortShortcutsByUsage = data.sortShortcutsByUsage === true;
  const categories = data.categories
    .filter((category) => category.id && category.name)
    .map((category, index) => normalizeCategory(category, index));
  const categoryIds = new Set(categories.map((category) => category.id));
  const common = ensureCommonCategory(categories, categoryIds);
  const custom = categories.find((category) => category.id === "custom")
    || normalizeCategory({ id: "custom", name: "自定义" }, categories.length);
  if (!categoryIds.has("custom")) {
    categories.push(custom);
    categoryIds.add("custom");
  }

  let shortcuts = data.shortcuts
    .filter((shortcut) => shortcut.id && shortcut.title && shortcut.url)
    .map((shortcut) => ({
      ...shortcut,
      categoryId: categoryIds.has(shortcut.categoryId) ? shortcut.categoryId : "custom",
      color: shortcut.color || "#62d5ff",
      iconUrl: shortcut.iconUrl || "",
      useCount: normalizeUseCount(shortcut.useCount)
    }));
  const commonShortcutsSeeded = data.commonShortcutsSeeded === true;
  if (!commonShortcutsSeeded && shortcuts.filter((shortcut) => shortcut.categoryId === common.id).length === 0) {
    shortcuts = shortcuts.concat(seedCommonShortcuts(common.id, shortcuts));
    needsDataMigration = true;
  }

  const activeCategoryId = categoryIds.has(data.activeCategoryId) ? data.activeCategoryId : categories[0].id;
  return {
    schemaVersion: 2,
    locale,
    mode,
    searchEngines,
    activeSearchEngineId,
    appearance,
    appearancePresets,
    activeAppearancePresetId,
    commonShortcutsSeeded: true,
    searchHistory,
    showSearchHistory,
    sortShortcutsByUsage,
    categories,
    shortcuts,
    activeCategoryId
  };
}

function normalizeSearchEngines(engines = []) {
  const normalized = defaultSearchEngines.map((engine) => ({ ...engine, builtin: true }));
  const builtinIds = new Set(normalized.map((engine) => engine.id));
  const candidates = Array.isArray(engines) ? engines : [];

  candidates.forEach((engine, index) => {
    if (!engine || engine.builtin || builtinIds.has(engine.id)) return;
    const item = normalizeSearchEngine(engine, index, normalized);
    if (item) normalized.push(item);
  });

  return normalized;
}

function normalizeSearchEngine(engine, index, existingEngines = []) {
  const name = normalizeSearchEngineName(engine.name);
  const searchUrl = normalizeSearchEngineTemplate(engine.searchUrl);
  if (!name || !searchUrl) return null;
  return {
    id: uniqueSearchEngineId(engine.id || createId(name), existingEngines),
    name,
    shortcut: normalizeSearchEngineShortcut(engine.shortcut || name),
    searchUrl,
    builtin: false
  };
}

function normalizeSearchEngineName(value = "") {
  return String(value || "").trim().slice(0, 32);
}

function normalizeSearchEngineShortcut(value = "") {
  const shortcut = String(value || "").trim().toUpperCase().replace(/\s+/g, "").slice(0, 8);
  return shortcut || "SE";
}

function normalizeSearchEngineTemplate(value = "") {
  const template = String(value || "").trim().replace("%s", "{query}");
  if (!template.includes("{query}")) return "";
  const testUrl = template.replaceAll("{query}", "test");
  try {
    const parsed = new URL(testUrl);
    return /^https?:$/.test(parsed.protocol) ? template : "";
  } catch {
    return "";
  }
}

function uniqueSearchEngineId(preferredId, existingEngines) {
  const used = new Set(existingEngines.map((engine) => engine.id));
  const base = String(preferredId || "search-engine")
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 36) || "search-engine";
  if (!used.has(base)) return base;
  let index = 2;
  while (used.has(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}

function ensureCommonCategory(categories, categoryIds) {
  const existing = categories.find((category) => (
    category.id === "common" || category.name === "常用" || category.name.toLowerCase() === "common"
  ));
  if (existing) return existing;

  const common = normalizeCategory({ id: "common", name: "常用", icon: "+", order: Math.min(2, categories.length) }, categories.length);
  categories.splice(Math.min(2, categories.length), 0, common);
  setCategoryOrder(categories);
  categoryIds.add(common.id);
  needsDataMigration = true;
  return common;
}

function seedCommonShortcuts(categoryId, existingShortcuts) {
  const existingKeys = new Set(existingShortcuts.map((shortcut) => `${shortcut.categoryId}:${shortcut.url.toLowerCase()}`));
  return commonSoftwareShortcuts
    .filter((shortcut) => !existingKeys.has(`${categoryId}:${shortcut.url.toLowerCase()}`))
    .map((shortcut) => ({ ...shortcut, id: createStableShortcutId(shortcut.id, existingShortcuts), categoryId, iconUrl: "" }));
}

function createStableShortcutId(preferredId, existingShortcuts) {
  const used = new Set(existingShortcuts.map((shortcut) => shortcut.id));
  if (!used.has(preferredId)) return preferredId;
  let index = 2;
  while (used.has(`${preferredId}-${index}`)) index += 1;
  return `${preferredId}-${index}`;
}

function normalizeAppearance(appearance = {}) {
  const designTheme = designThemes.some((theme) => theme.id === appearance.designTheme)
    ? appearance.designTheme
    : "lost-starship";
  const theme = appearanceModes.some((mode) => mode.id === appearance.theme) ? appearance.theme : "dark";
  const backgroundIds = new Set(backgroundPresets.map((preset) => preset.id).concat("custom"));
  const customBackgroundImages = normalizeCustomBackgroundImages(appearance);
  const activeCustomBackgroundId = normalizeActiveCustomBackgroundId(
    appearance.activeCustomBackgroundId,
    customBackgroundImages
  );
  const background = backgroundIds.has(appearance.background) ? appearance.background : "runner-grid";
  const accentColor = normalizeHexColor(appearance.accentColor) || defaultData.appearance.accentColor;
  const backgroundOpacity = clampNumber(appearance.backgroundOpacity, 0.15, 1, defaultData.appearance.backgroundOpacity);
  const backgroundBlur = Math.round(clampNumber(appearance.backgroundBlur, 0, 28, defaultData.appearance.backgroundBlur));
  const panelOpacity = clampNumber(appearance.panelOpacity, 0.1, 1, defaultData.appearance.panelOpacity);
  const panelBlur = Math.round(clampNumber(appearance.panelBlur, 0, 36, defaultData.appearance.panelBlur));
  const iconRadiusUnit = appearance.iconRadiusUnit === "percent" ? "percent" : "px";
  const iconRadius = iconRadiusUnit === "percent"
    ? 50
    : Math.round(clampNumber(appearance.iconRadius, 0, 24, defaultData.appearance.iconRadius));
  const cardRadius = Math.round(clampNumber(appearance.cardRadius, 0, 24, defaultData.appearance.cardRadius));
  const panelRadius = Math.round(clampNumber(appearance.panelRadius, 0, 24, defaultData.appearance.panelRadius));
  const buttonRadius = Math.round(clampNumber(appearance.buttonRadius, 0, 24, defaultData.appearance.buttonRadius));
  const cornerAccentsEnabled = appearance.cornerAccentsEnabled === true;
  const fontScale = Math.round(clampNumber(appearance.fontScale, 0.85, 1.2, defaultData.appearance.fontScale) * 100) / 100;
  const cardDensity = ["compact", "comfortable", "spacious"].includes(appearance.cardDensity)
    ? appearance.cardDensity
    : defaultData.appearance.cardDensity;
  return {
    designTheme,
    theme,
    background: background === "custom" && !activeCustomBackgroundId ? "runner-grid" : background,
    customBackgroundImages,
    activeCustomBackgroundId,
    accentColor,
    backgroundOpacity,
    backgroundBlur,
    panelOpacity,
    panelBlur,
    iconRadius,
    iconRadiusUnit,
    cardRadius,
    panelRadius,
    buttonRadius,
    cornerAccentsEnabled,
    fontScale,
    cardDensity
  };
}

function normalizeAppearancePresets(presets = [], customBackgroundImages = [], locale = state.locale) {
  const normalized = [];
  (Array.isArray(presets) ? presets : []).forEach((preset, index) => {
    const item = normalizeAppearancePreset(preset, index, normalized, customBackgroundImages, locale);
    if (item) normalized.push(item);
  });
  return normalized;
}

function normalizeAppearancePreset(preset, index, existingPresets = [], customBackgroundImages = [], locale = state.locale) {
  if (!preset || typeof preset !== "object") return null;
  const appearance = normalizeAppearance({
    ...preset.appearance,
    customBackgroundImages
  });
  return {
    id: uniqueAppearancePresetId(preset.id || createId(preset.name || `preset-${index + 1}`), existingPresets),
    name: normalizeAppearancePresetName(preset.name, index),
    appearance: compactAppearanceSnapshot(appearance),
    locale: normalizeLocale(preset.locale || preset.appearance?.locale, normalizeLocale(locale)),
    createdAt: normalizeTimestamp(preset.createdAt),
    updatedAt: normalizeTimestamp(preset.updatedAt)
  };
}

function normalizeAppearancePresetName(value, index) {
  const name = String(value || "").trim();
  return (name || t("defaultPresetName", { number: index + 1 })).slice(0, 40);
}

function normalizeTimestamp(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function uniqueAppearancePresetId(preferredId, existingPresets) {
  const used = new Set(existingPresets.map((preset) => preset.id));
  const base = String(preferredId || "appearance-preset")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80) || "appearance-preset";
  if (!used.has(base)) return base;
  let index = 2;
  while (used.has(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}

function snapshotCurrentAppearance() {
  return compactAppearanceSnapshot(normalizeAppearance(state.appearance));
}

function compactAppearanceSnapshot(appearance) {
  return {
    designTheme: appearance.designTheme,
    theme: appearance.theme,
    background: appearance.background,
    activeCustomBackgroundId: appearance.activeCustomBackgroundId || "",
    accentColor: appearance.accentColor,
    backgroundOpacity: appearance.backgroundOpacity,
    backgroundBlur: appearance.backgroundBlur,
    panelOpacity: appearance.panelOpacity,
    panelBlur: appearance.panelBlur,
    iconRadius: appearance.iconRadius,
    iconRadiusUnit: appearance.iconRadiusUnit,
    cardRadius: appearance.cardRadius,
    panelRadius: appearance.panelRadius,
    buttonRadius: appearance.buttonRadius,
    cornerAccentsEnabled: appearance.cornerAccentsEnabled,
    fontScale: appearance.fontScale,
    cardDensity: appearance.cardDensity
  };
}

function normalizeCustomBackgroundImages(appearance = {}) {
  const normalized = [];
  const seenImages = new Set();
  const candidates = [];

  if (Array.isArray(appearance.customBackgroundImages)) {
    candidates.push(...appearance.customBackgroundImages);
  }

  const legacyImage = normalizeCustomBackgroundImage(appearance.customBackgroundImage);
  if (legacyImage) {
    candidates.push({
      id: "custom-legacy",
      name: "Custom 1",
      image: legacyImage
    });
  }

  candidates.forEach((item, index) => {
    const background = normalizeCustomBackgroundItem(item, index, normalized);
    if (!background || seenImages.has(background.image)) return;
    seenImages.add(background.image);
    normalized.push(background);
  });

  return normalized;
}

function normalizeCustomBackgroundItem(item, index, existingItems = []) {
  const image = normalizeCustomBackgroundImage(typeof item === "string" ? item : item?.image);
  if (!image) return null;
  const preferredId = sanitizeCustomBackgroundId(item?.id) || `custom-${index + 1}`;
  const accentColor = normalizeHexColor(item?.accentColor);
  return {
    id: uniqueCustomBackgroundId(preferredId, existingItems),
    name: normalizeCustomBackgroundName(item?.name, index),
    image,
    accentColor
  };
}

function normalizeCustomBackgroundName(value, index) {
  const name = String(value || "").trim();
  return name ? name.slice(0, 28) : `Custom ${index + 1}`;
}

function sanitizeCustomBackgroundId(value = "") {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function uniqueCustomBackgroundId(preferredId, existingItems) {
  const used = new Set(existingItems.map((item) => item.id));
  const base = preferredId || "custom-bg";
  if (!used.has(base)) return base;
  let index = 2;
  while (used.has(`${base}-${index}`)) index += 1;
  return `${base}-${index}`;
}

function normalizeActiveCustomBackgroundId(value, customBackgroundImages) {
  const preferredId = sanitizeCustomBackgroundId(value);
  if (preferredId && customBackgroundImages.some((item) => item.id === preferredId)) return preferredId;
  return customBackgroundImages[0]?.id || "";
}

function normalizeCustomBackgroundImage(value = "") {
  const image = String(value || "").trim();
  return image.startsWith("data:image/") ? image : "";
}

function normalizeHexColor(value = "") {
  const color = String(value || "").trim();
  const short = color.match(/^#([0-9a-f]{3})$/i)?.[1];
  if (short) {
    return `#${short.split("").map((item) => item + item).join("")}`.toLowerCase();
  }
  return /^#[0-9a-f]{6}$/i.test(color) ? color.toLowerCase() : "";
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function normalizeCategory(category, index) {
  const order = Number.isFinite(category.order) ? category.order : index;
  const useCount = Number.isFinite(category.useCount) ? Math.max(0, category.useCount) : 0;
  const icon = normalizeCategoryIcon(category.icon) || defaultCategoryIcons[category.id] || initials(category.name);
  const iconImage = normalizeCategoryIconImage(category.iconImage);
  return { ...category, icon, iconImage, order, useCount };
}

function normalizeCategoryIconImage(value = "") {
  const image = String(value || "").trim();
  return image.startsWith("data:image/") ? image : "";
}

function normalizeSearchHistory(history = []) {
  const seen = new Set();
  return (Array.isArray(history) ? history : [])
    .map((item) => String(item).trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, SEARCH_HISTORY_LIMIT);
}

function setDate() {
  const formatter = new Intl.DateTimeFormat(state.locale === "en" ? "en-AU" : "zh-CN", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
  els.todayText.textContent = formatter.format(new Date());
}

function bindEvents() {
  els.searchForm.addEventListener("submit", onSearch);
  els.searchInput.addEventListener("focus", showSearchHistoryPanel);
  els.searchInput.addEventListener("input", () => {
    updateSearchClearButton();
    renderSearchPanel();
    showSearchHistoryPanel();
  });
  els.searchInput.addEventListener("keydown", onSearchInputKeydown);
  els.searchEngineBtn.addEventListener("click", openSearchEngineDialog);
  els.searchClearBtn.addEventListener("click", clearSearchInput);
  els.historyToggleBtn.addEventListener("click", toggleSearchHistory);
  els.hideHistoryBtn.addEventListener("click", hideSearchHistory);
  els.clearHistoryBtn.addEventListener("click", clearSearchHistory);
  els.addCategoryBtn.addEventListener("click", () => openCategoryDialog());
  els.editCategoryBtn.addEventListener("click", () => openCategoryDialog(getActiveCategory()));
  els.addShortcutBtn.addEventListener("click", () => openShortcutDialog());
  els.categoryForm.addEventListener("submit", onCategorySubmit);
  els.shortcutForm.addEventListener("submit", onShortcutSubmit);
  els.deleteCategoryBtn.addEventListener("click", onDeleteCategory);
  els.categoryNameInput.addEventListener("input", updateCategoryIconPreview);
  els.categoryIconInput.addEventListener("input", updateCategoryIconPreview);
  els.uploadCategoryIconBtn.addEventListener("click", () => els.categoryIconFileInput.click());
  els.removeCategoryIconBtn.addEventListener("click", removeCategoryIconImage);
  els.categoryIconFileInput.addEventListener("change", onCategoryIconFileChange);
  els.deleteShortcutBtn.addEventListener("click", onDeleteShortcut);
  els.moveCategoryUpBtn.addEventListener("click", () => moveCategory(-1));
  els.moveCategoryDownBtn.addEventListener("click", () => moveCategory(1));
  els.searchEngineList.addEventListener("click", onSearchEngineListClick);
  els.searchEngineForm.addEventListener("submit", onSearchEngineSubmit);
  els.newSearchEngineBtn.addEventListener("click", resetSearchEngineForm);
  els.cancelSearchEngineBtn.addEventListener("click", resetSearchEngineForm);
  els.deleteSearchEngineBtn.addEventListener("click", deleteEditingSearchEngine);
  els.customizeBtn.addEventListener("click", openCustomizeDialog);
  els.customizeDialog.addEventListener("click", onCustomizeDialogClick);
  els.railHomeBtn.addEventListener("click", () => setMode("runner"));
  els.railSearchBtn.addEventListener("click", openFocusSearchDialog);
  els.railCategoriesBtn.addEventListener("click", () => {
    setMode("runner");
    els.categoryList.querySelector("button")?.focus();
  });
  els.railCustomizeBtn.addEventListener("click", openCustomizeDialog);
  els.focusSearchInput.addEventListener("input", () => renderFocusSearch({ resetSelection: true }));
  els.focusSearchInput.addEventListener("keydown", onFocusSearchInputKeydown);
  els.clearFocusSearchBtn.addEventListener("click", clearFocusSearch);
  els.focusSearchResults.addEventListener("click", onFocusSearchResultClick);
  els.focusSearchResults.addEventListener("pointermove", onFocusSearchResultPointerMove);
  els.focusSearchDialog.addEventListener("click", onFocusSearchDialogClick);
  els.focusSearchDialog.addEventListener("close", onFocusSearchDialogClosed);
  els.languageOptions.addEventListener("click", onLanguageOptionClick);
  els.designThemeOptions.addEventListener("click", onDesignThemeOptionClick);
  els.appearanceOptions.addEventListener("click", onAppearanceOptionClick);
  els.themeColorOptions.addEventListener("click", onThemeColorOptionClick);
  els.themeColorInput.addEventListener("input", onThemeColorInput);
  els.importAppearancePresetBtn.addEventListener("click", openPresetImportDialog);
  els.appearancePresetFileInput.addEventListener("change", onPresetImportFileChange);
  els.saveAppearancePresetBtn.addEventListener("click", saveCurrentAppearancePreset);
  els.updateAppearancePresetBtn.addEventListener("click", updateActiveAppearancePreset);
  els.exportAppearancePresetBtn.addEventListener("click", exportAppearancePresets);
  els.appearancePresetList.addEventListener("click", onAppearancePresetListClick);
  els.applyImportedPresetBtn.addEventListener("click", applyPendingImportedPreset);
  els.keepCurrentAppearanceBtn.addEventListener("click", closePresetImportResultDialog);
  els.dismissPresetImportResultBtn.addEventListener("click", closePresetImportResultDialog);
  els.closePresetImportResultBtn.addEventListener("click", closePresetImportResultDialog);
  els.presetImportResultDialog.addEventListener("close", () => {
    pendingImportedPresetId = "";
    presetImportResultState = null;
  });
  els.backgroundGrid.addEventListener("click", onBackgroundOptionClick);
  els.backgroundOpacityInput.addEventListener("input", onBackgroundOpacityInput);
  els.backgroundBlurInput.addEventListener("input", onBackgroundBlurInput);
  els.panelOpacityInput.addEventListener("input", onPanelOpacityInput);
  els.panelBlurInput.addEventListener("input", onPanelBlurInput);
  els.iconRadiusInput.addEventListener("input", onIconRadiusInput);
  els.iconRadiusQuickOptions.addEventListener("click", onIconRadiusQuickOptionClick);
  els.cardRadiusInput.addEventListener("input", onCardRadiusInput);
  els.panelRadiusInput.addEventListener("input", onPanelRadiusInput);
  els.buttonRadiusInput.addEventListener("input", onButtonRadiusInput);
  els.cornerAccentsInput.addEventListener("change", onCornerAccentsChange);
  els.fontScaleInput.addEventListener("input", onFontScaleInput);
  els.cardDensityOptions.addEventListener("click", onCardDensityOptionClick);
  els.sortShortcutsByUsageInput.addEventListener("change", onSortShortcutsByUsageChange);
  els.uploadBackgroundBtn.addEventListener("click", () => els.backgroundFileInput.click());
  els.removeBackgroundBtn.addEventListener("click", removeCustomBackground);
  els.resetAppearanceBtn.addEventListener("click", openResetAppearanceDialog);
  els.closeResetAppearanceDialogBtn.addEventListener("click", closeResetAppearanceDialog);
  els.cancelResetAppearanceBtn.addEventListener("click", closeResetAppearanceDialog);
  els.confirmResetAppearanceBtn.addEventListener("click", resetAppearance);
  els.feedbackCloseBtn.addEventListener("click", () => resolveFeedbackDialog(null));
  els.feedbackCancelBtn.addEventListener("click", () => resolveFeedbackDialog(null));
  els.feedbackConfirmBtn.addEventListener("click", () => {
    resolveFeedbackDialog(els.feedbackInputWrap.hidden ? true : els.feedbackInput.value);
  });
  els.feedbackInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      resolveFeedbackDialog(els.feedbackInput.value);
    }
  });
  els.feedbackDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    resolveFeedbackDialog(null);
  });
  els.backgroundFileInput.addEventListener("change", onBackgroundFileChange);
  els.exportDataBtn.addEventListener("click", exportCompleteData);
  els.importBookmarksBtn.addEventListener("click", openBookmarkImportDialog);
  els.importDataBtn.addEventListener("click", () => {
    els.dataBackupFileInput.value = "";
    els.dataBackupFileInput.click();
  });
  els.dataBackupFileInput.addEventListener("change", onDataBackupFileChange);
  els.bookmarkImportList.addEventListener("change", onBookmarkImportSelectionChange);
  els.toggleAllBookmarkGroupsBtn.addEventListener("click", toggleAllBookmarkGroups);
  els.closeBookmarkImportBtn.addEventListener("click", closeBookmarkImportDialog);
  els.cancelBookmarkImportBtn.addEventListener("click", closeBookmarkImportDialog);
  els.confirmBookmarkImportBtn.addEventListener("click", importSelectedBookmarks);
  els.bookmarkImportDialog.addEventListener("cancel", (event) => {
    if (bookmarkImportBusy) event.preventDefault();
  });
  els.languageToggleBtn.addEventListener("click", toggleLocale);
  els.classicLanguageBtn.addEventListener("click", toggleLocale);
  els.nativeHomeBtn.addEventListener("click", disableExtension);
  els.runnerHomeBtn.addEventListener("click", () => setMode("runner"));
  els.classicSearchForm.addEventListener("submit", onClassicSearch);
  els.refreshIconBtn.addEventListener("click", updateIconPreview);
  els.shortcutTitleInput.addEventListener("input", updateIconPreview);
  els.shortcutUrlInput.addEventListener("input", updateIconPreview);
  els.shortcutColorInput.addEventListener("input", updateIconPreview);
  window.matchMedia?.("(prefers-color-scheme: light)").addEventListener("change", () => {
    if (state.appearance.theme === "system") {
      applyAppearance();
      renderCustomizerControls();
    }
  });

  document.querySelectorAll(".close-dialog").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest("dialog").close();
    });
  });

  els.categoryList.addEventListener("click", async (event) => {
    if (categoryDrag.suppressClick) {
      event.preventDefault();
      categoryDrag.suppressClick = false;
      return;
    }
    const button = event.target.closest("[data-category-id]");
    if (!button) return;
    await activateCategory(button.dataset.categoryId);
  });

  els.categoryList.addEventListener("contextmenu", (event) => {
    const button = event.target.closest("[data-category-id]");
    if (!button) return;
    event.preventDefault();
    const category = state.categories.find((item) => item.id === button.dataset.categoryId);
    if (category) openCategoryDialog(category);
  });

  els.categoryList.addEventListener("pointerdown", onCategoryPointerDown);
  els.categoryList.addEventListener("pointermove", onCategoryPointerMove);
  els.categoryList.addEventListener("pointerup", onCategoryPointerUp);
  els.categoryList.addEventListener("pointercancel", onCategoryPointerCancel);
  els.shortcutGrid.addEventListener("pointerdown", onShortcutPointerDown);
  els.shortcutGrid.addEventListener("pointermove", onShortcutPointerMove);
  els.shortcutGrid.addEventListener("pointerup", onShortcutPointerUp);
  els.shortcutGrid.addEventListener("pointercancel", onShortcutPointerCancel);
  els.shortcutGrid.addEventListener("dragstart", (event) => {
    if (event.target.closest(".shortcut-icon")) {
      event.preventDefault();
    }
  });

  els.searchSuggestionList.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-search-value]");
    if (!button) return;
    await runSearch(button.dataset.searchValue);
  });

  document.addEventListener("pointerdown", (event) => {
    if (!els.searchForm.contains(event.target)) {
      hideSearchHistoryPanel();
    }
  });

  els.shortcutGrid.addEventListener("click", async (event) => {
    if (shortcutDrag.suppressClick) {
      event.preventDefault();
      shortcutDrag.suppressClick = false;
      return;
    }

    const editButton = event.target.closest("[data-edit-shortcut]");
    if (editButton) {
      const shortcut = state.shortcuts.find((item) => item.id === editButton.dataset.editShortcut);
      if (shortcut) openShortcutDialog(shortcut);
      return;
    }

    const card = event.target.closest("[data-open-url]");
    if (card) {
      const shortcut = state.shortcuts.find((item) => item.id === card.dataset.shortcutId);
      if (shortcut) {
        await recordShortcutUse(shortcut.id);
      }
      window.location.href = card.dataset.openUrl;
    }
  });
}

function render() {
  const activeCategory = getActiveCategory();
  applyI18n();
  applyAppearance();
  document.body.classList.toggle("classic-mode", state.mode === "classic");
  els.classicHome.hidden = state.mode !== "classic";
  els.activeCategoryName.textContent = displayCategoryName(activeCategory);
  els.shortcutTotal.textContent = String(state.shortcuts.length).padStart(2, "0");
  els.categoryTotal.textContent = String(state.categories.length).padStart(2, "0");
  renderSearchEngineControls();
  renderCategories();
  updateSearchClearButton();
  renderSearchPanel();
  if (els.focusSearchDialog.open) renderFocusSearch();
  renderShortcutSelect();
  renderShortcuts();
  if (els.customizeDialog.open) renderCustomizerControls();
  if (state.mode === "classic") {
    renderClassicShortcuts();
  } else {
    els.classicShortcutGrid.replaceChildren();
  }
}

function applyI18n() {
  els.doc.lang = t("htmlLang");
  setDate();
  els.brandKicker.textContent = t("brandKicker");
  els.brandTitle.textContent = t("brandTitle");
  els.topbar.setAttribute("aria-label", t("topbarLabel"));
  els.systemPanel.setAttribute("aria-label", t("systemPanelLabel"));
  els.sidebar.setAttribute("aria-label", t("sidebarLabel"));
  els.classicShortcutGrid.setAttribute("aria-label", t("classicShortcutsLabel"));
  els.searchInputLabel.textContent = t("searchInputLabel");
  els.classicSearchInputLabel.textContent = t("searchInputLabel");
  els.languageToggleBtn.textContent = t("languageToggle");
  els.languageToggleBtn.setAttribute("aria-label", t("languageTitle"));
  els.classicLanguageBtn.textContent = t("languageToggle");
  els.classicLanguageBtn.setAttribute("aria-label", t("languageTitle"));
  els.nativeHomeBtn.textContent = t("nativeHome");
  els.nativeHomeBtn.title = t("disableExtensionTitle");
  els.nativeHomeBtn.setAttribute("aria-label", t("disableExtensionTitle"));
  els.customizeBtn.textContent = t("customize");
  els.runnerHomeBtn.textContent = t("runnerHome");
  els.searchPrefix.textContent = t("searchPrefix");
  els.searchInput.placeholder = t("searchPlaceholder");
  els.searchEngineBtn.title = t("switchSearchEngine");
  els.searchEngineBtn.setAttribute("aria-label", t("switchSearchEngine"));
  els.searchClearBtn.title = t("clearSearchInput");
  els.searchClearBtn.setAttribute("aria-label", t("clearSearchInput"));
  els.searchSubmitBtn.textContent = t("searchButton");
  els.searchSubmitBtn.title = t("searchButton");
  els.searchSubmitBtn.setAttribute("aria-label", t("searchButton"));
  els.historyToggleBtn.textContent = t("historyToggle");
  const historyPanelOpen = !els.searchHistoryPanel.hidden;
  els.historyToggleBtn.title = t(historyPanelOpen ? "hideHistory" : "showHistory");
  els.historyToggleBtn.setAttribute("aria-label", t(historyPanelOpen ? "hideHistory" : "showHistory"));
  els.historyToggleBtn.setAttribute("aria-expanded", String(historyPanelOpen));
  els.historyToggleBtn.setAttribute("aria-pressed", String(historyPanelOpen));
  els.historyToggleBtn.classList.toggle("is-off", !state.showSearchHistory);
  els.searchPanelTitle.textContent = els.searchInput.value.trim() ? t("relatedSearches") : t("searchHistory");
  els.clearHistoryBtn.textContent = t("clearHistory");
  els.hideHistoryBtn.textContent = t("hideHistory");
  els.classicSearchInput.placeholder = t("classicSearchPlaceholder");
  els.classicSearchForm.querySelector("button").textContent = t("aiMode");
  els.signalLabel.textContent = t("signal");
  els.clustersStatLabel.textContent = t("clusters");
  els.clustersLabel.textContent = t("clusters");
  els.addCategoryBtn.title = t("addCategoryTitle");
  els.addCategoryBtn.setAttribute("aria-label", t("addCategoryTitle"));
  els.panelEyebrow.textContent = t("panelEyebrow");
  els.editCategoryBtn.textContent = t("editCluster");
  els.addShortcutBtn.textContent = t("addNode");
  els.emptyState.textContent = t("emptyState");
  els.moveCategoryUpBtn.textContent = t("moveUp");
  els.moveCategoryDownBtn.textContent = t("moveDown");
  els.deleteCategoryBtn.textContent = t("delete");
  els.cancelCategoryBtn.textContent = t("cancel");
  els.saveCategoryBtn.textContent = t("save");
  if (els.categoryDialog.open) {
    els.categoryDialogTitle.textContent = els.categoryId.value ? t("editCategory") : t("addCategory");
  }
  els.previewTitle.textContent = t("autoIcon");
  els.previewCopy.textContent = t("autoIconCopy");
  els.refreshIconBtn.textContent = t("refresh");
  els.deleteShortcutBtn.textContent = t("delete");
  els.cancelShortcutBtn.textContent = t("cancel");
  els.saveShortcutBtn.textContent = t("save");
  setLabelText(els.categoryNameInput, t("categoryName"));
  setLabelText(els.categoryIconInput, t("categoryIcon"));
  els.categoryIconInput.placeholder = t("categoryIconPlaceholder");
  document.querySelector("#categoryIconImageTitle").textContent = t("categoryIconImage");
  document.querySelector("#categoryIconImageCopy").textContent = t("categoryIconImageCopy");
  els.uploadCategoryIconBtn.textContent = t("uploadIcon");
  els.removeCategoryIconBtn.textContent = t("removeIcon");
  els.searchEngineDialogTitle.textContent = t("searchEngineDialogTitle");
  els.newSearchEngineBtn.textContent = t("newSearchEngine");
  els.searchEngineTemplateHelp.textContent = t("searchEngineTemplateHelp");
  els.searchEngineUrlInput.placeholder = t("searchEngineUrlPlaceholder");
  els.deleteSearchEngineBtn.textContent = t("delete");
  els.cancelSearchEngineBtn.textContent = t("cancel");
  els.saveSearchEngineBtn.textContent = t("save");
  els.searchEngineFormTitle.textContent = els.searchEngineId.value ? t("editSearchEngine") : t("addSearchEngine");
  setLabelText(els.searchEngineNameInput, t("searchEngineName"));
  setLabelText(els.searchEngineShortcutInput, t("searchEngineShortcut"));
  setLabelText(els.searchEngineUrlInput, t("searchEngineUrl"));
  els.customizeDialogTitle.textContent = t("customizeTitle");
  els.designThemeTitle.textContent = t("designThemeTitle");
  els.languageTitle.textContent = t("languageTitle");
  els.appearanceTitle.textContent = t("appearanceTitle");
  els.themeColorTitle.textContent = t("themeColorTitle");
  els.customThemeColorLabel.textContent = t("customThemeColor");
  els.sizeRadiusTitle.textContent = t("sizeRadiusTitle");
  els.iconRadiusLabel.textContent = t("iconRadius");
  els.cardRadiusLabel.textContent = t("cardRadius");
  els.panelRadiusLabel.textContent = t("panelRadius");
  els.buttonRadiusLabel.textContent = t("buttonRadius");
  els.cornerAccentsLabel.textContent = t("cornerAccents");
  els.cornerAccentsDescription.textContent = t("cornerAccentsDescription");
  els.cornerAccentsInput.setAttribute("aria-label", t("cornerAccents"));
  els.fontScaleLabel.textContent = t("fontScale");
  els.cardDensityLabel.textContent = t("cardDensity");
  els.shortcutSettingsTitle.textContent = t("shortcutSettings");
  els.sortShortcutsByUsageLabel.textContent = t("sortShortcutsByUsage");
  els.sortShortcutsByUsageDescription.textContent = t("sortShortcutsByUsageDescription");
  els.sortShortcutsByUsageInput.setAttribute("aria-label", t("sortShortcutsByUsage"));
  els.shapePreviewCardLabel.textContent = t("previewCard");
  els.shapePreviewButton.textContent = t("previewButton");
  els.appearancePresetTitle.textContent = t("appearancePresets");
  els.importAppearancePresetBtn.textContent = t("importPreset");
  els.saveAppearancePresetBtn.textContent = t("savePreset");
  els.updateAppearancePresetBtn.textContent = t("updatePreset");
  els.exportAppearancePresetBtn.textContent = t("exportPreset");
  els.keepCurrentAppearanceBtn.textContent = t("keepCurrent");
  els.applyImportedPresetBtn.textContent = t("applyNow");
  els.dismissPresetImportResultBtn.textContent = t("close");
  els.closePresetImportResultBtn.title = t("close");
  els.wallpaperTitle.textContent = t("wallpaperTitle");
  els.backgroundOpacityLabel.textContent = t("backgroundOpacity");
  els.backgroundBlurLabel.textContent = t("backgroundBlur");
  els.panelOpacityLabel.textContent = t("panelOpacity");
  els.panelBlurLabel.textContent = t("panelBlur");
  els.uploadBackgroundBtn.textContent = t("uploadBackground");
  els.removeBackgroundBtn.textContent = t("removeBackground");
  els.dataTransferTitle.textContent = t("dataTransferTitle");
  els.dataTransferCopy.textContent = t("dataTransferCopy");
  els.importBookmarksBtn.textContent = t("importChromeBookmarks");
  els.exportDataBtn.textContent = t("exportAllData");
  els.importDataBtn.textContent = t("importAllData");
  els.resetTitle.textContent = t("resetTitle");
  els.resetDescription.textContent = t("resetDescription");
  els.resetAppearanceBtn.textContent = t("resetAppearance");
  els.resetAppearanceDialogTitle.textContent = t("resetAppearanceDialogTitle");
  els.resetAppearanceMessage.textContent = t("resetAppearanceConfirm");
  els.cancelResetAppearanceBtn.textContent = t("cancel");
  els.confirmResetAppearanceBtn.textContent = t("confirmReset");
  els.closeResetAppearanceDialogBtn.title = t("closeDialog");
  els.closeResetAppearanceDialogBtn.setAttribute("aria-label", t("closeDialog"));
  els.globalRail.setAttribute("aria-label", t("topbarLabel"));
  setRailButtonLabel(els.railHomeBtn, t("railHome"));
  setRailButtonLabel(els.railSearchBtn, t("railSearch"));
  setRailButtonLabel(els.railCategoriesBtn, t("railCategories"));
  setRailButtonLabel(els.railCustomizeBtn, t("railCustomize"));
  els.focusSearchEyebrow.textContent = t("focusSearchEyebrow");
  els.focusSearchDialogTitle.textContent = t("focusSearchTitle");
  els.focusSearchInputLabel.textContent = t("focusSearchInputLabel");
  els.focusSearchInput.placeholder = t("focusSearchPlaceholder");
  els.clearFocusSearchBtn.title = t("focusSearchClear");
  els.clearFocusSearchBtn.setAttribute("aria-label", t("focusSearchClear"));
  els.focusSearchResults.setAttribute("aria-label", t("focusSearchResultsLabel"));
  els.footerStatus.textContent = t("footerReady");
  els.footerTheme.textContent = t("footerTheme", { theme: getDesignThemeLabel(state.appearance.designTheme) });
  els.footerVersion.textContent = `v${chrome.runtime?.getManifest?.().version || "2.2.2"}`;
  els.feedbackCloseBtn.title = t("closeDialog");
  els.feedbackCloseBtn.setAttribute("aria-label", t("closeDialog"));
  els.feedbackCancelBtn.textContent = t("cancel");
  els.feedbackConfirmBtn.textContent = t("confirm");
  els.feedbackInputLabel.textContent = t("textInputLabel");
  setLabelText(els.shortcutTitleInput, t("shortcutTitle"));
  setLabelText(els.shortcutUrlInput, t("shortcutUrl"));
  setLabelText(els.shortcutCategorySelect, t("shortcutCategory"));
  setLabelText(els.shortcutColorInput, t("backupColor"));
  if (els.shortcutDialog.open) {
    els.shortcutDialogTitle.textContent = els.shortcutId.value ? t("editShortcut") : t("addShortcut");
  }
  document.querySelectorAll(".close-dialog").forEach((button) => {
    button.title = t("closeDialog");
    button.setAttribute("aria-label", t("closeDialog"));
  });
  els.closePresetImportResultBtn.title = t("closeDialog");
  els.closePresetImportResultBtn.setAttribute("aria-label", t("closeDialog"));
  if (els.presetImportResultDialog.open) renderPresetImportResult();
  els.closeBookmarkImportBtn.title = t("closeDialog");
  els.closeBookmarkImportBtn.setAttribute("aria-label", t("closeDialog"));
  els.cancelBookmarkImportBtn.textContent = t("cancel");
  if (els.bookmarkImportDialog.open) renderBookmarkImportDialog();
}

function setRailButtonLabel(button, label) {
  button.title = label;
  button.setAttribute("aria-label", label);
}

function getDesignThemeLabel(themeId) {
  const theme = designThemes.find((item) => item.id === themeId) || designThemes[0];
  return t(theme.labelKey);
}

function openConfirmDialog(message, title = t("confirmationTitle")) {
  return openFeedbackDialog({ title, message, input: false });
}

function openTextPrompt(message, initialValue = "", title = t("renameTitle")) {
  return openFeedbackDialog({ title, message, input: true, initialValue });
}

function openFeedbackDialog({ title, message, input, initialValue = "" }) {
  if (feedbackResolver) resolveFeedbackDialog(null);
  els.feedbackDialogTitle.textContent = title;
  els.feedbackDialogMessage.textContent = message;
  els.feedbackInputWrap.hidden = !input;
  els.feedbackInput.value = input ? String(initialValue) : "";
  if (!els.feedbackDialog.open) els.feedbackDialog.showModal();

  requestAnimationFrame(() => {
    if (input) {
      els.feedbackInput.focus();
      els.feedbackInput.select();
    } else {
      els.feedbackConfirmBtn.focus();
    }
  });

  return new Promise((resolve) => {
    feedbackResolver = resolve;
  });
}

function resolveFeedbackDialog(value) {
  const resolve = feedbackResolver;
  feedbackResolver = null;
  if (els.feedbackDialog.open) els.feedbackDialog.close();
  resolve?.(value);
}

function showToast(message, tone = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${tone}`;
  toast.textContent = message;
  els.toastRegion.replaceChildren(toast);
  window.setTimeout(() => {
    if (toast.isConnected) toast.remove();
  }, 2800);
}

function setLabelText(control, text) {
  const label = control.closest("label");
  if (!label) return;
  const textNode = Array.from(label.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
  if (textNode) textNode.textContent = `\n          ${text}\n          `;
}

function applyAppearance() {
  const appearance = normalizeAppearance(state.appearance);
  state.appearance = appearance;
  const resolvedTheme = appearance.theme === "system" ? systemTheme() : appearance.theme;
  const accentRgb = appearance.designTheme === "minimal"
    ? [222, 222, 222]
    : hexToRgb(appearance.accentColor);
  const effectTheme = appearance.designTheme === "minimal" ? "dark" : resolvedTheme;
  const accentText = accessibleAccentText(accentRgb, effectTheme);
  const onAccent = bestContrastingText(accentRgb);
  const accentEffects = createAccentEffects(accentRgb, effectTheme);
  const activeCustomBackground = getActiveCustomBackground(appearance);
  document.documentElement.dataset.theme = appearance.designTheme;
  document.body.dataset.colorMode = resolvedTheme;
  document.body.dataset.background = appearance.background;
  document.body.dataset.cardDensity = appearance.cardDensity;
  document.body.classList.toggle("has-custom-background", appearance.background === "custom" && Boolean(activeCustomBackground));
  document.body.classList.toggle("has-panel-blur", appearance.panelBlur > 0);
  document.body.classList.toggle("show-corner-accents", appearance.cornerAccentsEnabled);
  document.body.style.setProperty("--accent", rgbCss(accentRgb));
  document.body.style.setProperty("--line-hot", rgbCss(accentRgb));
  document.body.style.setProperty("--accent-rgb", accentRgb.join(" "));
  document.body.style.setProperty("--accent-text", rgbCss(accentText));
  document.body.style.setProperty("--on-accent", onAccent);
  document.body.style.setProperty("--accent-cyan", rgbCss(accentRgb));
  document.body.style.setProperty("--accent-violet", rgbCss(accentRgb));
  document.body.style.setProperty("--accent-soft", accentEffects.soft);
  document.body.style.setProperty("--accent-hover", accentEffects.hover);
  document.body.style.setProperty("--accent-active", accentEffects.active);
  document.body.style.setProperty("--accent-border", accentEffects.border);
  document.body.style.setProperty("--accent-border-strong", accentEffects.borderStrong);
  document.body.style.setProperty("--line", accentEffects.border);
  document.body.style.setProperty("--background-hover", accentEffects.hover);
  document.body.style.setProperty("--border-default", accentEffects.border);
  document.body.style.setProperty("--border-strong", accentEffects.borderStrong);
  document.body.style.setProperty("--action-primary", rgbCss(accentRgb));
  document.body.style.setProperty("--action-primary-hover", accentEffects.primaryHover);
  document.body.style.setProperty("--focus-ring", rgbCss(accentRgb));
  document.body.style.setProperty("--custom-background-opacity", String(appearance.backgroundOpacity));
  document.body.style.setProperty("--custom-background-blur", `${appearance.backgroundBlur}px`);
  document.body.style.setProperty("--icon-radius", appearance.iconRadiusUnit === "percent" ? "50%" : `${appearance.iconRadius}px`);
  document.body.style.setProperty("--card-radius", `${appearance.cardRadius}px`);
  document.body.style.setProperty("--panel-radius", `${appearance.panelRadius}px`);
  document.body.style.setProperty("--button-radius", `${appearance.buttonRadius}px`);
  document.body.style.setProperty("--font-scale", String(appearance.fontScale));
  applyPanelVariables(appearance, resolvedTheme);

  if (activeCustomBackground) {
    document.body.style.setProperty("--custom-background-image", `url(${JSON.stringify(activeCustomBackground.image)})`);
  } else {
    document.body.style.removeProperty("--custom-background-image");
  }

  if (appearance.designTheme === "minimal") {
    classifyRenderedMonochromeIcons();
  }
}

function applyPanelVariables(appearance, resolvedTheme) {
  const isLight = resolvedTheme === "light";
  const panelRgb = isLight ? [246, 249, 239] : [10, 11, 10];
  const panelStrongRgb = isLight ? [248, 250, 239] : [17, 19, 16];
  const panelSoftRgb = isLight ? [233, 239, 220] : [24, 27, 23];
  const opacity = clampNumber(appearance.panelOpacity, 0.1, 1, defaultData.appearance.panelOpacity);
  const strongOpacity = clampNumber(opacity + 0.03, 0.1, 1, 1);
  const softOpacity = clampNumber(opacity + 0.02, 0.1, 1, 1);

  document.body.style.setProperty("--panel", `rgba(${panelRgb.join(", ")}, ${opacity})`);
  document.body.style.setProperty("--panel-strong", `rgba(${panelStrongRgb.join(", ")}, ${strongOpacity})`);
  document.body.style.setProperty("--panel-soft", `rgba(${panelSoftRgb.join(", ")}, ${softOpacity})`);
  document.body.style.setProperty("--panel-blur", `${appearance.panelBlur}px`);
}

function getActiveCustomBackground(appearance = state.appearance) {
  const normalized = normalizeAppearance(appearance);
  return normalized.customBackgroundImages.find((item) => item.id === normalized.activeCustomBackgroundId) || null;
}

function hexToRgb(color) {
  const normalized = normalizeHexColor(color) || defaultData.appearance.accentColor;
  return [
    Number.parseInt(normalized.slice(1, 3), 16),
    Number.parseInt(normalized.slice(3, 5), 16),
    Number.parseInt(normalized.slice(5, 7), 16)
  ];
}

function relativeLuminance(rgb) {
  return rgb.reduce((total, channel, index) => {
    const normalized = channel / 255;
    const linear = normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
    const weight = [0.2126, 0.7152, 0.0722][index];
    return total + linear * weight;
  }, 0);
}

function contrastRatio(firstRgb, secondRgb) {
  const first = relativeLuminance(firstRgb);
  const second = relativeLuminance(secondRgb);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

function mixRgb(source, target, amount) {
  return source.map((channel, index) => Math.round(channel + (target[index] - channel) * amount));
}

function createAccentEffects(accentRgb, resolvedTheme) {
  const isLight = resolvedTheme === "light";
  const hoverTarget = isLight ? [0, 0, 0] : [255, 255, 255];

  return {
    soft: `rgb(${accentRgb.join(" ")} / ${isLight ? "9%" : "10%"})`,
    hover: `rgb(${accentRgb.join(" ")} / ${isLight ? "14%" : "16%"})`,
    active: `rgb(${accentRgb.join(" ")} / ${isLight ? "20%" : "24%"})`,
    border: `rgb(${accentRgb.join(" ")} / ${isLight ? "28%" : "25%"})`,
    borderStrong: `rgb(${accentRgb.join(" ")} / 72%)`,
    primaryHover: rgbCss(mixRgb(accentRgb, hoverTarget, isLight ? 0.1 : 0.14))
  };
}

function accessibleAccentText(accentRgb, resolvedTheme) {
  const background = resolvedTheme === "light" ? [248, 250, 245] : [10, 12, 9];
  const target = resolvedTheme === "light" ? [5, 5, 5] : [255, 255, 255];

  for (let step = 0; step <= 25; step += 1) {
    const candidate = mixRgb(accentRgb, target, step / 25);
    if (contrastRatio(candidate, background) >= 4.5) return candidate;
  }

  return target;
}

function bestContrastingText(backgroundRgb) {
  const dark = [5, 5, 5];
  const light = [255, 255, 255];
  return contrastRatio(backgroundRgb, dark) >= contrastRatio(backgroundRgb, light)
    ? "#050505"
    : "#ffffff";
}

function rgbCss(rgb) {
  return `rgb(${rgb.join(" ")})`;
}

function systemTheme() {
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function openCustomizeDialog() {
  renderCustomizerControls();
  els.customizeDialog.showModal();
}

function isDialogBackdropClick(event, dialog) {
  if (!dialog || event.target !== dialog) return false;
  if (!Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) return false;

  const rect = dialog.getBoundingClientRect();
  return event.clientX < rect.left
    || event.clientX > rect.right
    || event.clientY < rect.top
    || event.clientY > rect.bottom;
}

function onCustomizeDialogClick(event) {
  if (isDialogBackdropClick(event, els.customizeDialog)) {
    els.customizeDialog.close();
  }
}

function renderCustomizerControls() {
  renderDesignThemeOptions();
  renderLanguageOptions();
  renderAppearanceOptions();
  renderThemeColorOptions();
  renderShapeControls();
  els.sortShortcutsByUsageInput.checked = state.sortShortcutsByUsage === true;
  renderAppearancePresetControls();
  renderBackgroundOptions();
  renderBackgroundTuningControls();
  els.removeBackgroundBtn.hidden = !(state.appearance.background === "custom" && getActiveCustomBackground());
}

function renderDesignThemeOptions() {
  els.designThemeOptions.replaceChildren(
    ...designThemes.map((theme, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "design-theme-option";
      button.dataset.designTheme = theme.id;
      button.setAttribute("aria-current", String(state.appearance.designTheme === theme.id));
      button.innerHTML = `
        <span class="design-theme-visual theme-${theme.id}" aria-hidden="true">
          <span class="theme-visual-index">0${index + 1}</span>
          <span class="theme-visual-grid"></span>
        </span>
        <span class="design-theme-copy">
          <span class="design-theme-code"></span>
          <strong></strong>
          <small></small>
        </span>
      `;
      button.querySelector(".design-theme-code").textContent = theme.code;
      button.querySelector("strong").textContent = t(theme.labelKey);
      button.querySelector("small").textContent = t(theme.copyKey);
      return button;
    })
  );
}

function renderLanguageOptions() {
  els.languageOptions.replaceChildren(
    ...localeOptions.map((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "segmented-option";
      button.dataset.locale = option.id;
      button.textContent = t(option.labelKey);
      button.setAttribute("aria-pressed", String(state.locale === option.id));
      return button;
    })
  );
}

function renderShapeControls() {
  const appearance = normalizeAppearance(state.appearance);
  state.appearance = appearance;
  els.iconRadiusInput.value = appearance.iconRadiusUnit === "percent" ? "25" : String(appearance.iconRadius);
  els.iconRadiusValue.textContent = formatIconRadius(appearance);
  els.cardRadiusInput.value = String(appearance.cardRadius);
  els.cardRadiusValue.textContent = `${appearance.cardRadius}px`;
  els.panelRadiusInput.value = String(appearance.panelRadius);
  els.panelRadiusValue.textContent = `${appearance.panelRadius}px`;
  els.buttonRadiusInput.value = String(appearance.buttonRadius);
  els.buttonRadiusValue.textContent = `${appearance.buttonRadius}px`;
  els.cornerAccentsInput.checked = appearance.cornerAccentsEnabled;
  els.fontScaleInput.value = String(Math.round(appearance.fontScale * 100));
  els.fontScaleValue.textContent = `${Math.round(appearance.fontScale * 100)}%`;

  els.iconRadiusQuickOptions.replaceChildren(
    ...iconRadiusQuickOptions.map((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quick-option";
      button.dataset.radiusValue = String(option.value);
      button.dataset.radiusUnit = option.unit;
      button.textContent = t(option.labelKey);
      const isActive = appearance.iconRadius === option.value && appearance.iconRadiusUnit === option.unit;
      button.setAttribute("aria-pressed", String(isActive));
      return button;
    })
  );

  els.cardDensityOptions.replaceChildren(
    ...cardDensityOptions.map((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "segmented-option";
      button.dataset.cardDensity = option.id;
      button.textContent = t(option.labelKey);
      button.setAttribute("aria-pressed", String(appearance.cardDensity === option.id));
      return button;
    })
  );
}

function formatIconRadius(appearance = state.appearance) {
  return appearance.iconRadiusUnit === "percent" ? "50%" : `${appearance.iconRadius}px`;
}

function renderAppearanceOptions() {
  els.appearanceOptions.replaceChildren(
    ...appearanceModes.map((mode) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "appearance-option";
      button.dataset.theme = mode.id;
      button.setAttribute("aria-current", String(state.appearance.theme === mode.id));
      button.innerHTML = `
        <span class="appearance-preview ${mode.id}"><span class="appearance-preview-icon">R</span></span>
        <strong></strong>
      `;
      button.querySelector("strong").textContent = t(mode.labelKey);
      return button;
    })
  );
}

function renderBackgroundOptions() {
  const appearance = normalizeAppearance(state.appearance);
  state.appearance = appearance;
  const options = [
    ...backgroundPresets,
    ...appearance.customBackgroundImages.map((background, index) => ({
      id: "custom",
      customBackgroundId: background.id,
      label: {
        "zh-CN": `${t("customBackground")} ${index + 1}`,
        en: `${t("customBackground")} ${index + 1}`
      },
      preview: `url(${JSON.stringify(background.image)})`
    }))
  ];

  els.backgroundGrid.replaceChildren(
    ...options.map((preset) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "wallpaper-option";
      button.dataset.background = preset.id;
      if (preset.customBackgroundId) {
        button.dataset.customBackgroundId = preset.customBackgroundId;
      }
      const isCurrent = preset.id === "custom"
        ? appearance.background === "custom" && appearance.activeCustomBackgroundId === preset.customBackgroundId
        : appearance.background === preset.id;
      button.setAttribute("aria-current", String(isCurrent));
      button.innerHTML = `<span class="wallpaper-swatch"></span><strong></strong>`;
      button.querySelector(".wallpaper-swatch").style.background = preset.preview;
      button.querySelector("strong").textContent = preset.label[state.locale] || preset.label.en || preset.id;
      return button;
    })
  );
}

function renderThemeColorOptions() {
  const activeColor = normalizeHexColor(state.appearance.accentColor) || defaultData.appearance.accentColor;
  els.themeColorInput.value = activeColor;
  els.themeColorOptions.replaceChildren(
    ...themeColorPresets.map((color) => {
      const normalized = normalizeHexColor(color);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "theme-color-option";
      button.dataset.accentColor = normalized;
      button.style.background = normalized;
      button.setAttribute("aria-label", normalized);
      button.setAttribute("aria-current", String(activeColor === normalized));
      return button;
    })
  );
}

function renderAppearancePresetControls() {
  const customBackgroundImages = normalizeAppearance(state.appearance).customBackgroundImages;
  state.appearancePresets = normalizeAppearancePresets(state.appearancePresets, customBackgroundImages, state.locale);
  const hasActivePreset = state.appearancePresets.some((preset) => preset.id === state.activeAppearancePresetId);
  els.updateAppearancePresetBtn.disabled = !hasActivePreset;

  if (!state.appearancePresets.length) {
    const empty = document.createElement("p");
    empty.className = "preset-empty";
    empty.textContent = t("noAppearancePresets");
    els.appearancePresetList.replaceChildren(empty);
    return;
  }

  els.appearancePresetList.replaceChildren(
    ...state.appearancePresets.map((preset) => createAppearancePresetItem(preset))
  );
}

function createAppearancePresetItem(preset) {
  const item = document.createElement("div");
  const isActive = preset.id === state.activeAppearancePresetId;
  item.className = "appearance-preset-item";
  item.dataset.presetId = preset.id;
  item.setAttribute("role", "listitem");
  item.setAttribute("aria-current", String(isActive));

  const mainButton = document.createElement("button");
  mainButton.type = "button";
  mainButton.className = "appearance-preset-main";
  mainButton.dataset.presetAction = "apply";
  mainButton.title = t("usePreset");

  const swatch = document.createElement("span");
  swatch.className = "appearance-preset-swatch";
  swatch.style.background = preset.appearance.accentColor;

  const copy = document.createElement("span");
  copy.className = "appearance-preset-copy";

  const name = document.createElement("strong");
  name.textContent = preset.name;

  const meta = document.createElement("span");
  meta.textContent = formatAppearancePresetMeta(preset.appearance);

  copy.append(name, meta);
  mainButton.append(swatch, copy);

  if (isActive) {
    const activeBadge = document.createElement("span");
    activeBadge.className = "appearance-preset-badge";
    activeBadge.textContent = t("activePreset");
    mainButton.append(activeBadge);
  }

  const actions = document.createElement("div");
  actions.className = "appearance-preset-actions";
  actions.append(
    createPresetActionButton("rename", t("renamePreset")),
    createPresetActionButton("delete", t("deletePreset"))
  );

  item.append(mainButton, actions);
  return item;
}

function createPresetActionButton(action, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "ghost-button compact-button";
  button.dataset.presetAction = action;
  button.textContent = label;
  return button;
}

function formatAppearancePresetMeta(appearance) {
  return [
    getThemeLabel(appearance.theme),
    getAppearanceBackgroundLabel(appearance),
    appearance.accentColor.toUpperCase(),
    `${Math.round(appearance.backgroundOpacity * 100)}%/${appearance.backgroundBlur}px`,
    `${Math.round(appearance.panelOpacity * 100)}%/${appearance.panelBlur}px`
  ].join(" · ");
}

function getThemeLabel(theme) {
  const mode = appearanceModes.find((item) => item.id === theme);
  return t(mode?.labelKey || "themeDark");
}

function getAppearanceBackgroundLabel(appearance) {
  if (appearance.background === "custom") {
    const currentAppearance = normalizeAppearance(state.appearance);
    const background = currentAppearance.customBackgroundImages.find((item) => item.id === appearance.activeCustomBackgroundId);
    return background?.name || t("customBackground");
  }
  const preset = backgroundPresets.find((item) => item.id === appearance.background);
  return preset?.label[state.locale] || preset?.label.en || appearance.background;
}

function renderBackgroundTuningControls() {
  const appearance = normalizeAppearance(state.appearance);
  const opacityPercent = Math.round(appearance.backgroundOpacity * 100);
  const panelOpacityPercent = Math.round(appearance.panelOpacity * 100);
  els.backgroundOpacityInput.value = String(opacityPercent);
  els.backgroundOpacityValue.textContent = `${opacityPercent}%`;
  els.backgroundBlurInput.value = String(appearance.backgroundBlur);
  els.backgroundBlurValue.textContent = `${appearance.backgroundBlur}px`;
  els.panelOpacityInput.value = String(panelOpacityPercent);
  els.panelOpacityValue.textContent = `${panelOpacityPercent}%`;
  els.panelBlurInput.value = String(appearance.panelBlur);
  els.panelBlurValue.textContent = `${appearance.panelBlur}px`;
}

function renderCategories() {
  els.categoryList.replaceChildren(
    ...categoriesForDisplay().map((category) => {
      const count = state.shortcuts.filter((shortcut) => shortcut.categoryId === category.id).length;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-button";
      button.dataset.categoryId = category.id;
      button.title = t(state.sortShortcutsByUsage ? "categoryUsageSortActiveHint" : "categoryDragHint");
      button.setAttribute("aria-current", String(category.id === state.activeCategoryId));
      button.innerHTML = `
        <span class="category-main">
          <span class="category-icon"></span>
          <span class="category-name"></span>
        </span>
        <span class="category-count"></span>
      `;
      paintCategoryIcon(button.querySelector(".category-icon"), category);
      button.querySelector(".category-name").textContent = displayCategoryName(category);
      button.querySelector(".category-count").textContent = count;
      return button;
    })
  );
}

function renderSearchEngineControls() {
  state.searchEngines = normalizeSearchEngines(state.searchEngines);
  const activeEngine = getActiveSearchEngine();
  els.searchEngineBtn.textContent = t("searchEngine");
  els.searchEngineBtn.dataset.engineId = activeEngine.id;
  els.searchEngineBtn.title = `${t("switchSearchEngine")}: ${searchEngineLabel(activeEngine)}`;
  renderSearchEngineList();
  if (!els.searchEngineId.value) resetSearchEngineForm(false);
}

function renderSearchEngineList() {
  const activeId = getActiveSearchEngine().id;
  els.searchEngineList.replaceChildren(
    ...state.searchEngines.map((engine) => createSearchEngineItem(engine, activeId))
  );
}

function createSearchEngineItem(engine, activeId) {
  const item = document.createElement("div");
  const isActive = engine.id === activeId;
  item.className = "search-engine-item";
  item.dataset.engineId = engine.id;
  item.setAttribute("role", "listitem");
  item.setAttribute("aria-current", String(isActive));

  const main = document.createElement("button");
  main.type = "button";
  main.className = "search-engine-main";
  main.dataset.engineAction = "activate";
  main.innerHTML = `
    <span class="search-engine-code"></span>
    <span class="search-engine-copy">
      <strong></strong>
      <small></small>
    </span>
    <span class="search-engine-state"></span>
  `;
  main.querySelector(".search-engine-code").textContent = engine.shortcut;
  main.querySelector("strong").textContent = engine.name;
  main.querySelector("small").textContent = engine.builtin ? t("builtinSearchEngine") : t("customSearchEngine");
  main.querySelector(".search-engine-state").textContent = isActive ? t("activeSearchEngine") : t("setSearchEngine");

  const actions = document.createElement("div");
  actions.className = "search-engine-actions";
  if (!engine.builtin) {
    actions.append(
      createSearchEngineActionButton("edit", t("edit")),
      createSearchEngineActionButton("delete", t("delete"))
    );
  }

  item.append(main, actions);
  return item;
}

function createSearchEngineActionButton(action, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = action === "delete" ? "danger-button compact-button" : "ghost-button compact-button";
  button.dataset.engineAction = action;
  button.textContent = label;
  return button;
}

function renderSearchPanel() {
  const query = els.searchInput.value.trim();
  const history = normalizeSearchHistory(state.searchHistory);
  const engineLabel = searchEngineLabel(getActiveSearchEngine());
  state.searchHistory = history;
  const items = query ? buildSearchSuggestions(query) : history.map((value) => ({
    value,
    label: looksLikeUrl(value) ? t("urlLabel") : engineLabel,
    kind: "history"
  }));

  els.searchPanelTitle.textContent = query ? t("relatedSearches") : t("searchHistory");
  els.searchSuggestionList.replaceChildren(
    ...(items.length ? items.map(createSearchSuggestionButton) : [createEmptySearchMessage(query)])
  );

  if (!state.showSearchHistory || (!items.length && !query)) {
    hideSearchHistoryPanel();
  }
}

function createSearchSuggestionButton(item) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.searchValue = item.value;
  button.dataset.searchKind = item.kind;
  button.innerHTML = `<span class="search-result-icon" aria-hidden="true"></span><span class="search-result-copy"></span><small></small>`;
  const icons = { history: "↺", site: "◫", category: "#", related: "⌕" };
  button.querySelector(".search-result-icon").textContent = icons[item.kind] || "⌕";
  button.querySelector(".search-result-copy").textContent = item.value;
  button.querySelector("small").textContent = item.label;
  return button;
}

function createEmptySearchMessage(query) {
  const message = document.createElement("p");
  message.className = "history-empty";
  message.textContent = query ? t("noRelatedSearches") : t("noSearchHistory");
  return message;
}

function buildSearchSuggestions(query) {
  const normalizedQuery = query.toLowerCase();
  const suggestions = [];
  const seen = new Set();
  const engineLabel = searchEngineLabel(getActiveSearchEngine());

  const addSuggestion = (value, label, kind = "related") => {
    const cleaned = String(value || "").trim();
    if (!cleaned) return;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    suggestions.push({ value: cleaned, label, kind });
  };

  normalizeSearchHistory(state.searchHistory)
    .filter((item) => item.toLowerCase().includes(normalizedQuery))
    .forEach((item) => addSuggestion(item, t("historyLabel"), "history"));

  state.shortcuts.forEach((shortcut) => {
    const host = readableHost(shortcut.url);
    const haystack = `${shortcut.title} ${host} ${shortcut.url}`.toLowerCase();
    if (!haystack.includes(normalizedQuery)) return;
    addSuggestion(shortcut.title, t("siteLabel"), "site");
    addSuggestion(host, t("urlLabel"), "site");
  });

  state.categories.forEach((category) => {
    const name = displayCategoryName(category);
    if (name.toLowerCase().includes(normalizedQuery)) {
      addSuggestion(name, t("clusterLabel"), "category");
    }
  });

  if (!looksLikeUrl(query)) {
    relatedKeywordSuffixes(query).forEach((item) => addSuggestion(item, engineLabel, "related"));
  }

  if (!suggestions.some((item) => item.value.toLowerCase() === normalizedQuery)) {
    addSuggestion(query, engineLabel, "related");
  }

  return suggestions.slice(0, SEARCH_SUGGESTION_LIMIT);
}

async function openFocusSearchDialog() {
  if (state.mode !== "runner") await setMode("runner");
  if (els.focusSearchDialog.open) {
    els.focusSearchInput.focus();
    return;
  }

  hideSearchHistoryPanel();
  focusSearchOpening = false;
  focusSearchMatches = [];
  focusSearchActiveIndex = -1;
  els.focusSearchInput.value = "";
  els.railHomeBtn.classList.remove("is-active");
  els.railSearchBtn.classList.add("is-active");
  renderFocusSearch({ resetSelection: true });
  els.focusSearchDialog.showModal();
  requestAnimationFrame(() => els.focusSearchInput.focus());
}

function onFocusSearchDialogClick(event) {
  if (isDialogBackdropClick(event, els.focusSearchDialog)) {
    els.focusSearchDialog.close();
  }
}

function onFocusSearchDialogClosed() {
  focusSearchOpening = false;
  focusSearchMatches = [];
  focusSearchActiveIndex = -1;
  els.focusSearchInput.value = "";
  els.focusSearchResults.replaceChildren();
  els.focusSearchInput.setAttribute("aria-expanded", "false");
  els.focusSearchInput.removeAttribute("aria-activedescendant");
  els.railSearchBtn.classList.remove("is-active");
  els.railHomeBtn.classList.add("is-active");
  requestAnimationFrame(() => els.railSearchBtn.focus());
}

function clearFocusSearch() {
  els.focusSearchInput.value = "";
  renderFocusSearch({ resetSelection: true });
  els.focusSearchInput.focus();
}

function renderFocusSearch({ resetSelection = false } = {}) {
  const query = els.focusSearchInput.value.trim();
  els.clearFocusSearchBtn.hidden = !query;

  if (!query) {
    focusSearchMatches = [];
    focusSearchActiveIndex = -1;
    els.focusSearchResults.replaceChildren();
    els.focusSearchResults.hidden = true;
    els.focusSearchStatus.hidden = false;
    els.focusSearchStatus.textContent = t("focusSearchGuidance");
    els.focusSearchInput.setAttribute("aria-expanded", "false");
    els.focusSearchInput.removeAttribute("aria-activedescendant");
    return;
  }

  focusSearchMatches = findSavedShortcuts(query);
  if (resetSelection) focusSearchActiveIndex = focusSearchMatches.length ? 0 : -1;
  if (focusSearchActiveIndex >= focusSearchMatches.length) {
    focusSearchActiveIndex = focusSearchMatches.length ? 0 : -1;
  }

  els.focusSearchResults.replaceChildren(
    ...focusSearchMatches.map((match, index) => createFocusSearchResult(match, index))
  );
  els.focusSearchResults.hidden = !focusSearchMatches.length;
  els.focusSearchStatus.hidden = Boolean(focusSearchMatches.length);
  els.focusSearchStatus.textContent = focusSearchMatches.length
    ? ""
    : hasValidSavedShortcuts()
      ? t("focusSearchNoMatches")
      : t("focusSearchNoSites");
  els.focusSearchInput.setAttribute("aria-expanded", String(Boolean(focusSearchMatches.length)));
  setFocusSearchActiveIndex(focusSearchActiveIndex, false);
}

function findSavedShortcuts(rawQuery) {
  const query = normalizeFinderText(rawQuery);
  if (!query) return [];

  const categoryOrder = new Map(orderedCategories().map((category, index) => [category.id, index]));
  const categoryById = new Map(state.categories.map((category) => [category.id, category]));

  return state.shortcuts
    .map((shortcut, manualIndex) => {
      const url = normalizeUrl(String(shortcut?.url || ""));
      if (!url) return null;

      const host = readableHost(url);
      const title = String(shortcut?.title || "").trim() || host;
      const category = categoryById.get(shortcut.categoryId);
      const categoryName = category ? displayCategoryName(category) : "";
      const rank = savedShortcutMatchRank(query, { title, host, url, categoryName });
      if (rank === null) return null;

      return {
        shortcutId: shortcut.id,
        shortcut: { ...shortcut, title, url },
        title,
        url,
        host,
        categoryName,
        rank,
        useCount: normalizeUseCount(shortcut.useCount),
        categoryOrder: categoryOrder.get(shortcut.categoryId) ?? Number.MAX_SAFE_INTEGER,
        manualIndex
      };
    })
    .filter(Boolean)
    .sort((left, right) => (
      left.rank - right.rank
      || (state.sortShortcutsByUsage ? right.useCount - left.useCount : 0)
      || left.categoryOrder - right.categoryOrder
      || left.manualIndex - right.manualIndex
    ));
}

function normalizeFinderText(value) {
  return String(value || "").trim().toLocaleLowerCase(state.locale === "en" ? "en" : "zh-CN");
}

function savedShortcutMatchRank(query, { title, host, url, categoryName }) {
  const normalizedTitle = normalizeFinderText(title);
  const normalizedHost = normalizeFinderText(host);
  const normalizedUrl = normalizeFinderText(url);
  const normalizedCategory = normalizeFinderText(categoryName);

  if (normalizedTitle === query) return 0;
  if (normalizedTitle.startsWith(query)) return 1;
  if (normalizedTitle.includes(query)) return 2;
  if (normalizedHost.includes(query)) return 3;
  if (normalizedUrl.includes(query) || normalizedCategory.includes(query)) return 4;
  return null;
}

function hasValidSavedShortcuts() {
  return state.shortcuts.some((shortcut) => normalizeUrl(String(shortcut?.url || "")));
}

function createFocusSearchResult(match, index) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "focus-search-result";
  button.id = `focus-search-result-${index}`;
  button.dataset.focusShortcutId = match.shortcutId;
  button.dataset.focusSearchIndex = String(index);
  button.setAttribute("role", "option");
  button.setAttribute("aria-selected", String(index === focusSearchActiveIndex));

  const icon = document.createElement("div");
  paintShortcutIcon(icon, match.shortcut);

  const copy = document.createElement("span");
  copy.className = "focus-search-result-copy";
  const title = document.createElement("strong");
  title.textContent = match.title;
  const host = document.createElement("span");
  host.textContent = match.host;
  copy.append(title, host);

  const category = document.createElement("small");
  category.className = "focus-search-category";
  category.textContent = match.categoryName;
  category.hidden = !match.categoryName;

  button.append(icon, copy, category);
  return button;
}

function setFocusSearchActiveIndex(index, shouldScroll = true) {
  const buttons = [...els.focusSearchResults.querySelectorAll("[data-focus-shortcut-id]")];
  if (!buttons.length || index < 0) {
    focusSearchActiveIndex = -1;
    els.focusSearchInput.removeAttribute("aria-activedescendant");
    return;
  }

  focusSearchActiveIndex = ((index % buttons.length) + buttons.length) % buttons.length;
  buttons.forEach((button, buttonIndex) => {
    const isActive = buttonIndex === focusSearchActiveIndex;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  const activeButton = buttons[focusSearchActiveIndex];
  els.focusSearchInput.setAttribute("aria-activedescendant", activeButton.id);
  if (shouldScroll) activeButton.scrollIntoView({ block: "nearest" });
}

function onFocusSearchInputKeydown(event) {
  if (event.key === "Escape") {
    event.preventDefault();
    els.focusSearchDialog.close();
    return;
  }

  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    if (!focusSearchMatches.length) return;
    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    setFocusSearchActiveIndex(focusSearchActiveIndex + direction);
    return;
  }

  if (event.key === "Enter" && focusSearchMatches.length) {
    event.preventDefault();
    const selected = focusSearchMatches[Math.max(0, focusSearchActiveIndex)];
    if (selected) activateFocusSearchShortcut(selected.shortcutId);
  }
}

function onFocusSearchResultPointerMove(event) {
  const button = event.target.closest("[data-focus-search-index]");
  if (!button) return;
  const index = Number(button.dataset.focusSearchIndex);
  if (Number.isInteger(index) && index !== focusSearchActiveIndex) {
    setFocusSearchActiveIndex(index, false);
  }
}

function onFocusSearchResultClick(event) {
  const button = event.target.closest("[data-focus-shortcut-id]");
  if (button) activateFocusSearchShortcut(button.dataset.focusShortcutId);
}

async function activateFocusSearchShortcut(shortcutId) {
  if (focusSearchOpening) return;
  const shortcut = state.shortcuts.find((item) => item.id === shortcutId);
  const url = normalizeUrl(String(shortcut?.url || ""));
  if (!shortcut || !url) {
    renderFocusSearch();
    return;
  }

  focusSearchOpening = true;
  try {
    await recordShortcutUse(shortcut.id);
  } catch (error) {
    console.warn("Unable to record Focus Search shortcut use", error);
  }
  window.location.href = url;
}

function relatedKeywordSuffixes(query) {
  const suffixes = t("relatedSuffixes").split("|");
  return suffixes.map((suffix) => `${query} ${suffix}`);
}

function renderShortcutSelect() {
  els.shortcutCategorySelect.replaceChildren(
    ...orderedCategories().map((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = displayCategoryName(category);
      return option;
    })
  );
}

function displayCategoryName(category) {
  const translation = categoryTranslations[category.id];
  if (!translation) return category.name;
  const defaultName = translation["zh-CN"];
  const englishName = translation.en;
  if (category.name !== defaultName && category.name !== englishName) return category.name;
  return translation[state.locale] || category.name;
}

function categoryIcon(category) {
  const translatedIcons = categoryIconTranslations[category.id];
  const normalizedIcon = normalizeCategoryIcon(category.icon);
  if (translatedIcons && Object.values(translatedIcons).includes(normalizedIcon)) {
    return translatedIcons[state.locale] || normalizedIcon;
  }
  return normalizedIcon || defaultCategoryIcons[category.id] || initials(displayCategoryName(category));
}

function paintCategoryIcon(container, category) {
  container.classList.toggle("has-image", Boolean(category.iconImage));
  container.replaceChildren();
  if (category.iconImage) {
    const img = document.createElement("img");
    img.alt = "";
    img.decoding = "async";
    prepareMonochromeIcon(img);
    img.addEventListener("error", () => {
      category.iconImage = "";
      paintCategoryIcon(container, category);
    });
    img.src = category.iconImage;
    container.append(img);
    return;
  }
  container.textContent = categoryIcon(category);
}

function normalizeCategoryIcon(value = "") {
  return [...String(value).trim()].slice(0, 4).join("");
}

function orderedCategories() {
  return [...state.categories].sort((a, b) => {
    const orderA = Number.isFinite(a.order) ? a.order : 0;
    const orderB = Number.isFinite(b.order) ? b.order : 0;
    return orderA - orderB || displayCategoryName(a).localeCompare(displayCategoryName(b));
  });
}

function categoriesForDisplay() {
  const categories = orderedCategories();
  if (!state.sortShortcutsByUsage) return categories;

  return categories.sort((a, b) => (
    normalizeUseCount(b.useCount) - normalizeUseCount(a.useCount)
    || a.order - b.order
  ));
}

function setCategoryOrder(categories) {
  categories.forEach((category, index) => {
    const target = state.categories.find((item) => item.id === category.id);
    if (target) target.order = index;
  });
}

function nextCategoryOrder() {
  return state.categories.reduce((max, category) => {
    const order = Number.isFinite(category.order) ? category.order : -1;
    return Math.max(max, order);
  }, -1) + 1;
}

function renderShortcuts() {
  const shortcuts = shortcutsForDisplay(state.activeCategoryId);
  els.emptyState.hidden = shortcuts.length > 0;
  els.shortcutGrid.replaceChildren(...shortcuts.map(createShortcutCard));
}

function renderClassicShortcuts() {
  els.classicShortcutGrid.replaceChildren(...shortcutsForDisplay().map(createClassicShortcut));
}

function createClassicShortcut(shortcut) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "classic-shortcut";
  button.addEventListener("click", async () => {
    await recordShortcutUse(shortcut.id);
    window.location.href = shortcut.url;
  });

  const icon = document.createElement("div");
  paintShortcutIcon(icon, shortcut);

  const label = document.createElement("span");
  label.textContent = shortcut.title;

  button.append(icon, label);
  return button;
}

function createShortcutCard(shortcut) {
  const card = document.createElement("article");
  card.className = "shortcut-card";
  card.dataset.openUrl = shortcut.url;
  card.dataset.shortcutId = shortcut.id;
  card.draggable = false;
  card.tabIndex = 0;
  card.setAttribute("role", "link");
  card.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      await recordShortcutUse(shortcut.id);
      window.location.href = shortcut.url;
    }
  });

  const icon = document.createElement("div");
  paintShortcutIcon(icon, shortcut);
  icon.title = t(state.sortShortcutsByUsage ? "shortcutUsageSortActiveHint" : "shortcutDragHint");

  const title = document.createElement("p");
  title.className = "shortcut-title";
  title.textContent = shortcut.title;

  const url = document.createElement("p");
  url.className = "shortcut-url";
  url.textContent = readableHost(shortcut.url);

  const edit = document.createElement("button");
  edit.type = "button";
  edit.className = "shortcut-edit";
  edit.dataset.editShortcut = shortcut.id;
  edit.title = t("edit");
  edit.textContent = "...";

  card.append(icon, title, url, edit);
  return card;
}

function initials(title) {
  const compact = title.trim();
  if (!compact) return "+";
  const asciiWords = compact.match(/[a-z0-9]+/gi);
  if (asciiWords?.length >= 2) {
    return `${asciiWords[0][0]}${asciiWords[1][0]}`.toUpperCase();
  }
  if (asciiWords?.length === 1) {
    return asciiWords[0].slice(0, 2).toUpperCase();
  }
  return compact.slice(0, 2);
}

function paintShortcutIcon(container, shortcut) {
  const fallback = document.createElement("span");
  fallback.textContent = initials(shortcut.title);

  const candidates = iconCandidates(shortcut.url, shortcut.iconUrl);
  const baseClass = container.id === "shortcutIconPreview" ? "shortcut-icon preview-icon" : "shortcut-icon";
  container.className = candidates.length ? baseClass : `${baseClass} icon-fallback`;
  container.style.background = shortcut.color || "#62d5ff";
  container.draggable = false;

  if (!candidates.length) {
    container.replaceChildren(fallback);
    return;
  }

  const img = document.createElement("img");
  img.alt = "";
  img.decoding = "async";
  img.loading = "lazy";
  img.draggable = false;
  img.referrerPolicy = "no-referrer";
  img.dataset.candidateIndex = "0";
  prepareMonochromeIcon(img);
  img.addEventListener("error", () => {
    const nextIndex = Number(img.dataset.candidateIndex) + 1;
    if (nextIndex < candidates.length) {
      img.dataset.candidateIndex = String(nextIndex);
      clearMonochromeIconClass(img);
      img.src = candidates[nextIndex];
      return;
    }
    container.classList.add("icon-fallback");
  });
  img.src = candidates[0];

  container.replaceChildren(img, fallback);
}

const monochromeIconClasses = [
  "icon-silhouette-alpha",
  "icon-silhouette-opaque-dark",
  "icon-silhouette-opaque-light",
  "icon-silhouette-fallback"
];

function clearMonochromeIconClass(img) {
  img.classList.remove(...monochromeIconClasses);
  delete img.dataset.silhouetteSource;
}

function prepareMonochromeIcon(img) {
  img.addEventListener("load", () => {
    if (document.documentElement.dataset.theme === "minimal") {
      classifyMonochromeIcon(img);
    }
  });
}

function classifyRenderedMonochromeIcons() {
  document.querySelectorAll(".shortcut-icon img, .category-icon img").forEach((img) => {
    if (img.complete && img.naturalWidth > 0) classifyMonochromeIcon(img);
  });
}

function classifyMonochromeIcon(img) {
  const source = img.currentSrc || img.src;
  if (
    img.dataset.silhouetteSource === source
    && monochromeIconClasses.some((className) => img.classList.contains(className))
  ) {
    return;
  }

  clearMonochromeIconClass(img);
  try {
    const size = 32;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Canvas unavailable");
    context.drawImage(img, 0, 0, size, size);
    const pixels = context.getImageData(0, 0, size, size).data;
    img.classList.add(`icon-silhouette-${classifyIconPixels(pixels, size, size)}`);
  } catch {
    img.classList.add("icon-silhouette-fallback");
  }
  img.dataset.silhouetteSource = source;
}

function classifyIconPixels(pixels, width, height) {
  const pixelCount = Math.max(1, width * height);
  let transparentPixels = 0;

  for (let index = 3; index < pixels.length; index += 4) {
    if (pixels[index] < 245) transparentPixels += 1;
  }

  if (transparentPixels / pixelCount >= 0.15) return "alpha";

  const patchWidth = Math.max(1, Math.floor(width * 0.2));
  const patchHeight = Math.max(1, Math.floor(height * 0.2));
  const cornerStarts = [
    [0, 0],
    [width - patchWidth, 0],
    [0, height - patchHeight],
    [width - patchWidth, height - patchHeight]
  ];
  let luminanceTotal = 0;
  let sampleCount = 0;

  cornerStarts.forEach(([startX, startY]) => {
    for (let y = startY; y < startY + patchHeight; y += 1) {
      for (let x = startX; x < startX + patchWidth; x += 1) {
        const index = (y * width + x) * 4;
        if (pixels[index + 3] >= 245) {
          luminanceTotal += pixels[index] * 0.2126 + pixels[index + 1] * 0.7152 + pixels[index + 2] * 0.0722;
          sampleCount += 1;
        }
      }
    }
  });

  if (!sampleCount) {
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index + 3] < 245) continue;
      luminanceTotal += pixels[index] * 0.2126 + pixels[index + 1] * 0.7152 + pixels[index + 2] * 0.0722;
      sampleCount += 1;
    }
  }

  return luminanceTotal / Math.max(1, sampleCount) >= 150 ? "opaque-light" : "opaque-dark";
}

function iconCandidates(url, savedIconUrl = "") {
  const normalized = normalizeUrl(url, false);
  if (!normalized) return [];

  const candidates = [
    chromeFaviconUrl(normalized),
    savedIconUrl
  ].filter(Boolean);

  return [...new Set(candidates)];
}

function chromeFaviconUrl(url) {
  if (!globalThis.chrome?.runtime?.getURL) return "";
  const favicon = new URL(chrome.runtime.getURL("/_favicon/"));
  favicon.searchParams.set("pageUrl", url);
  favicon.searchParams.set("size", "64");
  return favicon.toString();
}

function readableHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getActiveCategory() {
  return state.categories.find((category) => category.id === state.activeCategoryId) || state.categories[0];
}

function getActiveSearchEngine() {
  return state.searchEngines.find((engine) => engine.id === state.activeSearchEngineId)
    || state.searchEngines.find((engine) => engine.id === "google")
    || defaultSearchEngines[0];
}

function searchEngineLabel(engine) {
  return engine?.name || t("googleLabel");
}

function openSearchEngineDialog() {
  renderSearchEngineControls();
  els.searchEngineDialog.showModal();
}

async function onSearchEngineListClick(event) {
  const button = event.target.closest("[data-engine-action]");
  if (!button) return;
  const item = button.closest("[data-engine-id]");
  const engineId = item?.dataset.engineId;
  if (!engineId) return;

  const action = button.dataset.engineAction;
  if (action === "activate") {
    state.activeSearchEngineId = engineId;
    await writeData();
    renderSearchEngineControls();
    renderSearchPanel();
    return;
  }

  if (action === "edit") {
    openSearchEngineForm(state.searchEngines.find((engine) => engine.id === engineId));
    return;
  }

  if (action === "delete") {
    await deleteSearchEngine(engineId);
  }
}

function openSearchEngineForm(engine) {
  clearError(els.searchEngineError);
  if (!engine || engine.builtin) {
    resetSearchEngineForm();
    return;
  }
  els.searchEngineFormTitle.textContent = t("editSearchEngine");
  els.searchEngineId.value = engine.id;
  els.searchEngineNameInput.value = engine.name;
  els.searchEngineShortcutInput.value = engine.shortcut;
  els.searchEngineUrlInput.value = engine.searchUrl;
  els.deleteSearchEngineBtn.hidden = false;
  els.searchEngineNameInput.focus();
}

function resetSearchEngineForm(shouldFocus = true) {
  clearError(els.searchEngineError);
  els.searchEngineFormTitle.textContent = t("addSearchEngine");
  els.searchEngineId.value = "";
  els.searchEngineNameInput.value = "";
  els.searchEngineShortcutInput.value = "";
  els.searchEngineUrlInput.value = "";
  els.deleteSearchEngineBtn.hidden = true;
  if (shouldFocus) els.searchEngineNameInput.focus();
}

async function onSearchEngineSubmit(event) {
  event.preventDefault();
  const id = els.searchEngineId.value;
  const name = normalizeSearchEngineName(els.searchEngineNameInput.value);
  const shortcut = normalizeSearchEngineShortcut(els.searchEngineShortcutInput.value || name);
  const searchUrl = normalizeSearchEngineTemplate(els.searchEngineUrlInput.value);
  if (!name || !searchUrl) {
    showError(els.searchEngineError, t("invalidSearchEngine"));
    return;
  }

  if (id) {
    const engine = state.searchEngines.find((item) => item.id === id && !item.builtin);
    if (engine) Object.assign(engine, { name, shortcut, searchUrl });
  } else {
    const engine = {
      id: uniqueSearchEngineId(createId(name), state.searchEngines),
      name,
      shortcut,
      searchUrl,
      builtin: false
    };
    state.searchEngines.push(engine);
    state.activeSearchEngineId = engine.id;
  }

  state.searchEngines = normalizeSearchEngines(state.searchEngines);
  await writeData();
  resetSearchEngineForm(false);
  renderSearchEngineControls();
  renderSearchPanel();
}

async function deleteEditingSearchEngine() {
  const id = els.searchEngineId.value;
  if (!id) return;
  await deleteSearchEngine(id);
  resetSearchEngineForm(false);
}

async function deleteSearchEngine(engineId) {
  const engine = state.searchEngines.find((item) => item.id === engineId && !item.builtin);
  if (!engine) return;
  if (!await openConfirmDialog(t("deleteSearchEngineConfirm", { name: engine.name }))) return;
  state.searchEngines = state.searchEngines.filter((item) => item.id !== engineId);
  if (state.activeSearchEngineId === engineId) {
    state.activeSearchEngineId = "google";
  }
  await writeData();
  renderSearchEngineControls();
  renderSearchPanel();
}

function openPresetImportDialog() {
  els.appearancePresetFileInput.value = "";
  els.appearancePresetFileInput.click();
}

function exportAppearancePresets() {
  const currentAppearance = normalizeAppearance(state.appearance);
  const presets = state.appearancePresets.length
    ? state.appearancePresets.map((preset) => clone(preset))
    : [{
      id: "exported-current",
      name: t("activePreset"),
      appearance: compactAppearanceSnapshot(currentAppearance),
      locale: state.locale,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }];
  const envelope = {
    type: APPEARANCE_PRESET_IMPORT_TYPE,
    version: APPEARANCE_PRESET_IMPORT_VERSION,
    exportedAt: new Date().toISOString(),
    locale: state.locale,
    activePresetId: state.activeAppearancePresetId,
    presets,
    backgrounds: currentAppearance.customBackgroundImages.map((background) => clone(background))
  };
  downloadJsonFile(`runner-appearance-presets-${dateStamp()}.json`, envelope);
  showToast(t("presetsExported"));
}

function exportCompleteData() {
  const envelope = {
    type: DATA_BACKUP_TYPE,
    version: DATA_BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      ...clone(state),
      schemaVersion: 2
    }
  };
  downloadJsonFile(`runner-shortcut-hub-backup-${dateStamp()}.json`, envelope);
  showToast(t("dataExported"));
}

async function onDataBackupFileChange(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  try {
    const parsed = await readDataBackupFile(file);
    const candidate = validateAndNormalizeDataBackup(parsed);
    const approved = await openConfirmDialog(t("dataImportConfirm"));
    if (!approved) return;
    await writeDataSnapshot(candidate);
    state = candidate;
    render();
    writeUiPreferences(state);
    showToast(t("dataImported"));
  } catch (error) {
    showToast(t(error?.messageKey || "importFailed"), "error");
  }
}

async function readDataBackupFile(file) {
  const isJsonFile = file.type === "application/json" || file.name.toLowerCase().endsWith(".json");
  if (!isJsonFile || !file.size) throw presetImportError("invalidDataBackup");
  if (file.size > DATA_BACKUP_MAX_BYTES) throw presetImportError("dataBackupTooLarge");
  let text;
  try {
    text = await file.text();
  } catch {
    throw presetImportError("presetReadFailed");
  }
  if (!text.trim()) throw presetImportError("invalidDataBackup");
  try {
    return JSON.parse(text);
  } catch {
    throw presetImportError("invalidDataBackup");
  }
}

function validateAndNormalizeDataBackup(envelope) {
  if (!isPlainObject(envelope) || envelope.type !== DATA_BACKUP_TYPE) {
    throw presetImportError("invalidDataBackup");
  }
  if (Number(envelope.version) !== DATA_BACKUP_VERSION) {
    throw presetImportError("unsupportedPresetVersion");
  }
  if (!isPlainObject(envelope.data)
    || !Array.isArray(envelope.data.categories)
    || !envelope.data.categories.length
    || !Array.isArray(envelope.data.shortcuts)) {
    throw presetImportError("invalidDataBackup");
  }
  const candidate = normalizeState(clone(envelope.data));
  candidate.schemaVersion = 2;
  return candidate;
}

function downloadJsonFile(filename, value) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}

async function onPresetImportFileChange(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  try {
    const parsed = await readPresetFile(file);
    const migrated = migrateImportedPreset(parsed);
    validateImportedPreset(migrated);
    const sanitized = sanitizeImportedPreset(migrated);
    const result = await importPreset(sanitized);
    showPresetImportSuccess(result);
  } catch (error) {
    showPresetImportError(error?.messageKey || "importFailed");
  }
}

async function readPresetFile(file) {
  const isJsonFile = file.type === "application/json" || file.name.toLowerCase().endsWith(".json");
  if (!isJsonFile) throw presetImportError("invalidPresetFile");
  if (!file.size) throw presetImportError("presetFileEmpty");
  if (file.size > APPEARANCE_PRESET_IMPORT_MAX_BYTES) throw presetImportError("presetFileTooLarge");

  let text;
  try {
    text = await file.text();
  } catch {
    throw presetImportError("presetReadFailed");
  }
  if (!text.trim()) throw presetImportError("presetFileEmpty");

  try {
    return JSON.parse(text);
  } catch {
    throw presetImportError("invalidPresetFile");
  }
}

function migrateImportedPreset(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw presetImportError("invalidPresetFile");
  }

  if (data.type === APPEARANCE_PRESET_IMPORT_TYPE) {
    if (!Object.prototype.hasOwnProperty.call(data, "version")) {
      throw presetImportError("invalidPresetFile");
    }
    if (Number(data.version) !== APPEARANCE_PRESET_IMPORT_VERSION) {
      throw presetImportError("unsupportedPresetVersion");
    }
    const presets = Array.isArray(data.presets) ? data.presets : (data.preset ? [data.preset] : []);
    return createMigratedPresetEnvelope(data, presets, data.activePresetId || data.activeAppearancePresetId);
  }

  if (data.format === "runner-shortcut-hub-appearance-backup") {
    if (!Object.prototype.hasOwnProperty.call(data, "formatVersion")) {
      throw presetImportError("invalidPresetFile");
    }
    if (Number(data.formatVersion) !== APPEARANCE_PRESET_IMPORT_VERSION) {
      throw presetImportError("unsupportedPresetVersion");
    }
    let presets = Array.isArray(data.appearancePresets) ? data.appearancePresets : [];
    if (!presets.length && isPlainObject(data.appearance)) {
      presets = [{
        id: "imported-current",
        name: data.presetName || "Imported Preset",
        appearance: data.appearance
      }];
    }
    return createMigratedPresetEnvelope(data, presets, data.activeAppearancePresetId);
  }

  throw presetImportError("invalidPresetFile");
}

function createMigratedPresetEnvelope(source, presets, activePresetId) {
  const backgrounds = [];
  const addBackgrounds = (items) => {
    if (Array.isArray(items)) backgrounds.push(...items);
  };
  addBackgrounds(source.backgrounds);
  addBackgrounds(source.backgroundFiles);
  addBackgrounds(source.appearance?.customBackgroundImages);
  presets.forEach((preset) => addBackgrounds(preset?.appearance?.customBackgroundImages));

  return {
    type: APPEARANCE_PRESET_IMPORT_TYPE,
    version: APPEARANCE_PRESET_IMPORT_VERSION,
    locale: source.locale,
    activePresetId: String(activePresetId || ""),
    presets,
    backgrounds
  };
}

function validateImportedPreset(data) {
  if (data.type !== APPEARANCE_PRESET_IMPORT_TYPE || data.version !== APPEARANCE_PRESET_IMPORT_VERSION) {
    throw presetImportError("invalidPresetFile");
  }
  if (!Array.isArray(data.presets) || !data.presets.length || data.presets.length > 500) {
    throw presetImportError("invalidPresetFile");
  }

  data.presets.forEach((preset) => {
    const name = typeof preset?.name === "string" ? preset.name.trim() : "";
    const appearance = preset?.appearance;
    const hasAppearanceField = isPlainObject(appearance)
      && Object.keys(appearance).some((key) => IMPORTED_APPEARANCE_FIELDS.has(key));
    if (!name || !hasAppearanceField) throw presetImportError("invalidPresetFile");
  });
}

function sanitizeImportedPreset(data) {
  return {
    activePresetId: String(data.activePresetId || "").slice(0, 120),
    presets: data.presets.map((preset) => ({
      sourceId: String(preset.id || "").slice(0, 120),
      name: String(preset.name).trim().slice(0, 40),
      appearance: sanitizeImportedAppearanceFields(preset.appearance),
      locale: normalizeLocale(preset.locale || preset.appearance?.locale || data.locale, state.locale),
      createdAt: normalizeTimestamp(preset.createdAt),
      updatedAt: normalizeTimestamp(preset.updatedAt)
    })),
    backgrounds: (Array.isArray(data.backgrounds) ? data.backgrounds : [])
      .filter((item) => typeof item === "string" || isPlainObject(item))
      .slice(0, 100)
  };
}

function sanitizeImportedAppearanceFields(appearance) {
  const sanitized = {};
  IMPORTED_APPEARANCE_FIELDS.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(appearance, field)) sanitized[field] = appearance[field];
  });
  return sanitized;
}

async function importPreset(importedData) {
  const currentAppearance = normalizeAppearance(state.appearance);
  const candidateBackgrounds = currentAppearance.customBackgroundImages.map((item) => ({ ...item }));
  const backgroundIdMap = new Map();

  importedData.backgrounds.forEach((background, index) => {
    const source = typeof background === "string" ? { image: background } : background;
    const sourceId = sanitizeCustomBackgroundId(source.id || source.storageKey || `imported-bg-${index + 1}`);
    const storedId = sanitizeCustomBackgroundId(source.storageKey || source.internalStorageKey || "");
    const existingByReference = candidateBackgrounds.find((item) => item.id === storedId || item.id === sourceId);
    const image = extractImportedBackgroundImage(source);

    if (!image) {
      if (existingByReference && sourceId) backgroundIdMap.set(sourceId, existingByReference.id);
      return;
    }

    const existingByImage = candidateBackgrounds.find((item) => item.image === image);
    if (existingByImage) {
      if (sourceId) backgroundIdMap.set(sourceId, existingByImage.id);
      return;
    }

    const importedBackground = normalizeCustomBackgroundItem({
      id: sourceId || `imported-bg-${index + 1}`,
      name: source.name || `Imported ${index + 1}`,
      image,
      accentColor: source.accentColor
    }, candidateBackgrounds.length, candidateBackgrounds);
    if (!importedBackground) return;
    candidateBackgrounds.push(importedBackground);
    if (sourceId) backgroundIdMap.set(sourceId, importedBackground.id);
  });

  const existingPresets = state.appearancePresets.map((preset) => clone(preset));
  const importedPresets = [];
  const presetIdMap = new Map();
  let wallpaperMissing = false;

  importedData.presets.forEach((preset, index) => {
    const importedAppearance = buildImportedAppearance(
      preset.appearance,
      currentAppearance,
      candidateBackgrounds,
      backgroundIdMap
    );
    wallpaperMissing ||= importedAppearance.wallpaperMissing;
    const name = uniqueImportedPresetName(preset.name, existingPresets.concat(importedPresets));
    const id = uniqueAppearancePresetId(
      createId(`imported-${preset.sourceId || name || index + 1}`),
      existingPresets.concat(importedPresets)
    );
    const now = Date.now();
    importedPresets.push({
      id,
      name,
      appearance: importedAppearance.appearance,
      locale: preset.locale,
      createdAt: preset.createdAt || now,
      updatedAt: preset.updatedAt || now
    });
    if (preset.sourceId) presetIdMap.set(preset.sourceId, id);
  });

  const candidate = clone(state);
  candidate.appearance = {
    ...currentAppearance,
    customBackgroundImages: candidateBackgrounds
  };
  candidate.appearancePresets = existingPresets.concat(importedPresets);
  const applyPresetId = presetIdMap.get(importedData.activePresetId) || importedPresets[0]?.id || "";

  try {
    await writeDataSnapshot(candidate);
  } catch {
    throw presetImportError("storageWriteFailed");
  }

  state = candidate;
  renderCustomizerControls();
  return { count: importedPresets.length, applyPresetId, wallpaperMissing };
}

function buildImportedAppearance(rawAppearance, currentAppearance, customBackgroundImages, backgroundIdMap) {
  const availableBackgroundIds = new Set(backgroundPresets.map((item) => item.id).concat("custom"));
  const sourceCustomId = sanitizeCustomBackgroundId(rawAppearance.activeCustomBackgroundId);
  const mappedCustomId = backgroundIdMap.get(sourceCustomId)
    || customBackgroundImages.find((item) => item.id === sourceCustomId)?.id
    || "";
  const candidate = {
    designTheme: designThemes.some((item) => item.id === rawAppearance.designTheme)
      ? rawAppearance.designTheme
      : currentAppearance.designTheme,
    theme: appearanceModes.some((item) => item.id === rawAppearance.theme) ? rawAppearance.theme : currentAppearance.theme,
    background: availableBackgroundIds.has(rawAppearance.background) ? rawAppearance.background : currentAppearance.background,
    activeCustomBackgroundId: mappedCustomId,
    accentColor: normalizeHexColor(rawAppearance.accentColor) || currentAppearance.accentColor,
    backgroundOpacity: clampNumber(rawAppearance.backgroundOpacity, 0.15, 1, currentAppearance.backgroundOpacity),
    backgroundBlur: Math.round(clampNumber(rawAppearance.backgroundBlur, 0, 28, currentAppearance.backgroundBlur)),
    panelOpacity: clampNumber(rawAppearance.panelOpacity, 0.1, 1, currentAppearance.panelOpacity),
    panelBlur: Math.round(clampNumber(rawAppearance.panelBlur, 0, 36, currentAppearance.panelBlur)),
    iconRadius: rawAppearance.iconRadius ?? currentAppearance.iconRadius,
    iconRadiusUnit: rawAppearance.iconRadiusUnit || currentAppearance.iconRadiusUnit,
    cardRadius: rawAppearance.cardRadius ?? currentAppearance.cardRadius,
    panelRadius: rawAppearance.panelRadius ?? currentAppearance.panelRadius,
    buttonRadius: rawAppearance.buttonRadius ?? currentAppearance.buttonRadius,
    cornerAccentsEnabled: rawAppearance.cornerAccentsEnabled === true,
    fontScale: rawAppearance.fontScale ?? currentAppearance.fontScale,
    cardDensity: rawAppearance.cardDensity || currentAppearance.cardDensity,
    customBackgroundImages
  };
  let wallpaperMissing = false;

  if (candidate.background === "custom" && !candidate.activeCustomBackgroundId) {
    wallpaperMissing = true;
    if (currentAppearance.background === "custom" && currentAppearance.activeCustomBackgroundId) {
      candidate.activeCustomBackgroundId = currentAppearance.activeCustomBackgroundId;
    } else {
      candidate.background = "plain";
    }
  }

  return {
    appearance: compactAppearanceSnapshot(normalizeAppearance(candidate)),
    wallpaperMissing
  };
}

function extractImportedBackgroundImage(background) {
  const direct = [background.image, background.dataUrl, background.data]
    .find((value) => typeof value === "string" && value.startsWith("data:"));
  if (direct) return validateImportedImageDataUrl(direct);

  const blob = isPlainObject(background.blob) ? background.blob : {};
  const mimeType = String(background.mimeType || background.type || blob.mimeType || blob.type || "").toLowerCase();
  const base64 = typeof background.base64 === "string"
    ? background.base64
    : (typeof background.data === "string"
      ? background.data
      : (typeof blob.base64 === "string" ? blob.base64 : (typeof blob.data === "string" ? blob.data : "")));
  if (!IMPORTED_WALLPAPER_MIME_TYPES.has(mimeType) || !base64) return "";
  return validateImportedImageDataUrl(`data:${mimeType};base64,${base64}`);
}

function validateImportedImageDataUrl(value) {
  const match = String(value || "").trim().match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([a-z0-9+/=\s]+)$/i);
  if (!match || !IMPORTED_WALLPAPER_MIME_TYPES.has(match[1].toLowerCase())) return "";
  const base64 = match[2].replace(/\s+/g, "");
  if (!base64) return "";
  try {
    atob(base64);
  } catch {
    return "";
  }
  return `data:${match[1].toLowerCase()};base64,${base64}`;
}

function uniqueImportedPresetName(name, presets) {
  const original = String(name || "").trim().slice(0, 40);
  const used = new Set(presets.map((preset) => preset.name.toLocaleLowerCase()));
  if (!used.has(original.toLocaleLowerCase())) return original;

  let index = 1;
  while (index < 10000) {
    const suffix = index === 1 ? " (Imported)" : ` (Imported ${index})`;
    const candidate = `${original.slice(0, Math.max(1, 40 - suffix.length))}${suffix}`;
    if (!used.has(candidate.toLocaleLowerCase())) return candidate;
    index += 1;
  }
  return `${original.slice(0, 24)} (${Date.now()})`.slice(0, 40);
}

function showPresetImportSuccess(result) {
  pendingImportedPresetId = result.applyPresetId;
  presetImportResultState = {
    kind: "success",
    count: result.count,
    wallpaperMissing: Boolean(result.wallpaperMissing)
  };
  renderPresetImportResult();
  openPresetImportResultDialog();
}

function showPresetImportError(messageKey) {
  pendingImportedPresetId = "";
  presetImportResultState = { kind: "error", messageKey };
  renderPresetImportResult();
  openPresetImportResultDialog();
}

function renderPresetImportResult() {
  if (!presetImportResultState) return;
  const isSuccess = presetImportResultState.kind === "success";
  els.presetImportResultTitle.textContent = t(isSuccess ? "importSuccessful" : "importFailed");
  els.presetImportResultMessage.textContent = isSuccess
    ? t("importedPresetCount", { count: presetImportResultState.count })
    : t(presetImportResultState.messageKey);
  const wallpaperMissing = isSuccess && presetImportResultState.wallpaperMissing;
  els.presetImportResultWarning.textContent = wallpaperMissing ? t("customWallpaperMissing") : "";
  els.presetImportResultWarning.hidden = !wallpaperMissing;
  els.keepCurrentAppearanceBtn.hidden = !isSuccess;
  els.applyImportedPresetBtn.hidden = !isSuccess || !pendingImportedPresetId;
  els.dismissPresetImportResultBtn.hidden = isSuccess;
}

function openPresetImportResultDialog() {
  if (!els.presetImportResultDialog.open) els.presetImportResultDialog.showModal();
}

function closePresetImportResultDialog() {
  pendingImportedPresetId = "";
  presetImportResultState = null;
  if (els.presetImportResultDialog.open) els.presetImportResultDialog.close();
}

async function applyPendingImportedPreset() {
  const presetId = pendingImportedPresetId;
  if (!presetId) return;
  try {
    await applyAppearancePreset(presetId);
    closePresetImportResultDialog();
  } catch {
    showPresetImportError("storageWriteFailed");
  }
}

function presetImportError(messageKey) {
  const error = new Error(messageKey);
  error.messageKey = messageKey;
  return error;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

async function saveCurrentAppearancePreset() {
  const defaultName = t("defaultPresetName", { number: state.appearancePresets.length + 1 });
  const nameInput = await openTextPrompt(t("presetNamePrompt"), defaultName);
  if (nameInput === null) return;

  const preset = createAppearancePreset(normalizeAppearancePresetName(nameInput, state.appearancePresets.length));
  state.appearancePresets = normalizeAppearancePresets(
    state.appearancePresets.concat(preset),
    normalizeAppearance(state.appearance).customBackgroundImages,
    state.locale
  );
  state.activeAppearancePresetId = preset.id;
  await writeData();
  renderCustomizerControls();
}

function createAppearancePreset(name) {
  const now = Date.now();
  return {
    id: uniqueAppearancePresetId(createId(name || "appearance-preset"), state.appearancePresets),
    name,
    appearance: snapshotCurrentAppearance(),
    locale: state.locale,
    createdAt: now,
    updatedAt: now
  };
}

async function updateActiveAppearancePreset() {
  const preset = state.appearancePresets.find((item) => item.id === state.activeAppearancePresetId);
  if (!preset) {
    await saveCurrentAppearancePreset();
    return;
  }

  preset.appearance = snapshotCurrentAppearance();
  preset.locale = state.locale;
  preset.updatedAt = Date.now();
  state.appearancePresets = normalizeAppearancePresets(
    state.appearancePresets,
    normalizeAppearance(state.appearance).customBackgroundImages,
    state.locale
  );
  await writeData();
  renderCustomizerControls();
}

async function onAppearancePresetListClick(event) {
  const actionButton = event.target.closest("[data-preset-action]");
  if (!actionButton) return;
  const item = actionButton.closest("[data-preset-id]");
  const presetId = item?.dataset.presetId;
  if (!presetId) return;

  const action = actionButton.dataset.presetAction;
  if (action === "apply") {
    await applyAppearancePreset(presetId);
    return;
  }
  if (action === "rename") {
    await renameAppearancePreset(presetId);
    return;
  }
  if (action === "delete") {
    await deleteAppearancePreset(presetId);
  }
}

async function applyAppearancePreset(presetId) {
  const preset = state.appearancePresets.find((item) => item.id === presetId);
  if (!preset) return;
  const currentAppearance = normalizeAppearance(state.appearance);
  const candidate = clone(state);
  candidate.appearance = normalizeAppearance({
    ...currentAppearance,
    ...preset.appearance,
    customBackgroundImages: currentAppearance.customBackgroundImages
  });
  candidate.locale = normalizeLocale(preset.locale, candidate.locale);
  candidate.activeAppearancePresetId = preset.id;
  await writeDataSnapshot(candidate);
  state = candidate;
  render();
}

async function renameAppearancePreset(presetId) {
  const preset = state.appearancePresets.find((item) => item.id === presetId);
  if (!preset) return;
  const nameInput = await openTextPrompt(t("presetNamePrompt"), preset.name);
  if (nameInput === null) return;
  preset.name = normalizeAppearancePresetName(nameInput, state.appearancePresets.indexOf(preset));
  preset.updatedAt = Date.now();
  await writeData();
  renderCustomizerControls();
}

async function deleteAppearancePreset(presetId) {
  const preset = state.appearancePresets.find((item) => item.id === presetId);
  if (!preset) return;
  if (!await openConfirmDialog(t("deletePresetConfirm", { name: preset.name }))) return;

  state.appearancePresets = state.appearancePresets.filter((item) => item.id !== presetId);
  if (state.activeAppearancePresetId === presetId) {
    state.activeAppearancePresetId = "";
  }
  await writeData();
  renderCustomizerControls();
}

async function onDesignThemeOptionClick(event) {
  const button = event.target.closest("[data-design-theme]");
  if (!button || button.dataset.designTheme === state.appearance.designTheme) return;
  state.appearance.designTheme = button.dataset.designTheme;
  applyAppearance();
  renderDesignThemeOptions();
  await writeData();
}

async function onAppearanceOptionClick(event) {
  const button = event.target.closest("[data-theme]");
  if (!button) return;
  state.appearance.theme = button.dataset.theme;
  await writeData();
  render();
}

async function onLanguageOptionClick(event) {
  const button = event.target.closest("[data-locale]");
  if (!button) return;
  await setLocale(button.dataset.locale);
}

async function setLocale(locale) {
  const normalized = normalizeLocale(locale, state.locale);
  if (normalized === state.locale) return;
  state.locale = normalized;
  await writeData();
  render();
}

async function onThemeColorOptionClick(event) {
  const button = event.target.closest("[data-accent-color]");
  if (!button) return;
  await setAccentColor(button.dataset.accentColor);
}

async function onThemeColorInput(event) {
  await setAccentColor(event.target.value);
}

async function setAccentColor(color) {
  const accentColor = normalizeHexColor(color);
  if (!accentColor) return;
  state.appearance.accentColor = accentColor;
  applyAppearance();
  renderThemeColorOptions();
  await writeData();
}

async function onBackgroundOptionClick(event) {
  const button = event.target.closest("[data-background]");
  if (!button) return;
  state.appearance.background = button.dataset.background;
  if (button.dataset.background === "custom") {
    const appearance = normalizeAppearance(state.appearance);
    const customBackgroundId = button.dataset.customBackgroundId || appearance.activeCustomBackgroundId;
    state.appearance.activeCustomBackgroundId = customBackgroundId;
    const customBackground = appearance.customBackgroundImages.find((background) => background.id === customBackgroundId);
    applyCustomBackgroundAccent(customBackground);
  }
  await writeData();
  render();
}

async function onBackgroundOpacityInput(event) {
  state.appearance.backgroundOpacity = clampNumber(Number(event.target.value) / 100, 0.15, 1, 1);
  applyAppearance();
  renderBackgroundTuningControls();
  await writeData();
}

async function onBackgroundBlurInput(event) {
  state.appearance.backgroundBlur = Math.round(clampNumber(event.target.value, 0, 28, 0));
  applyAppearance();
  renderBackgroundTuningControls();
  await writeData();
}

async function onPanelOpacityInput(event) {
  state.appearance.panelOpacity = clampNumber(Number(event.target.value) / 100, 0.1, 1, defaultData.appearance.panelOpacity);
  applyAppearance();
  renderBackgroundTuningControls();
  await writeData();
}

async function onPanelBlurInput(event) {
  state.appearance.panelBlur = Math.round(clampNumber(event.target.value, 0, 36, defaultData.appearance.panelBlur));
  applyAppearance();
  renderBackgroundTuningControls();
  await writeData();
}

async function onIconRadiusInput(event) {
  const sliderValue = Math.round(clampNumber(event.target.value, 0, 25, defaultData.appearance.iconRadius));
  if (sliderValue === 25) {
    state.appearance.iconRadius = 50;
    state.appearance.iconRadiusUnit = "percent";
  } else {
    state.appearance.iconRadius = sliderValue;
    state.appearance.iconRadiusUnit = "px";
  }
  await previewAndPersistShapeSettings();
}

async function onIconRadiusQuickOptionClick(event) {
  const button = event.target.closest("[data-radius-value]");
  if (!button) return;
  state.appearance.iconRadius = Number(button.dataset.radiusValue);
  state.appearance.iconRadiusUnit = button.dataset.radiusUnit === "percent" ? "percent" : "px";
  await previewAndPersistShapeSettings();
}

async function onCardRadiusInput(event) {
  state.appearance.cardRadius = Math.round(clampNumber(event.target.value, 0, 24, defaultData.appearance.cardRadius));
  await previewAndPersistShapeSettings();
}

async function onPanelRadiusInput(event) {
  state.appearance.panelRadius = Math.round(clampNumber(event.target.value, 0, 24, defaultData.appearance.panelRadius));
  await previewAndPersistShapeSettings();
}

async function onButtonRadiusInput(event) {
  state.appearance.buttonRadius = Math.round(clampNumber(event.target.value, 0, 24, defaultData.appearance.buttonRadius));
  await previewAndPersistShapeSettings();
}

async function onCornerAccentsChange(event) {
  state.appearance.cornerAccentsEnabled = event.target.checked === true;
  await previewAndPersistShapeSettings();
}

async function onFontScaleInput(event) {
  state.appearance.fontScale = clampNumber(Number(event.target.value) / 100, 0.85, 1.2, defaultData.appearance.fontScale);
  await previewAndPersistShapeSettings();
}

async function onCardDensityOptionClick(event) {
  const button = event.target.closest("[data-card-density]");
  if (!button || !cardDensityOptions.some((option) => option.id === button.dataset.cardDensity)) return;
  state.appearance.cardDensity = button.dataset.cardDensity;
  await previewAndPersistShapeSettings(true);
}

async function previewAndPersistShapeSettings(renderCards = false) {
  state.appearance = normalizeAppearance(state.appearance);
  applyAppearance();
  renderShapeControls();
  if (renderCards) renderShortcuts();
  await writeData();
}

async function onBackgroundFileChange(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  if (files.some((file) => !file.type.startsWith("image/"))) {
    showToast(t("invalidBackground"), "error");
    return;
  }

  try {
    const appearance = normalizeAppearance(state.appearance);
    const existing = [...appearance.customBackgroundImages];
    const additions = [];
    for (const [index, file] of files.entries()) {
      const background = await processBackgroundFile(file, BACKGROUND_IMAGE_MAX_WIDTH, BACKGROUND_IMAGE_MAX_HEIGHT);
      const preferredId = sanitizeCustomBackgroundId(file.name.replace(/\.[^.]+$/, "")) || `custom-${Date.now()}-${index}`;
      additions.push({
        id: uniqueCustomBackgroundId(preferredId, existing.concat(additions)),
        name: normalizeCustomBackgroundName(file.name.replace(/\.[^.]+$/, ""), existing.length + additions.length),
        image: background.image,
        accentColor: background.accentColor
      });
    }
    state.appearance.customBackgroundImages = existing.concat(additions);
    const activeBackground = additions.at(-1);
    state.appearance.activeCustomBackgroundId = activeBackground?.id || appearance.activeCustomBackgroundId;
    state.appearance.background = "custom";
    applyCustomBackgroundAccent(activeBackground);
    await writeData();
    render();
  } catch {
    showToast(t("invalidBackground"), "error");
  } finally {
    els.backgroundFileInput.value = "";
  }
}

async function removeCustomBackground() {
  const appearance = normalizeAppearance(state.appearance);
  const activeId = appearance.activeCustomBackgroundId;
  if (!activeId) return;

  const remaining = appearance.customBackgroundImages.filter((background) => background.id !== activeId);
  state.appearance.customBackgroundImages = remaining;
  state.appearance.activeCustomBackgroundId = remaining[0]?.id || "";
  if (!remaining.length) {
    state.appearance.background = "runner-grid";
  }
  await writeData();
  render();
}

function openResetAppearanceDialog() {
  if (!els.resetAppearanceDialog.open) els.resetAppearanceDialog.showModal();
}

function closeResetAppearanceDialog() {
  if (els.resetAppearanceDialog.open) els.resetAppearanceDialog.close();
}

async function resetAppearance() {
  const candidate = clone(state);
  const existingBackgrounds = normalizeAppearance(state.appearance).customBackgroundImages;
  candidate.locale = "zh-CN";
  candidate.appearance = {
    ...structuredClone(defaultData.appearance),
    customBackgroundImages: existingBackgrounds
  };
  candidate.activeAppearancePresetId = "";
  await writeDataSnapshot(candidate);
  state = candidate;
  closeResetAppearanceDialog();
  render();
}

function applyCustomBackgroundAccent(background) {
  const accentColor = normalizeHexColor(background?.accentColor);
  if (accentColor) {
    state.appearance.accentColor = accentColor;
  }
}

function scheduleBackgroundStorageOptimization() {
  if (backgroundStorageOptimizationScheduled) return;
  const appearance = normalizeAppearance(state.appearance);
  const images = appearance.customBackgroundImages;
  const totalLength = images.reduce((sum, item) => sum + item.image.length, 0);
  const hasLargeImage = images.some((item) => item.image.length >= BACKGROUND_IMAGE_OPTIMIZE_THRESHOLD);
  if (!hasLargeImage && totalLength < BACKGROUND_STORAGE_OPTIMIZE_THRESHOLD) return;

  backgroundStorageOptimizationScheduled = true;
  const run = () => {
    optimizeStoredBackgroundImages().finally(() => {
      backgroundStorageOptimizationScheduled = false;
    });
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 5000 });
  } else {
    window.setTimeout(run, 2200);
  }
}

async function optimizeStoredBackgroundImages() {
  const appearance = normalizeAppearance(state.appearance);
  const optimizedImages = [];
  let changed = false;

  for (const background of appearance.customBackgroundImages) {
    if (background.image.length < BACKGROUND_IMAGE_OPTIMIZE_THRESHOLD) {
      optimizedImages.push(background);
      continue;
    }

    try {
      const optimized = await optimizeBackgroundImage(
        background.image,
        BACKGROUND_IMAGE_MAX_WIDTH,
        BACKGROUND_IMAGE_MAX_HEIGHT
      );
      const shouldUseOptimized = optimized.image.length < background.image.length * 0.92;
      optimizedImages.push(shouldUseOptimized ? {
        ...background,
        image: optimized.image,
        accentColor: optimized.accentColor || background.accentColor
      } : background);
      changed = changed || shouldUseOptimized;
    } catch {
      optimizedImages.push(background);
    }
  }

  if (!changed) return;
  state.appearance.customBackgroundImages = optimizedImages;
  state.appearance = normalizeAppearance(state.appearance);
  await writeData();
  applyAppearance();
  if (els.customizeDialog.open) renderCustomizerControls();
}

function processBackgroundFile(file, maxWidth, maxHeight) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("error", reject);
    reader.addEventListener("load", () => {
      optimizeBackgroundImage(String(reader.result || ""), maxWidth, maxHeight).then(resolve, reject);
    });
    reader.readAsDataURL(file);
  });
}

function optimizeBackgroundImage(source, maxWidth, maxHeight) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("error", reject);
    image.addEventListener("load", () => {
      const scale = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Canvas is not available."));
        return;
      }
      context.drawImage(image, 0, 0, width, height);
      resolve({
        image: canvas.toDataURL("image/jpeg", BACKGROUND_IMAGE_QUALITY),
        accentColor: extractAccentColorFromCanvas(canvas)
      });
    });
    image.src = source;
  });
}

function extractAccentColorFromCanvas(canvas) {
  const sampleWidth = Math.min(96, canvas.width);
  const sampleHeight = Math.min(96, canvas.height);
  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = sampleWidth;
  sampleCanvas.height = sampleHeight;
  const context = sampleCanvas.getContext("2d", { willReadFrequently: true });
  if (!context) return defaultData.appearance.accentColor;

  context.drawImage(canvas, 0, 0, sampleWidth, sampleHeight);

  let pixels;
  try {
    pixels = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
  } catch {
    return defaultData.appearance.accentColor;
  }

  let bestColor = null;
  const average = { r: 0, g: 0, b: 0, count: 0 };

  for (let index = 0; index < pixels.length; index += 16) {
    const r = pixels[index];
    const g = pixels[index + 1];
    const b = pixels[index + 2];
    const alpha = pixels[index + 3];
    if (alpha < 160) continue;

    const [h, s, l] = rgbToHsl(r, g, b);
    if (l > 0.12 && l < 0.86) {
      average.r += r;
      average.g += g;
      average.b += b;
      average.count += 1;
    }

    if (s < 0.16 || l < 0.16 || l > 0.84) continue;
    const score = s * 1.8 + (1 - Math.abs(l - 0.52) * 2) * 0.55;
    if (!bestColor || score > bestColor.score) {
      bestColor = { h, s, l, score };
    }
  }

  if (!bestColor && average.count) {
    const [h, s, l] = rgbToHsl(
      Math.round(average.r / average.count),
      Math.round(average.g / average.count),
      Math.round(average.b / average.count)
    );
    bestColor = { h, s, l, score: 0 };
  }

  if (!bestColor) return defaultData.appearance.accentColor;

  const s = clampNumber(bestColor.s * 1.18, 0.58, 0.92, 0.72);
  const l = clampNumber(bestColor.l, 0.46, 0.63, 0.54);
  const [r, g, b] = hslToRgb(bestColor.h, s, l);
  return rgbToHex(r, g, b);
}

function rgbToHsl(r, g, b) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;

  if (max === min) return [0, 0, lightness];

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;
  if (max === red) {
    hue = (green - blue) / delta + (green < blue ? 6 : 0);
  } else if (max === green) {
    hue = (blue - red) / delta + 2;
  } else {
    hue = (red - green) / delta + 4;
  }

  return [hue / 6, saturation, lightness];
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const gray = Math.round(l * 255);
    return [gray, gray, gray];
  }

  const hueToRgb = (p, q, t) => {
    let channel = t;
    if (channel < 0) channel += 1;
    if (channel > 1) channel -= 1;
    if (channel < 1 / 6) return p + (q - p) * 6 * channel;
    if (channel < 1 / 2) return q;
    if (channel < 2 / 3) return p + (q - p) * (2 / 3 - channel) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
    Math.round(hueToRgb(p, q, h) * 255),
    Math.round(hueToRgb(p, q, h - 1 / 3) * 255)
  ];
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

async function activateCategory(categoryId) {
  if (!state.categories.some((category) => category.id === categoryId)) return;
  state.activeCategoryId = categoryId;
  await recordCategoryUse(categoryId, false);
  await writeData();
  render();
}

async function recordCategoryUse(categoryId, shouldWrite = true) {
  const category = state.categories.find((item) => item.id === categoryId);
  if (!category) return;
  category.useCount = (Number.isFinite(category.useCount) ? category.useCount : 0) + 1;
  if (shouldWrite) {
    await writeData();
  }
}

function normalizeUseCount(value) {
  const count = Number(value);
  return Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
}

function shortcutsForDisplay(categoryId = "") {
  const shortcuts = state.shortcuts
    .map((shortcut, manualIndex) => ({ shortcut, manualIndex }))
    .filter(({ shortcut }) => !categoryId || shortcut.categoryId === categoryId);

  if (state.sortShortcutsByUsage) {
    shortcuts.sort((left, right) => (
      normalizeUseCount(right.shortcut.useCount) - normalizeUseCount(left.shortcut.useCount)
      || left.manualIndex - right.manualIndex
    ));
  }

  return shortcuts.map(({ shortcut }) => shortcut);
}

async function recordShortcutUse(shortcutId) {
  const shortcut = state.shortcuts.find((item) => item.id === shortcutId);
  if (!shortcut) return;
  shortcut.useCount = normalizeUseCount(shortcut.useCount) + 1;
  await recordCategoryUse(shortcut.categoryId, false);
  await writeData();
}

async function onSortShortcutsByUsageChange(event) {
  state.sortShortcutsByUsage = event.currentTarget.checked;
  await writeData();
  render();
}

async function toggleLocale() {
  await setLocale(state.locale === "en" ? "zh-CN" : "en");
}

async function setMode(mode) {
  state.mode = mode;
  await writeData();
  render();
}

function readChromeBookmarksTree() {
  const api = globalThis.chrome?.bookmarks;
  if (!api || typeof api.getTree !== "function") {
    return Promise.reject(Object.assign(new Error("bookmarks unavailable"), { code: "unavailable" }));
  }

  return new Promise((resolve, reject) => {
    try {
      api.getTree((tree) => {
        const error = globalThis.chrome?.runtime?.lastError;
        if (error) {
          reject(new Error(error.message || "bookmark read failed"));
          return;
        }
        resolve(Array.isArray(tree) ? tree : []);
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function openBookmarkImportDialog() {
  if (bookmarkImportBusy) return;
  bookmarkImportGroups = [];
  bookmarkImportSelectedIds = new Set();
  clearError(els.bookmarkImportError);
  if (!els.bookmarkImportDialog.open) els.bookmarkImportDialog.showModal();
  bookmarkImportBusy = true;
  renderBookmarkImportDialog();

  try {
    const tree = await readChromeBookmarksTree();
    const importer = globalThis.RunnerBookmarkImport;
    if (!importer) throw Object.assign(new Error("bookmark importer unavailable"), { code: "unavailable" });
    const preview = importer.buildBookmarkImportPreview(tree, { rootTitle: t("bookmarksBar") });
    if (!preview.found) {
      showError(els.bookmarkImportError, t("bookmarkImportBarMissing"));
      return;
    }
    bookmarkImportGroups = preview.groups;
    bookmarkImportSelectedIds = new Set(preview.groups
      .filter((group) => group.validCount > 0)
      .map((group) => group.id));
    if (!preview.groups.some((group) => group.validCount > 0)) {
      showError(els.bookmarkImportError, t("bookmarkImportEmpty"));
    }
  } catch (error) {
    showError(
      els.bookmarkImportError,
      t(error?.code === "unavailable" ? "bookmarkImportUnavailable" : "bookmarkImportReadFailed")
    );
  } finally {
    bookmarkImportBusy = false;
    renderBookmarkImportDialog();
  }
}

function renderBookmarkImportDialog() {
  els.bookmarkImportTitle.textContent = t("bookmarkImportTitle");
  els.bookmarkImportCopy.textContent = t("bookmarkImportCopy");
  const selectedGroups = bookmarkImportGroups.filter((group) => bookmarkImportSelectedIds.has(group.id));
  const selectedSites = selectedGroups.reduce((total, group) => total + group.validCount, 0);
  els.bookmarkImportSummary.textContent = bookmarkImportBusy && !bookmarkImportGroups.length
    ? t("bookmarkImportReading")
    : t("bookmarkImportSummary", { groups: selectedGroups.length, sites: selectedSites });

  const fragment = document.createDocumentFragment();
  bookmarkImportGroups.forEach((group) => {
    const item = document.createElement("label");
    item.className = "bookmark-import-item";
    item.setAttribute("role", "listitem");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.bookmarkGroupId = group.id;
    checkbox.checked = bookmarkImportSelectedIds.has(group.id);
    checkbox.disabled = bookmarkImportBusy || group.validCount < 1;

    const copy = document.createElement("span");
    copy.className = "bookmark-import-item-copy";
    const title = document.createElement("strong");
    title.textContent = group.title;
    const count = document.createElement("small");
    count.textContent = t("bookmarkImportGroupCount", { count: group.validCount });
    copy.append(title, count);
    item.append(checkbox, copy);
    fragment.append(item);
  });
  els.bookmarkImportList.replaceChildren(fragment);

  const selectableGroups = bookmarkImportGroups.filter((group) => group.validCount > 0);
  const allSelected = selectableGroups.length > 0
    && selectableGroups.every((group) => bookmarkImportSelectedIds.has(group.id));
  els.toggleAllBookmarkGroupsBtn.textContent = t(allSelected ? "bookmarkImportClearAll" : "bookmarkImportSelectAll");
  els.toggleAllBookmarkGroupsBtn.disabled = bookmarkImportBusy || selectableGroups.length < 1;
  els.confirmBookmarkImportBtn.textContent = t(bookmarkImportBusy ? "bookmarkImporting" : "bookmarkImportAction");
  els.confirmBookmarkImportBtn.disabled = bookmarkImportBusy || selectedSites < 1;
  els.cancelBookmarkImportBtn.disabled = bookmarkImportBusy;
  els.closeBookmarkImportBtn.disabled = bookmarkImportBusy;
  els.importBookmarksBtn.disabled = bookmarkImportBusy;
}

function onBookmarkImportSelectionChange(event) {
  const checkbox = event.target.closest("[data-bookmark-group-id]");
  if (!checkbox) return;
  if (checkbox.checked) bookmarkImportSelectedIds.add(checkbox.dataset.bookmarkGroupId);
  else bookmarkImportSelectedIds.delete(checkbox.dataset.bookmarkGroupId);
  renderBookmarkImportDialog();
}

function toggleAllBookmarkGroups() {
  const selectableGroups = bookmarkImportGroups.filter((group) => group.validCount > 0);
  const allSelected = selectableGroups.length > 0
    && selectableGroups.every((group) => bookmarkImportSelectedIds.has(group.id));
  bookmarkImportSelectedIds = allSelected
    ? new Set()
    : new Set(selectableGroups.map((group) => group.id));
  renderBookmarkImportDialog();
}

function closeBookmarkImportDialog() {
  if (bookmarkImportBusy) return;
  if (els.bookmarkImportDialog.open) els.bookmarkImportDialog.close();
  bookmarkImportGroups = [];
  bookmarkImportSelectedIds = new Set();
  clearError(els.bookmarkImportError);
}

async function importSelectedBookmarks() {
  if (bookmarkImportBusy || !bookmarkImportSelectedIds.size) return;
  const importer = globalThis.RunnerBookmarkImport;
  if (!importer) {
    showError(els.bookmarkImportError, t("bookmarkImportUnavailable"));
    return;
  }

  const result = importer.buildBookmarkImportCandidate(state, bookmarkImportGroups, bookmarkImportSelectedIds);
  if (!result.stats.imported) {
    closeBookmarkImportDialog();
    showToast(t("bookmarkImportNoChanges"));
    return;
  }

  bookmarkImportBusy = true;
  clearError(els.bookmarkImportError);
  renderBookmarkImportDialog();
  try {
    await writeDataSnapshot(result.candidate);
    state = result.candidate;
    bookmarkImportBusy = false;
    closeBookmarkImportDialog();
    render();
    showToast(t("bookmarkImportResult", {
      categories: result.stats.createdCategories,
      imported: result.stats.imported,
      duplicates: result.stats.duplicates,
      invalid: result.stats.invalid
    }), "success");
  } catch {
    bookmarkImportBusy = false;
    showError(els.bookmarkImportError, t("bookmarkImportStorageFailed"));
    renderBookmarkImportDialog();
  }
}

async function disableExtension() {
  const shouldDisable = await openConfirmDialog(t("disableExtensionConfirm"), t("disableExtensionTitle"));
  if (!shouldDisable) return;

  const extensionId = globalThis.chrome?.runtime?.id;
  const setEnabled = globalThis.chrome?.management?.setEnabled;
  if (!extensionId || typeof setEnabled !== "function") {
    showToast(t("disableExtensionUnavailable"), "error");
    return;
  }

  try {
    await setEnabled.call(chrome.management, extensionId, false);
  } catch {
    showToast(t("disableExtensionFailed"), "error");
  }
}

function openCategoryDialog(category) {
  clearError(els.categoryError);
  const isEdit = Boolean(category);
  els.categoryDialogTitle.textContent = isEdit ? t("editCategory") : t("addCategory");
  els.categoryId.value = category?.id || "";
  els.categoryNameInput.value = category?.name || "";
  els.categoryIconInput.value = category ? categoryIcon(category) : "";
  categoryIconImageDraft = category?.iconImage || "";
  els.categoryIconFileInput.value = "";
  updateCategoryIconPreview();
  els.deleteCategoryBtn.hidden = !isEdit || state.categories.length < 2;
  els.moveCategoryUpBtn.hidden = !isEdit || state.sortShortcutsByUsage;
  els.moveCategoryDownBtn.hidden = !isEdit || state.sortShortcutsByUsage;
  els.categoryDialog.showModal();
  els.categoryNameInput.focus();
}

async function onCategorySubmit(event) {
  event.preventDefault();
  const id = els.categoryId.value;
  const name = els.categoryNameInput.value.trim();
  const icon = normalizeCategoryIcon(els.categoryIconInput.value) || initials(name);
  const iconImage = normalizeCategoryIconImage(categoryIconImageDraft);
  if (!name) return showError(els.categoryError, t("categoryNameRequired"));

  const duplicate = state.categories.some((category) => category.name === name && category.id !== id);
  if (duplicate) return showError(els.categoryError, t("duplicateCategory"));

  if (id) {
    const category = state.categories.find((item) => item.id === id);
    if (category) Object.assign(category, { name, icon, iconImage });
  } else {
    const newCategory = { id: createId(name), name, icon, iconImage, order: nextCategoryOrder(), useCount: 0 };
    state.categories.push(newCategory);
    state.activeCategoryId = newCategory.id;
  }

  await writeData();
  els.categoryDialog.close();
  render();
}

async function onDeleteCategory() {
  const id = els.categoryId.value;
  if (!id || state.categories.length < 2) return;

  const category = state.categories.find((item) => item.id === id);
  if (!category) return;

  const custom = state.categories.find((item) => item.id === "custom" && item.id !== id)
    || state.categories.find((item) => item.id !== id)
    || state.categories[0];
  const hasShortcuts = state.shortcuts.some((shortcut) => shortcut.categoryId === id);
  if (hasShortcuts) {
    const ok = await openConfirmDialog(t("deleteCategoryConfirm", {
      category: displayCategoryName(category),
      target: displayCategoryName(custom)
    }));
    if (!ok) return;
    state.shortcuts = state.shortcuts.map((shortcut) => (
      shortcut.categoryId === id ? { ...shortcut, categoryId: custom.id } : shortcut
    ));
  }

  state.categories = state.categories.filter((item) => item.id !== id);
  state.activeCategoryId = custom.id;
  await writeData();
  els.categoryDialog.close();
  render();
}

async function moveCategory(direction) {
  if (state.sortShortcutsByUsage) return;
  const id = els.categoryId.value;
  const categories = orderedCategories();
  const index = categories.findIndex((category) => category.id === id);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= categories.length) return;

  const [category] = categories.splice(index, 1);
  categories.splice(nextIndex, 0, category);
  setCategoryOrder(categories);
  await writeData();
  render();
}

async function onCategoryIconFileChange(event) {
  clearError(els.categoryError);
  const [file] = event.target.files || [];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showError(els.categoryError, t("invalidImage"));
    return;
  }

  try {
    categoryIconImageDraft = await resizeImageToDataUrl(file, 96);
    updateCategoryIconPreview();
  } catch {
    showError(els.categoryError, t("invalidImage"));
  } finally {
    els.categoryIconFileInput.value = "";
  }
}

function removeCategoryIconImage() {
  categoryIconImageDraft = "";
  updateCategoryIconPreview();
  els.categoryIconInput.focus();
}

function updateCategoryIconPreview() {
  const name = els.categoryNameInput.value.trim() || "AI";
  paintCategoryIcon(els.categoryIconPreview, {
    name,
    icon: els.categoryIconInput.value || initials(name),
    iconImage: categoryIconImageDraft
  });
  els.removeCategoryIconBtn.hidden = !categoryIconImageDraft;
}

function resizeImageToDataUrl(file, size) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("error", reject);
    reader.addEventListener("load", () => {
      const image = new Image();
      image.addEventListener("error", reject);
      image.addEventListener("load", () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, size, size);
        const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
        const sourceX = (image.naturalWidth - sourceSize) / 2;
        const sourceY = (image.naturalHeight - sourceSize) / 2;
        context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);
        resolve(canvas.toDataURL("image/png"));
      });
      image.src = String(reader.result || "");
    });
    reader.readAsDataURL(file);
  });
}

function onCategoryPointerDown(event) {
  if (state.sortShortcutsByUsage) return;
  if (event.button !== 0) return;
  const button = event.target.closest("[data-category-id]");
  if (!button) return;

  clearCategoryDrag();
  categoryDrag.pointerId = event.pointerId;
  categoryDrag.sourceId = button.dataset.categoryId;
  categoryDrag.startX = event.clientX;
  categoryDrag.startY = event.clientY;
  categoryDrag.currentX = event.clientX;
  categoryDrag.currentY = event.clientY;
  categoryDrag.sourceButton = button;
  button.setPointerCapture?.(event.pointerId);

  categoryDrag.timer = window.setTimeout(() => {
    beginCategoryDrag();
  }, CATEGORY_LONG_PRESS_MS);
}

function onCategoryPointerMove(event) {
  if (categoryDrag.pointerId !== event.pointerId) return;
  categoryDrag.currentX = event.clientX;
  categoryDrag.currentY = event.clientY;

  if (!categoryDrag.dragging) {
    const dx = Math.abs(event.clientX - categoryDrag.startX);
    const dy = Math.abs(event.clientY - categoryDrag.startY);
    if (dx > CATEGORY_DRAG_MOVE_PX || dy > CATEGORY_DRAG_MOVE_PX) {
      clearCategoryDrag();
    }
    return;
  }

  event.preventDefault();
  moveCategoryGhost(event.clientX, event.clientY);
  markCategoryDropTarget(event.clientX, event.clientY);
}

function onCategoryPointerUp(event) {
  if (categoryDrag.pointerId !== event.pointerId) return;
  if (categoryDrag.dragging) {
    event.preventDefault();
    finishCategoryDrag(event.clientX, event.clientY);
    return;
  }
  clearCategoryDrag();
}

function onCategoryPointerCancel(event) {
  if (categoryDrag.pointerId !== event.pointerId) return;
  const wasDragging = categoryDrag.dragging;
  clearCategoryDrag();
  if (wasDragging) releaseCategoryClickSuppression();
}

function beginCategoryDrag() {
  const button = categoryDrag.sourceButton;
  if (!button || !categoryDrag.sourceId) return;

  categoryDrag.dragging = true;
  categoryDrag.suppressClick = true;
  document.body.classList.add("category-drag-active");
  button.classList.add("is-dragging");

  const rect = button.getBoundingClientRect();
  const ghost = button.cloneNode(true);
  ghost.classList.add("category-drag-ghost");
  ghost.style.width = `${rect.width}px`;
  document.body.append(ghost);
  categoryDrag.ghost = ghost;
  moveCategoryGhost(categoryDrag.currentX, categoryDrag.currentY);
}

function moveCategoryGhost(x, y) {
  if (!categoryDrag.ghost) return;
  categoryDrag.ghost.style.transform = `translate(${x + 12}px, ${y + 12}px)`;
}

function markCategoryDropTarget(x, y) {
  const target = categoryButtonFromPoint(x, y);
  if (categoryDrag.dropTarget && categoryDrag.dropTarget !== target) {
    categoryDrag.dropTarget.classList.remove("is-drop-target", "drop-after");
  }
  categoryDrag.dropTarget = target;
  if (!target || target.dataset.categoryId === categoryDrag.sourceId) return;
  const rect = target.getBoundingClientRect();
  target.classList.add("is-drop-target");
  target.classList.toggle("drop-after", y > rect.top + rect.height / 2);
}

async function finishCategoryDrag(x, y) {
  const sourceId = categoryDrag.sourceId;
  const target = categoryButtonFromPoint(x, y);
  const targetId = target?.dataset.categoryId || "";
  const placeAfter = target ? y > target.getBoundingClientRect().top + target.getBoundingClientRect().height / 2 : false;
  clearCategoryDrag();
  releaseCategoryClickSuppression();

  if (!sourceId || !targetId || sourceId === targetId) return;
  reorderCategory(sourceId, targetId, placeAfter);
  await writeData();
  render();
}

function categoryButtonFromPoint(x, y) {
  const element = document.elementFromPoint(x, y);
  return element?.closest?.("[data-category-id]");
}

function reorderCategory(sourceId, targetId, placeAfter = false) {
  const categories = orderedCategories();
  const sourceIndex = categories.findIndex((category) => category.id === sourceId);
  let targetIndex = categories.findIndex((category) => category.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0) return;

  const [source] = categories.splice(sourceIndex, 1);
  if (sourceIndex < targetIndex) targetIndex -= 1;
  const insertIndex = placeAfter ? targetIndex + 1 : targetIndex;
  categories.splice(insertIndex, 0, source);
  setCategoryOrder(categories);
}

function clearCategoryDrag() {
  window.clearTimeout(categoryDrag.timer);
  categoryDrag.timer = 0;
  categoryDrag.pointerId = null;
  categoryDrag.sourceId = "";
  categoryDrag.startX = 0;
  categoryDrag.startY = 0;
  categoryDrag.currentX = 0;
  categoryDrag.currentY = 0;
  categoryDrag.dragging = false;
  categoryDrag.sourceButton?.classList.remove("is-dragging");
  categoryDrag.sourceButton = null;
  categoryDrag.dropTarget?.classList.remove("is-drop-target", "drop-after");
  categoryDrag.dropTarget = null;
  categoryDrag.ghost?.remove();
  categoryDrag.ghost = null;
  document.body.classList.remove("category-drag-active");
}

function releaseCategoryClickSuppression() {
  window.setTimeout(() => {
    categoryDrag.suppressClick = false;
  }, 180);
}

function onShortcutPointerDown(event) {
  if (state.sortShortcutsByUsage) return;
  if (event.button !== 0) return;
  const handle = event.target.closest(".shortcut-icon");
  if (!handle || !els.shortcutGrid.contains(handle)) return;
  const card = handle.closest("[data-shortcut-id]");
  if (!card) return;

  event.preventDefault();
  clearShortcutDrag();
  shortcutDrag.pointerId = event.pointerId;
  shortcutDrag.sourceId = card.dataset.shortcutId;
  shortcutDrag.startX = event.clientX;
  shortcutDrag.startY = event.clientY;
  shortcutDrag.currentX = event.clientX;
  shortcutDrag.currentY = event.clientY;
  shortcutDrag.sourceCard = card;
  try {
    card.setPointerCapture?.(event.pointerId);
  } catch {
    handle.setPointerCapture?.(event.pointerId);
  }

  shortcutDrag.timer = window.setTimeout(() => {
    beginShortcutDrag();
  }, SHORTCUT_LONG_PRESS_MS);
}

function onShortcutPointerMove(event) {
  if (shortcutDrag.pointerId !== event.pointerId) return;
  shortcutDrag.currentX = event.clientX;
  shortcutDrag.currentY = event.clientY;

  if (!shortcutDrag.dragging) {
    if (event.buttons === 0) {
      clearShortcutDrag();
      return;
    }
    event.preventDefault();
    return;
  }

  event.preventDefault();
  moveShortcutGhost(event.clientX, event.clientY);
  markShortcutDropTarget(event.clientX, event.clientY);
}

function onShortcutPointerUp(event) {
  if (shortcutDrag.pointerId !== event.pointerId) return;
  if (shortcutDrag.dragging) {
    event.preventDefault();
    finishShortcutDrag(event.clientX, event.clientY);
    return;
  }
  clearShortcutDrag();
}

function onShortcutPointerCancel(event) {
  if (shortcutDrag.pointerId !== event.pointerId) return;
  const wasDragging = shortcutDrag.dragging;
  clearShortcutDrag();
  if (wasDragging) releaseShortcutClickSuppression();
}

function beginShortcutDrag() {
  const card = shortcutDrag.sourceCard;
  if (!card || !shortcutDrag.sourceId) return;

  shortcutDrag.dragging = true;
  shortcutDrag.suppressClick = true;
  document.body.classList.add("shortcut-drag-active");
  card.classList.add("is-dragging");

  const rect = card.getBoundingClientRect();
  const ghost = card.cloneNode(true);
  ghost.classList.add("shortcut-drag-ghost");
  ghost.removeAttribute("role");
  ghost.removeAttribute("tabindex");
  ghost.style.width = `${rect.width}px`;
  ghost.style.height = `${rect.height}px`;
  document.body.append(ghost);
  shortcutDrag.ghost = ghost;
  moveShortcutGhost(shortcutDrag.currentX, shortcutDrag.currentY);
}

function moveShortcutGhost(x, y) {
  if (!shortcutDrag.ghost) return;
  shortcutDrag.ghost.style.transform = `translate(${x + 14}px, ${y + 14}px)`;
}

function markShortcutDropTarget(x, y) {
  const target = shortcutCardFromPoint(x, y);
  if (shortcutDrag.dropTarget && shortcutDrag.dropTarget !== target) {
    shortcutDrag.dropTarget.classList.remove("is-drop-target", "drop-after");
  }
  shortcutDrag.dropTarget = target;
  if (!target || target.dataset.shortcutId === shortcutDrag.sourceId) return;
  target.classList.add("is-drop-target");
  target.classList.toggle("drop-after", shouldPlaceShortcutAfter(target, x, y));
}

async function finishShortcutDrag(x, y) {
  const sourceId = shortcutDrag.sourceId;
  const target = shortcutCardFromPoint(x, y);
  const targetId = target?.dataset.shortcutId || "";
  const placeAfter = target ? shouldPlaceShortcutAfter(target, x, y) : false;
  clearShortcutDrag();
  releaseShortcutClickSuppression();

  if (!sourceId || !targetId || sourceId === targetId) return;
  reorderShortcut(sourceId, targetId, placeAfter);
  await writeData();
  renderShortcuts();
}

function shortcutCardFromPoint(x, y) {
  const element = document.elementFromPoint(x, y);
  const card = element?.closest?.("[data-shortcut-id]");
  if (!card || !els.shortcutGrid.contains(card)) return null;
  return card;
}

function shouldPlaceShortcutAfter(card, x, y) {
  const rect = card.getBoundingClientRect();
  const centerY = rect.top + rect.height / 2;
  const isSameRowPointer = Math.abs(y - centerY) < rect.height * 0.38;
  if (isSameRowPointer) {
    return x > rect.left + rect.width / 2;
  }
  return y > centerY;
}

function reorderShortcut(sourceId, targetId, placeAfter = false) {
  const activeCategoryId = state.activeCategoryId;
  const activeShortcuts = state.shortcuts.filter((shortcut) => shortcut.categoryId === activeCategoryId);
  const sourceIndex = activeShortcuts.findIndex((shortcut) => shortcut.id === sourceId);
  let targetIndex = activeShortcuts.findIndex((shortcut) => shortcut.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0) return;

  const [source] = activeShortcuts.splice(sourceIndex, 1);
  if (sourceIndex < targetIndex) targetIndex -= 1;
  const insertIndex = placeAfter ? targetIndex + 1 : targetIndex;
  activeShortcuts.splice(insertIndex, 0, source);

  const orderedActiveShortcuts = [...activeShortcuts];
  state.shortcuts = state.shortcuts.map((shortcut) => (
    shortcut.categoryId === activeCategoryId ? orderedActiveShortcuts.shift() : shortcut
  ));
}

function clearShortcutDrag() {
  window.clearTimeout(shortcutDrag.timer);
  shortcutDrag.timer = 0;
  shortcutDrag.pointerId = null;
  shortcutDrag.sourceId = "";
  shortcutDrag.startX = 0;
  shortcutDrag.startY = 0;
  shortcutDrag.currentX = 0;
  shortcutDrag.currentY = 0;
  shortcutDrag.dragging = false;
  shortcutDrag.sourceCard?.classList.remove("is-dragging");
  shortcutDrag.sourceCard = null;
  shortcutDrag.dropTarget?.classList.remove("is-drop-target", "drop-after");
  shortcutDrag.dropTarget = null;
  shortcutDrag.ghost?.remove();
  shortcutDrag.ghost = null;
  document.body.classList.remove("shortcut-drag-active");
}

function releaseShortcutClickSuppression() {
  window.setTimeout(() => {
    shortcutDrag.suppressClick = false;
  }, 180);
}

function openShortcutDialog(shortcut) {
  clearError(els.shortcutError);
  const isEdit = Boolean(shortcut);
  els.shortcutDialogTitle.textContent = isEdit ? t("editShortcut") : t("addShortcut");
  els.shortcutId.value = shortcut?.id || "";
  els.shortcutTitleInput.value = shortcut?.title || "";
  els.shortcutUrlInput.value = shortcut?.url || "";
  els.shortcutCategorySelect.value = shortcut?.categoryId || state.activeCategoryId;
  els.shortcutColorInput.value = shortcut?.color || "#62d5ff";
  els.deleteShortcutBtn.hidden = !isEdit;
  updateIconPreview();
  els.shortcutDialog.showModal();
  (isEdit ? els.shortcutTitleInput : els.shortcutUrlInput).focus();
}

async function onShortcutSubmit(event) {
  event.preventDefault();
  const id = els.shortcutId.value;
  const rawTitle = els.shortcutTitleInput.value.trim();
  const url = normalizeUrl(els.shortcutUrlInput.value);
  const categoryId = els.shortcutCategorySelect.value;
  const color = els.shortcutColorInput.value || "#62d5ff";

  if (!url) return showError(els.shortcutError, t("invalidUrl"));
  const title = rawTitle || inferShortcutTitle(url);
  if (!state.categories.some((category) => category.id === categoryId)) {
    return showError(els.shortcutError, t("chooseCategory"));
  }

  if (id) {
    const shortcut = state.shortcuts.find((item) => item.id === id);
    if (shortcut) Object.assign(shortcut, { title, url, categoryId, color, iconUrl: "" });
  } else {
    state.shortcuts.push({ id: createId(title), title, url, categoryId, color, iconUrl: "", useCount: 0 });
    state.activeCategoryId = categoryId;
  }

  await writeData();
  els.shortcutDialog.close();
  render();
}

async function onDeleteShortcut() {
  const id = els.shortcutId.value;
  const shortcut = state.shortcuts.find((item) => item.id === id);
  if (!shortcut) return;
  const ok = await openConfirmDialog(t("deleteShortcutConfirm", { title: shortcut.title }));
  if (!ok) return;
  state.shortcuts = state.shortcuts.filter((item) => item.id !== id);
  await writeData();
  els.shortcutDialog.close();
  render();
}

async function onSearch(event) {
  event.preventDefault();
  await runSearch(els.searchInput.value);
}

async function onClassicSearch(event) {
  event.preventDefault();
  await runSearch(els.classicSearchInput.value);
}

async function runSearch(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) return;
  await addSearchHistory(value);
  window.location.href = normalizeSearchTarget(value);
}

async function addSearchHistory(value) {
  const item = String(value).trim();
  if (!item) return;
  const key = item.toLowerCase();
  state.searchHistory = [
    item,
    ...normalizeSearchHistory(state.searchHistory).filter((entry) => entry.toLowerCase() !== key)
  ].slice(0, SEARCH_HISTORY_LIMIT);
  await writeData();
}

async function toggleSearchHistory() {
  if (!els.searchHistoryPanel.hidden) {
    hideSearchHistoryPanel();
    return;
  }

  if (!state.showSearchHistory) {
    state.showSearchHistory = true;
    await writeData();
    render();
  }

  showSearchHistoryPanel(true);
}

async function hideSearchHistory() {
  state.showSearchHistory = false;
  await writeData();
  render();
}

async function clearSearchHistory() {
  state.searchHistory = [];
  await writeData();
  render();
}

function clearSearchInput() {
  els.searchInput.value = "";
  updateSearchClearButton();
  renderSearchPanel();
  showSearchHistoryPanel();
  els.searchInput.focus();
}

function updateSearchClearButton() {
  els.searchClearBtn.hidden = !els.searchInput.value.trim();
}

function showSearchHistoryPanel(forceOpen = false) {
  const query = els.searchInput.value.trim();
  if (!state.showSearchHistory || (!forceOpen && !query && !state.searchHistory.length)) return;
  renderSearchPanel();
  els.searchHistoryPanel.hidden = false;
  els.historyToggleBtn.setAttribute("aria-expanded", "true");
  els.historyToggleBtn.setAttribute("aria-pressed", "true");
  els.historyToggleBtn.title = t("hideHistory");
  els.historyToggleBtn.setAttribute("aria-label", t("hideHistory"));
}

function hideSearchHistoryPanel() {
  els.searchHistoryPanel.hidden = true;
  els.historyToggleBtn.setAttribute("aria-expanded", "false");
  els.historyToggleBtn.setAttribute("aria-pressed", "false");
  els.historyToggleBtn.title = t("showHistory");
  els.historyToggleBtn.setAttribute("aria-label", t("showHistory"));
}

function onSearchInputKeydown(event) {
  if (event.key === "Escape") {
    hideSearchHistoryPanel();
    return;
  }

  if (event.key !== "ArrowDown" || els.searchHistoryPanel.hidden) return;
  const firstHistoryItem = els.searchSuggestionList.querySelector("[data-search-value]");
  firstHistoryItem?.focus();
}

function normalizeSearchTarget(value) {
  const direct = normalizeUrl(value, false);
  if (direct && looksLikeUrl(value)) return direct;
  return buildSearchEngineUrl(getActiveSearchEngine(), value);
}

function buildSearchEngineUrl(engine, query) {
  const template = normalizeSearchEngineTemplate(engine?.searchUrl)
    || defaultSearchEngines[0].searchUrl;
  return template.replaceAll("{query}", encodeURIComponent(query));
}

function inferShortcutTitle(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const handle = parsed.pathname.match(/\/@([^/?#]+)/)?.[1];
    if (handle) return decodeHandle(handle);

    const knownNames = {
      "aistudio.google.com": "Google AI Studio",
      "chatgpt.com": "ChatGPT",
      "claude.ai": "Claude",
      "fotor.com": "Fotor",
      "bilibili.com": "Bilibili",
      "youtube.com": "YouTube",
      "youtu.be": "YouTube",
      "tiktok.com": "TikTok",
      "xiaohongshu.com": "小红书",
      "xhslink.com": "小红书",
      "github.com": "GitHub",
      "wps.cn": "WPS Office",
      "dingtalk.com": "钉钉",
      "quark.cn": "夸克网盘"
    };

    const matchedHost = Object.keys(knownNames).find((domain) => host === domain || host.endsWith(`.${domain}`));
    if (matchedHost) return knownNames[matchedHost];

    const primaryLabel = host.split(".").find((part) => !["m", "app", "web"].includes(part)) || host;
    return titleCaseSlug(primaryLabel);
  } catch {
    return t("autoShortcutTitle");
  }
}

function decodeHandle(value) {
  try {
    return decodeURIComponent(value).trim() || t("autoShortcutTitle");
  } catch {
    return value.trim() || t("autoShortcutTitle");
  }
}

function decodeSlug(value) {
  try {
    return decodeURIComponent(value).replace(/[-_]+/g, " ").trim() || t("autoShortcutTitle");
  } catch {
    return value.replace(/[-_]+/g, " ").trim() || t("autoShortcutTitle");
  }
}

function titleCaseSlug(value) {
  return decodeSlug(value)
    .split(/\s+/)
    .map((word) => (/^[a-z]/i.test(word) ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function updateIconPreview() {
  const url = normalizeUrl(els.shortcutUrlInput.value, false);
  const title = els.shortcutTitleInput.value.trim() || (url ? inferShortcutTitle(url) : t("autoShortcutTitle"));
  const color = els.shortcutColorInput.value || "#62d5ff";
  paintShortcutIcon(els.shortcutIconPreview, {
    title,
    url,
    color,
    iconUrl: ""
  });
}

function normalizeUrl(value, requireDot = true) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    if (requireDot && !url.hostname.includes(".") && url.hostname !== "localhost") return "";
    return url.href;
  } catch {
    return "";
  }
}

function looksLikeUrl(value) {
  return /^https?:\/\//i.test(value) || value.includes(".") || value.startsWith("localhost");
}

function showError(element, message) {
  element.textContent = message;
  element.hidden = false;
}

function clearError(element) {
  element.textContent = "";
  element.hidden = true;
}

boot();
