const STORAGE_KEY = "shortcutDashboardData";
const SEARCH_HISTORY_LIMIT = 12;
const SEARCH_SUGGESTION_LIMIT = 10;
const BACKGROUND_IMAGE_MAX_WIDTH = 1440;
const BACKGROUND_IMAGE_MAX_HEIGHT = 900;
const BACKGROUND_IMAGE_QUALITY = 0.72;
const BACKGROUND_IMAGE_OPTIMIZE_THRESHOLD = 520000;
const BACKGROUND_STORAGE_OPTIMIZE_THRESHOLD = 1200000;

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
  locale: "zh",
  mode: "runner",
  searchEngines: structuredClone(defaultSearchEngines),
  activeSearchEngineId: "google",
  appearance: {
    theme: "dark",
    background: "runner-grid",
    customBackgroundImages: [],
    activeCustomBackgroundId: "",
    accentColor: "#d8ff3d",
    backgroundOpacity: 1,
    backgroundBlur: 0,
    panelOpacity: 0.94,
    panelBlur: 0
  },
  appearancePresets: [],
  activeAppearancePresetId: "",
  commonShortcutsSeeded: true,
  searchHistory: [],
  showSearchHistory: true,
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
  classicSearchInput: document.querySelector("#classicSearchInput"),
  classicShortcutGrid: document.querySelector("#classicShortcutGrid"),
  signalLabel: document.querySelector("#signalLabel"),
  clustersStatLabel: document.querySelector("#clustersStatLabel"),
  clustersLabel: document.querySelector("#clustersLabel"),
  searchPrefix: document.querySelector("#searchPrefix"),
  searchForm: document.querySelector("#searchForm"),
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
  appearanceTitle: document.querySelector("#appearanceTitle"),
  appearanceOptions: document.querySelector("#appearanceOptions"),
  themeColorTitle: document.querySelector("#themeColorTitle"),
  themeColorOptions: document.querySelector("#themeColorOptions"),
  themeColorInput: document.querySelector("#themeColorInput"),
  customThemeColorLabel: document.querySelector("#customThemeColorLabel"),
  appearancePresetTitle: document.querySelector("#appearancePresetTitle"),
  saveAppearancePresetBtn: document.querySelector("#saveAppearancePresetBtn"),
  updateAppearancePresetBtn: document.querySelector("#updateAppearancePresetBtn"),
  appearancePresetList: document.querySelector("#appearancePresetList"),
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
  resetAppearanceBtn: document.querySelector("#resetAppearanceBtn"),
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
  saveShortcutBtn: document.querySelector("#saveShortcutBtn")
};

const messages = {
  zh: {
    htmlLang: "zh-CN",
    ready: "READY",
    searchPrefix: "QUERY",
    searchPlaceholder: "搜索 GOOGLE 或输入网址",
    searchButton: "EXEC",
    clearSearchInput: "清除输入",
    historyToggle: "历史",
    searchHistory: "搜索历史",
    relatedSearches: "相关搜索",
    hideHistory: "隐藏",
    showHistory: "显示历史",
    clearHistory: "清空",
    noSearchHistory: "暂无搜索历史",
    noRelatedSearches: "输入关键词后显示相关搜索",
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
    signal: "SIGNAL",
    clusters: "CLUSTERS",
    nativeHome: "CHROME 原版",
    customize: "自定义",
    customizeTitle: "自定义",
    appearanceTitle: "更换窗口外观",
    themeColorTitle: "主题色",
    customThemeColor: "自定义颜色",
    appearancePresets: "外观预设",
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
    resetAppearance: "重置",
    invalidBackground: "请选择有效的背景图片。",
    runnerHome: "RUNNER HUB",
    classicSearchPlaceholder: "Ask Google",
    aiMode: "AI Mode",
    panelEyebrow: "SURFACE DATA // ACTIVE PANEL",
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
    ready: "READY",
    searchPrefix: "QUERY",
    searchPlaceholder: "SEARCH GOOGLE OR ENTER URL",
    searchButton: "EXEC",
    clearSearchInput: "CLEAR INPUT",
    historyToggle: "HIST",
    searchHistory: "SEARCH HISTORY",
    relatedSearches: "RELATED SEARCHES",
    hideHistory: "HIDE",
    showHistory: "SHOW HISTORY",
    clearHistory: "CLEAR",
    noSearchHistory: "NO SEARCH HISTORY",
    noRelatedSearches: "TYPE TO SEE RELATED SEARCHES",
    historyLabel: "HISTORY",
    siteLabel: "SITE",
    clusterLabel: "CLUSTER",
    googleLabel: "GOOGLE",
    searchEngine: "SEARCH ENGINE",
    switchSearchEngine: "SWITCH SEARCH ENGINE",
    searchEngineDialogTitle: "SEARCH ENGINE",
    addSearchEngine: "ADD CUSTOM SEARCH ENGINE",
    editSearchEngine: "EDIT SEARCH ENGINE",
    newSearchEngine: "NEW",
    searchEngineName: "NAME",
    searchEngineShortcut: "SHORT CODE",
    searchEngineUrl: "SEARCH URL TEMPLATE",
    searchEngineUrlPlaceholder: "https://example.com/search?q={query}",
    searchEngineTemplateHelp: "Use {query} as the query placeholder. %s is also supported.",
    setSearchEngine: "USE",
    activeSearchEngine: "ACTIVE",
    builtinSearchEngine: "BUILT-IN",
    customSearchEngine: "CUSTOM",
    edit: "EDIT",
    invalidSearchEngine: "Enter a name and a valid http/https search URL with {query} or %s.",
    deleteSearchEngineConfirm: "Delete search engine \"{name}\"?",
    urlLabel: "URL",
    signal: "SIGNAL",
    clusters: "CLUSTERS",
    nativeHome: "CHROME NTP",
    customize: "CUSTOMIZE",
    customizeTitle: "CUSTOMIZE",
    appearanceTitle: "APPEARANCE",
    themeColorTitle: "THEME COLOR",
    customThemeColor: "CUSTOM COLOR",
    appearancePresets: "APPEARANCE PRESETS",
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
    resetAppearance: "RESET",
    invalidBackground: "Choose a valid background image.",
    runnerHome: "RUNNER HUB",
    classicSearchPlaceholder: "Ask Google",
    aiMode: "AI Mode",
    panelEyebrow: "SURFACE DATA // ACTIVE PANEL",
    editCluster: "EDIT CLUSTER",
    addNode: "ADD NODE",
    emptyState: "NO SHORTCUTS IN THIS CLUSTER.",
    addCategory: "ADD CLUSTER",
    editCategory: "EDIT CLUSTER",
    categoryName: "CLUSTER NAME",
    categoryIcon: "CLUSTER ICON",
    categoryIconPlaceholder: "AI / W / +",
    categoryIconImage: "IMAGE ICON",
    categoryIconImageCopy: "Upload a local image as this cluster icon.",
    uploadIcon: "UPLOAD",
    removeIcon: "REMOVE",
    invalidImage: "Choose a valid image file.",
    moveUp: "MOVE UP",
    moveDown: "MOVE DOWN",
    delete: "DELETE",
    cancel: "CANCEL",
    save: "SAVE",
    addShortcut: "ADD NODE",
    editShortcut: "EDIT NODE",
    shortcutTitle: "NAME (OPTIONAL)",
    shortcutUrl: "URL",
    shortcutCategory: "CLUSTER",
    autoIcon: "AUTO ICON",
    autoIconCopy: "The site icon is matched automatically from its URL.",
    refresh: "REFRESH",
    backupColor: "BACKUP COLOR",
    categoryNameRequired: "Enter a cluster name.",
    duplicateCategory: "This cluster name already exists.",
    autoShortcutTitle: "Site",
    invalidUrl: "Enter a valid URL.",
    chooseCategory: "Choose a cluster.",
    deleteShortcutConfirm: "Delete \"{title}\"?",
    deleteCategoryConfirm: "Delete \"{category}\"? Its nodes will move to \"{target}\"."
  }
};

const categoryTranslations = {
  "ai-tools": { zh: "AI 工具", en: "AI TOOLS" },
  social: { zh: "社媒平台", en: "SOCIAL" },
  common: { zh: "常用", en: "COMMON" },
  video: { zh: "视频创作", en: "VIDEO" },
  assets: { zh: "素材灵感", en: "ASSETS" },
  work: { zh: "工作后台", en: "WORK" },
  projects: { zh: "项目常用", en: "PROJECTS" },
  custom: { zh: "自定义", en: "CUSTOM" }
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
    label: { zh: "Runner", en: "Runner" },
    preview: "linear-gradient(90deg, rgba(216,255,61,.28) 0 1px, transparent 1px 22px), linear-gradient(135deg, #050604, #11180c 52%, #020303)"
  },
  {
    id: "stone",
    label: { zh: "岩壁", en: "Stone" },
    preview: "linear-gradient(165deg, #1a1c20 0 52%, #4a392e 53% 70%, #141516 71%)"
  },
  {
    id: "night",
    label: { zh: "深空", en: "Night" },
    preview: "radial-gradient(circle at 75% 26%, rgba(72,111,255,.42), transparent 32%), linear-gradient(135deg, #141522, #060713)"
  },
  {
    id: "aurora",
    label: { zh: "极光", en: "Aurora" },
    preview: "radial-gradient(circle at 20% 90%, rgba(108,240,255,.34), transparent 36%), radial-gradient(circle at 80% 18%, rgba(216,255,61,.28), transparent 34%), linear-gradient(135deg, #061211, #071c2b)"
  },
  {
    id: "ember",
    label: { zh: "余烬", en: "Ember" },
    preview: "radial-gradient(circle at 72% 76%, rgba(255,121,52,.42), transparent 34%), linear-gradient(135deg, #170807, #2a180b 52%, #060303)"
  },
  {
    id: "ocean",
    label: { zh: "海面", en: "Ocean" },
    preview: "radial-gradient(circle at 72% 18%, rgba(108,240,255,.32), transparent 28%), linear-gradient(135deg, #02131b, #083958 54%, #04101a)"
  },
  {
    id: "violet",
    label: { zh: "紫影", en: "Violet" },
    preview: "radial-gradient(circle at 28% 76%, rgba(119,88,255,.38), transparent 32%), linear-gradient(135deg, #110d22, #030407)"
  },
  {
    id: "glass",
    label: { zh: "玻璃", en: "Glass" },
    preview: "linear-gradient(135deg, rgba(108,240,255,.24), transparent 32%), linear-gradient(45deg, #111827, #16313a 48%, #2d1740)"
  },
  {
    id: "plain",
    label: { zh: "纯色", en: "Plain" },
    preview: "linear-gradient(135deg, #080a08, #151811)"
  }
];

function t(key, vars = {}) {
  let text = messages[state.locale]?.[key] || messages.en[key] || key;
  Object.entries(vars).forEach(([name, value]) => {
    text = text.replace(`{${name}}`, value);
  });
  return text;
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

async function writeData() {
  const data = clone(state);

  if (!hasChromeStorage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return;
  }

  await new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: data }, resolve);
  });
}

async function boot() {
  needsDataMigration = false;
  setDate();
  bindEvents();
  render();

  try {
    const saved = await readData();
    if (saved?.categories?.length && Array.isArray(saved.shortcuts)) {
      state = normalizeState(saved);
    }
  } catch {
    state = structuredClone(defaultData);
  }

  if (needsDataMigration) {
    await writeData();
  }

  render();
  scheduleBackgroundStorageOptimization();
}

function normalizeState(data) {
  const locale = data.locale === "en" ? "en" : "zh";
  const mode = data.mode === "classic" ? "classic" : "runner";
  const searchEngines = normalizeSearchEngines(data.searchEngines);
  const activeSearchEngineId = searchEngines.some((engine) => engine.id === data.activeSearchEngineId)
    ? data.activeSearchEngineId
    : "google";
  const appearance = normalizeAppearance(data.appearance);
  const appearancePresets = normalizeAppearancePresets(data.appearancePresets, appearance.customBackgroundImages);
  const activeAppearancePresetId = appearancePresets.some((preset) => preset.id === data.activeAppearancePresetId)
    ? data.activeAppearancePresetId
    : "";
  const searchHistory = normalizeSearchHistory(data.searchHistory);
  const showSearchHistory = data.showSearchHistory !== false;
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
      iconUrl: shortcut.iconUrl || ""
    }));
  const commonShortcutsSeeded = data.commonShortcutsSeeded === true;
  if (!commonShortcutsSeeded && shortcuts.filter((shortcut) => shortcut.categoryId === common.id).length === 0) {
    shortcuts = shortcuts.concat(seedCommonShortcuts(common.id, shortcuts));
    needsDataMigration = true;
  }

  const activeCategoryId = categoryIds.has(data.activeCategoryId) ? data.activeCategoryId : categories[0].id;
  return {
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
  return {
    theme,
    background: background === "custom" && !activeCustomBackgroundId ? "runner-grid" : background,
    customBackgroundImages,
    activeCustomBackgroundId,
    accentColor,
    backgroundOpacity,
    backgroundBlur,
    panelOpacity,
    panelBlur
  };
}

function normalizeAppearancePresets(presets = [], customBackgroundImages = []) {
  const normalized = [];
  (Array.isArray(presets) ? presets : []).forEach((preset, index) => {
    const item = normalizeAppearancePreset(preset, index, normalized, customBackgroundImages);
    if (item) normalized.push(item);
  });
  return normalized;
}

function normalizeAppearancePreset(preset, index, existingPresets = [], customBackgroundImages = []) {
  if (!preset || typeof preset !== "object") return null;
  const appearance = normalizeAppearance({
    ...preset.appearance,
    customBackgroundImages
  });
  return {
    id: uniqueAppearancePresetId(preset.id || createId(preset.name || `preset-${index + 1}`), existingPresets),
    name: normalizeAppearancePresetName(preset.name, index),
    appearance: compactAppearanceSnapshot(appearance),
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
    theme: appearance.theme,
    background: appearance.background,
    activeCustomBackgroundId: appearance.activeCustomBackgroundId || "",
    accentColor: appearance.accentColor,
    backgroundOpacity: appearance.backgroundOpacity,
    backgroundBlur: appearance.backgroundBlur,
    panelOpacity: appearance.panelOpacity,
    panelBlur: appearance.panelBlur
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
  els.appearanceOptions.addEventListener("click", onAppearanceOptionClick);
  els.themeColorOptions.addEventListener("click", onThemeColorOptionClick);
  els.themeColorInput.addEventListener("input", onThemeColorInput);
  els.saveAppearancePresetBtn.addEventListener("click", saveCurrentAppearancePreset);
  els.updateAppearancePresetBtn.addEventListener("click", updateActiveAppearancePreset);
  els.appearancePresetList.addEventListener("click", onAppearancePresetListClick);
  els.backgroundGrid.addEventListener("click", onBackgroundOptionClick);
  els.backgroundOpacityInput.addEventListener("input", onBackgroundOpacityInput);
  els.backgroundBlurInput.addEventListener("input", onBackgroundBlurInput);
  els.panelOpacityInput.addEventListener("input", onPanelOpacityInput);
  els.panelBlurInput.addEventListener("input", onPanelBlurInput);
  els.uploadBackgroundBtn.addEventListener("click", () => els.backgroundFileInput.click());
  els.removeBackgroundBtn.addEventListener("click", removeCustomBackground);
  els.resetAppearanceBtn.addEventListener("click", resetAppearance);
  els.backgroundFileInput.addEventListener("change", onBackgroundFileChange);
  els.languageToggleBtn.addEventListener("click", toggleLocale);
  els.classicLanguageBtn.addEventListener("click", toggleLocale);
  els.nativeHomeBtn.addEventListener("click", openNativeChromeHome);
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
        await recordCategoryUse(shortcut.categoryId);
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
  els.languageToggleBtn.textContent = state.locale === "en" ? "中文" : "EN";
  els.classicLanguageBtn.textContent = state.locale === "en" ? "中文" : "EN";
  els.nativeHomeBtn.textContent = t("nativeHome");
  els.customizeBtn.textContent = t("customize");
  els.runnerHomeBtn.textContent = t("runnerHome");
  els.searchPrefix.textContent = t("searchPrefix");
  els.searchInput.placeholder = t("searchPlaceholder");
  els.searchEngineBtn.title = t("switchSearchEngine");
  els.searchEngineBtn.setAttribute("aria-label", t("switchSearchEngine"));
  els.searchClearBtn.title = t("clearSearchInput");
  els.searchClearBtn.setAttribute("aria-label", t("clearSearchInput"));
  els.searchSubmitBtn.textContent = t("searchButton");
  els.historyToggleBtn.textContent = t("historyToggle");
  els.historyToggleBtn.title = state.showSearchHistory ? t("hideHistory") : t("showHistory");
  els.historyToggleBtn.setAttribute("aria-label", state.showSearchHistory ? t("hideHistory") : t("showHistory"));
  els.historyToggleBtn.setAttribute("aria-pressed", String(state.showSearchHistory));
  els.historyToggleBtn.classList.toggle("is-off", !state.showSearchHistory);
  els.searchPanelTitle.textContent = els.searchInput.value.trim() ? t("relatedSearches") : t("searchHistory");
  els.clearHistoryBtn.textContent = t("clearHistory");
  els.hideHistoryBtn.textContent = t("hideHistory");
  els.classicSearchInput.placeholder = t("classicSearchPlaceholder");
  els.classicSearchForm.querySelector("button").textContent = t("aiMode");
  els.signalLabel.textContent = t("signal");
  els.clustersStatLabel.textContent = t("clusters");
  els.clustersLabel.textContent = t("clusters");
  els.panelEyebrow.textContent = t("panelEyebrow");
  els.editCategoryBtn.textContent = t("editCluster");
  els.addShortcutBtn.textContent = t("addNode");
  els.emptyState.textContent = t("emptyState");
  els.moveCategoryUpBtn.textContent = t("moveUp");
  els.moveCategoryDownBtn.textContent = t("moveDown");
  els.deleteCategoryBtn.textContent = t("delete");
  els.cancelCategoryBtn.textContent = t("cancel");
  els.saveCategoryBtn.textContent = t("save");
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
  setLabelText(els.searchEngineNameInput, t("searchEngineName"));
  setLabelText(els.searchEngineShortcutInput, t("searchEngineShortcut"));
  setLabelText(els.searchEngineUrlInput, t("searchEngineUrl"));
  els.customizeDialogTitle.textContent = t("customizeTitle");
  els.appearanceTitle.textContent = t("appearanceTitle");
  els.themeColorTitle.textContent = t("themeColorTitle");
  els.customThemeColorLabel.textContent = t("customThemeColor");
  els.appearancePresetTitle.textContent = t("appearancePresets");
  els.saveAppearancePresetBtn.textContent = t("savePreset");
  els.updateAppearancePresetBtn.textContent = t("updatePreset");
  els.wallpaperTitle.textContent = t("wallpaperTitle");
  els.backgroundOpacityLabel.textContent = t("backgroundOpacity");
  els.backgroundBlurLabel.textContent = t("backgroundBlur");
  els.panelOpacityLabel.textContent = t("panelOpacity");
  els.panelBlurLabel.textContent = t("panelBlur");
  els.uploadBackgroundBtn.textContent = t("uploadBackground");
  els.removeBackgroundBtn.textContent = t("removeBackground");
  els.resetAppearanceBtn.textContent = t("resetAppearance");
  setLabelText(els.shortcutTitleInput, t("shortcutTitle"));
  setLabelText(els.shortcutUrlInput, t("shortcutUrl"));
  setLabelText(els.shortcutCategorySelect, t("shortcutCategory"));
  setLabelText(els.shortcutColorInput, t("backupColor"));
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
  const accentRgb = hexToRgb(appearance.accentColor);
  const activeCustomBackground = getActiveCustomBackground(appearance);
  document.body.dataset.theme = resolvedTheme;
  document.body.dataset.background = appearance.background;
  document.body.classList.toggle("has-custom-background", appearance.background === "custom" && Boolean(activeCustomBackground));
  document.body.style.setProperty("--accent", appearance.accentColor);
  document.body.style.setProperty("--line-hot", appearance.accentColor);
  document.body.style.setProperty("--accent-rgb", accentRgb.join(" "));
  document.body.style.setProperty("--line", `rgba(${accentRgb.join(", ")}, 0.25)`);
  document.body.style.setProperty("--custom-background-opacity", String(appearance.backgroundOpacity));
  document.body.style.setProperty("--custom-background-blur", `${appearance.backgroundBlur}px`);
  applyPanelVariables(appearance, resolvedTheme);

  if (activeCustomBackground) {
    document.body.style.setProperty("--custom-background-image", `url(${JSON.stringify(activeCustomBackground.image)})`);
  } else {
    document.body.style.removeProperty("--custom-background-image");
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

function systemTheme() {
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function openCustomizeDialog() {
  renderCustomizerControls();
  els.customizeDialog.showModal();
}

function renderCustomizerControls() {
  renderAppearanceOptions();
  renderThemeColorOptions();
  renderAppearancePresetControls();
  renderBackgroundOptions();
  renderBackgroundTuningControls();
  els.removeBackgroundBtn.hidden = !(state.appearance.background === "custom" && getActiveCustomBackground());
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
        <span class="appearance-preview ${mode.id}"></span>
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
        zh: `${t("customBackground")} ${index + 1}`,
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
  state.appearancePresets = normalizeAppearancePresets(state.appearancePresets, customBackgroundImages);
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
    ...orderedCategories().map((category) => {
      const count = state.shortcuts.filter((shortcut) => shortcut.categoryId === category.id).length;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-button";
      button.dataset.categoryId = category.id;
      button.title = state.locale === "en" ? "Right-click to edit, long-press to drag" : "右键编辑，长按拖动";
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
  els.searchEngineBtn.textContent = activeEngine.shortcut || activeEngine.name;
  els.searchEngineBtn.dataset.engineId = activeEngine.id;
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
  button.innerHTML = `<span></span><small></small>`;
  button.querySelector("span").textContent = item.value;
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

function relatedKeywordSuffixes(query) {
  const usesChinese = /[\u4e00-\u9fa5]/.test(query) || state.locale === "zh";
  const suffixes = usesChinese
    ? ["教程", "官网", "怎么用", "下载", "价格", "替代工具", "案例", "最新"]
    : ["official", "tutorial", "pricing", "alternatives", "download", "examples", "guide", "latest"];
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
  const defaultName = translation.zh;
  const englishName = translation.en;
  if (category.name !== defaultName && category.name !== englishName) return category.name;
  return translation[state.locale] || category.name;
}

function categoryIcon(category) {
  return normalizeCategoryIcon(category.icon) || defaultCategoryIcons[category.id] || initials(displayCategoryName(category));
}

function paintCategoryIcon(container, category) {
  container.classList.toggle("has-image", Boolean(category.iconImage));
  container.replaceChildren();
  if (category.iconImage) {
    const img = document.createElement("img");
    img.alt = "";
    img.decoding = "async";
    img.src = category.iconImage;
    img.addEventListener("error", () => {
      category.iconImage = "";
      paintCategoryIcon(container, category);
    });
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

function sortCategoriesByUsage() {
  const sorted = orderedCategories().sort((a, b) => {
    const useA = Number.isFinite(a.useCount) ? a.useCount : 0;
    const useB = Number.isFinite(b.useCount) ? b.useCount : 0;
    return useB - useA || a.order - b.order;
  });
  setCategoryOrder(sorted);
}

function renderShortcuts() {
  const shortcuts = state.shortcuts.filter((shortcut) => shortcut.categoryId === state.activeCategoryId);
  els.emptyState.hidden = shortcuts.length > 0;
  els.shortcutGrid.replaceChildren(...shortcuts.map(createShortcutCard));
}

function renderClassicShortcuts() {
  els.classicShortcutGrid.replaceChildren(...state.shortcuts.map(createClassicShortcut));
}

function createClassicShortcut(shortcut) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "classic-shortcut";
  button.addEventListener("click", async () => {
    await recordCategoryUse(shortcut.categoryId);
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
      await recordCategoryUse(shortcut.categoryId);
      window.location.href = shortcut.url;
    }
  });

  const icon = document.createElement("div");
  paintShortcutIcon(icon, shortcut);
  icon.title = state.locale === "en" ? "Hold 0.5s to drag" : "长按 0.5 秒拖动排序";

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
  edit.title = "编辑";
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
  img.src = candidates[0];
  img.addEventListener("error", () => {
    const nextIndex = Number(img.dataset.candidateIndex) + 1;
    if (nextIndex < candidates.length) {
      img.dataset.candidateIndex = String(nextIndex);
      img.src = candidates[nextIndex];
      return;
    }
    container.classList.add("icon-fallback");
  });

  container.replaceChildren(img, fallback);
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
  if (!confirm(t("deleteSearchEngineConfirm", { name: engine.name }))) return;
  state.searchEngines = state.searchEngines.filter((item) => item.id !== engineId);
  if (state.activeSearchEngineId === engineId) {
    state.activeSearchEngineId = "google";
  }
  await writeData();
  renderSearchEngineControls();
  renderSearchPanel();
}

async function saveCurrentAppearancePreset() {
  const defaultName = t("defaultPresetName", { number: state.appearancePresets.length + 1 });
  const nameInput = prompt(t("presetNamePrompt"), defaultName);
  if (nameInput === null) return;

  const preset = createAppearancePreset(normalizeAppearancePresetName(nameInput, state.appearancePresets.length));
  state.appearancePresets = normalizeAppearancePresets(
    state.appearancePresets.concat(preset),
    normalizeAppearance(state.appearance).customBackgroundImages
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
  preset.updatedAt = Date.now();
  state.appearancePresets = normalizeAppearancePresets(
    state.appearancePresets,
    normalizeAppearance(state.appearance).customBackgroundImages
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
  state.appearance = normalizeAppearance({
    ...currentAppearance,
    ...preset.appearance,
    customBackgroundImages: currentAppearance.customBackgroundImages
  });
  state.activeAppearancePresetId = preset.id;
  await writeData();
  render();
}

async function renameAppearancePreset(presetId) {
  const preset = state.appearancePresets.find((item) => item.id === presetId);
  if (!preset) return;
  const nameInput = prompt(t("presetNamePrompt"), preset.name);
  if (nameInput === null) return;
  preset.name = normalizeAppearancePresetName(nameInput, state.appearancePresets.indexOf(preset));
  preset.updatedAt = Date.now();
  await writeData();
  renderCustomizerControls();
}

async function deleteAppearancePreset(presetId) {
  const preset = state.appearancePresets.find((item) => item.id === presetId);
  if (!preset) return;
  if (!confirm(t("deletePresetConfirm", { name: preset.name }))) return;

  state.appearancePresets = state.appearancePresets.filter((item) => item.id !== presetId);
  if (state.activeAppearancePresetId === presetId) {
    state.activeAppearancePresetId = "";
  }
  await writeData();
  renderCustomizerControls();
}

async function onAppearanceOptionClick(event) {
  const button = event.target.closest("[data-theme]");
  if (!button) return;
  state.appearance.theme = button.dataset.theme;
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

async function onBackgroundFileChange(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  if (files.some((file) => !file.type.startsWith("image/"))) {
    alert(t("invalidBackground"));
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
    alert(t("invalidBackground"));
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

async function resetAppearance() {
  state.appearance = structuredClone(defaultData.appearance);
  await writeData();
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
  sortCategoriesByUsage();
  if (shouldWrite) {
    await writeData();
  }
}

async function toggleLocale() {
  state.locale = state.locale === "en" ? "zh" : "en";
  await writeData();
  render();
}

async function setMode(mode) {
  state.mode = mode;
  await writeData();
  render();
}

function openNativeChromeHome() {
  try {
    window.location.assign("chrome://new-tab-page/");
  } catch {
    setMode("classic");
    return;
  }

  window.setTimeout(() => {
    if (location.protocol === "chrome-extension:") {
      setMode("classic");
    }
  }, 180);
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
  els.moveCategoryUpBtn.hidden = !isEdit;
  els.moveCategoryDownBtn.hidden = !isEdit;
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
    const ok = confirm(t("deleteCategoryConfirm", {
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
    state.shortcuts.push({ id: createId(title), title, url, categoryId, color, iconUrl: "" });
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
  const ok = confirm(t("deleteShortcutConfirm", { title: shortcut.title }));
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
  state.showSearchHistory = !state.showSearchHistory;
  await writeData();
  render();
  if (state.showSearchHistory) showSearchHistoryPanel();
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

function showSearchHistoryPanel() {
  const query = els.searchInput.value.trim();
  if (!state.showSearchHistory || (!query && !state.searchHistory.length)) return;
  renderSearchPanel();
  els.searchHistoryPanel.hidden = false;
}

function hideSearchHistoryPanel() {
  els.searchHistoryPanel.hidden = true;
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
