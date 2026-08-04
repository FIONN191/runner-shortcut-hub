# Runner Shortcut Hub 扩展开关、书签导入与性能优化实施计划

设计依据：`docs/superpowers/specs/2026-08-05-extension-controls-bookmark-import-design.md`

## 任务 1：权限、结构与国际化入口

修改：

- `outputs/chrome-new-tab-dashboard-extension/manifest.json`
- `outputs/chrome-new-tab-dashboard-extension/newtab.html`
- `outputs/chrome-new-tab-dashboard-extension/app.js`

步骤：

1. 在 manifest 中加入 `bookmarks`、`management` 和 `unlimitedStorage`。
2. 将现有“Chrome 原版”按钮语义改为“关闭插件”。
3. 在 Customize 数据传输区增加书签导入按钮。
4. 增加书签导入预览模态框及所需元素引用。
5. 为新增标题、按钮、确认、状态、统计、错误、ARIA 和权限说明补齐中英翻译键。

验证：

- manifest 可被 JSON 解析。
- 新增 DOM ID 唯一且均能被脚本获取。
- 中英文翻译键集合一致。

## 任务 2：书签树读取与纯数据转换

修改：

- `outputs/chrome-new-tab-dashboard-extension/app.js`
- `tests/bookmark-import.test.cjs`

步骤：

1. 实现书签栏定位、一级文件夹分组和递归网站收集。
2. 实现 HTTP(S) 地址校验、标准化和稳定去重键。
3. 实现导入预览数据构建。
4. 实现候选状态构建：同名分类合并、根目录网站分类、顺序保持、自动标题和全局去重。
5. 返回新增分类、导入网站、重复和无效统计。
6. 导出最小测试接口，保持浏览器运行时 API 不变。

验证：

- 多层子文件夹递归导入。
- 排除其他书签根目录。
- 同名分类合并、根目录导入、重复和非法协议处理正确。
- 1000 个以上网站不会截断。

## 任务 3：导入预览、事务保存与反馈

修改：

- `outputs/chrome-new-tab-dashboard-extension/app.js`
- `outputs/chrome-new-tab-dashboard-extension/styles.css`
- `outputs/chrome-new-tab-dashboard-extension/styles/v2.css`
- `tests/bookmark-import.test.cjs`

步骤：

1. 点击按钮时读取书签树并打开预览。
2. 渲染默认全选的一级导入项、递归数量和空状态。
3. 未选择任何项目时禁用确认按钮。
4. 导入时克隆当前状态、构建候选值并单次写入 Storage。
5. 写入成功后替换内存状态、关闭预览并只渲染一次。
6. 写入失败时保留原状态并显示错误。
7. 导入期间锁定操作，防止重复提交。

验证：

- 模拟 API 读取失败、空书签栏和 Storage 写入失败。
- 导入结果统计与实际状态一致。
- 刷新后的数据读取路径兼容导入数据。

## 任务 4：真正关闭扩展

修改：

- `outputs/chrome-new-tab-dashboard-extension/app.js`
- `tests/extension-disable.test.cjs`
- `tests/migration-v2.test.cjs`

步骤：

1. 用现有确认模态框替换 `openNativeChromeHome()` 的跳转/仿 Chrome 回退逻辑。
2. 确认后只对 `chrome.runtime.id` 调用 `chrome.management.setEnabled(id, false)`。
3. 对 API 不可用、不可禁用、原生确认取消和其他异常显示本地化反馈。
4. 将旧数据中的 `mode: "classic"` 迁移为 Runner 模式。
5. 删除或停用内部仿 Chrome UI 的入口，保留兼容迁移所需的最小代码，避免破坏旧数据载入。

验证：

- API 只接收当前扩展 ID 和 `false`。
- 取消和失败时状态、页面和存储不变。
- 旧 classic 数据载入后进入 Runner 模式。

## 任务 5：动画与首屏性能优化

修改：

- `outputs/chrome-new-tab-dashboard-extension/app.js`
- `outputs/chrome-new-tab-dashboard-extension/styles/tokens.css`
- `outputs/chrome-new-tab-dashboard-extension/styles/v2.css`
- `outputs/chrome-new-tab-dashboard-extension/styles.css`
- `tests/theme-v2.test.cjs`
- `tests/interactions-v2.test.cjs`

步骤：

1. 移除顶部、工作区和页脚的整页入场动画与延迟。
2. 将常驻卡片和分类交互限制为短促的颜色、边框、透明度和轻量 transform。
3. 取消常驻表面的默认多层 `backdrop-filter`，只保留用户显式面板模糊路径。
4. 保持自定义背景模糊和 reduced-motion 支持。
5. 调整启动顺序，避免默认数据完整渲染后再对保存数据完整渲染。
6. 确保书签批量导入只触发一次保存和一次完整渲染。

验证：

- CSS 静态检查不再发现整页 `runner-enter` 动画。
- 页面仍保留清晰的 hover/focus/pressed 状态。
- 启动、搜索、分类、拖动、编辑和自定义面板测试通过。

## 任务 6：回归验证与交付

修改（如测试发现问题）：

- 仅限本计划涉及的扩展和测试文件。

步骤：

1. 运行 `node --test tests/*.test.cjs`。
2. 运行 manifest JSON、脚本语法和 `git diff --check` 检查。
3. 使用本地浏览器验证桌面与窄屏布局，确认书签预览不溢出。
4. 验证新增权限后扩展可加载。
5. 验证关闭按钮行为；由于禁用后自动化上下文会消失，记录 Chrome 原生确认和扩展状态作为证据。
6. 检查工作树，只提交本功能文件，不包含用户的 README 和截图改动。

完成标准：

- 设计文档中的自动测试和手动验收项目全部通过，或明确记录无法自动验证的 Chrome 原生交互。
- 不修改 Chrome 书签内容。
- 不丢失现有 Runner 数据和功能。
