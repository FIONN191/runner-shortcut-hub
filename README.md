# Runner Shortcut Hub

Runner Shortcut Hub 是一个替代 Chrome 新标签页的分类快捷方式面板。它支持自定义网站、分类、搜索引擎和界面外观，并将用户数据保存在浏览器本地。

## 主要功能

- 使用分类管理大量网站快捷方式
- 长按拖动分类和网站卡片进行排序
- 根据网址自动匹配网站图标
- 支持自定义分类图标和上传本地图片
- 保存搜索历史并显示相关搜索建议
- 切换 Google、Bing、百度等搜索引擎
- 添加自定义搜索引擎
- 简体中文与 English 即时切换
- 自定义主题色、壁纸、不透明度和高斯模糊
- 独立调整图标、卡片、面板和按钮圆角
- 调整字体大小和卡片密度
- 保存、更新、导入和应用外观预设
- 一键切换至 Chrome 原版新标签页样式

## 本地安装

1. 在 Chrome 地址栏打开 `chrome://extensions`。
2. 开启右上角的“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择以下目录：

   ```text
   outputs/chrome-new-tab-dashboard-extension
   ```

5. 打开一个新的 Chrome 标签页。

## 更新扩展

代码更新后，返回 `chrome://extensions`，找到 Runner Shortcut Hub 并点击刷新按钮，然后重新打开新标签页。

## 数据存储

网站、分类、排序、搜索设置和外观预设主要保存在 `chrome.storage.local`。轻量级界面偏好同时写入 `localStorage`，用于提高恢复能力。

恢复默认外观只会重置语言、主题、圆角、壁纸、字体和布局设置，不会删除网站、分类或快捷方式排序。

## 项目目录

- `outputs/chrome-new-tab-dashboard-extension`：可直接加载的 Chrome 扩展源码
- `outputs/chrome-web-store-submission`：Chrome Web Store 上架材料和 ZIP 包
- `tests`：界面设置、国际化和预设导入测试
- `docs/superpowers/specs`：功能设计说明

## 运行测试

```bash
node tests/ui-settings.test.cjs
node tests/preset-import.test.cjs tests/fixtures/appearance-backup.json
node --check outputs/chrome-new-tab-dashboard-extension/app.js
```

## 当前版本

`0.5.0`
