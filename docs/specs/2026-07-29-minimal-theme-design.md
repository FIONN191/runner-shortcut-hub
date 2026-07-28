# Runner Shortcut Hub 简洁模式设计

日期：2026-07-29

状态：已确认

## 目标

在现有界面主题系统中新增第 4 个主题“简洁模式”，提供严格的 Photoshop 风格深灰界面。该主题去除所有彩色表达、装饰网格、扫描线、彩色阴影和壁纸干扰，并把用户可见的图标统一渲染为灰白色单色剪影。

简洁模式只改变渲染结果，不覆盖或删除用户已经保存的外观设置。用户切换回其他主题时，原来的壁纸、主题色和明暗模式必须立即恢复。

## 已确认的视觉规则

- 主题名称：简洁模式
- 英文名称：Minimal
- 主题 ID：`minimal`
- 主题编号：`MN-04`
- 固定使用 Photoshop 风格的深灰界面。
- 不响应“浅色”和“跟随系统”的视觉结果，但保留用户原来的外观模式值。
- 简洁模式下隐藏自定义壁纸和内置壁纸，不删除任何背景数据。
- 切换回其他主题后恢复原壁纸和原外观模式。
- 页面、侧栏、面板、卡片、按钮和弹窗只使用中性灰、黑、白。
- 选中、悬停、拖拽目标和焦点状态只使用灰白边框与灰度底色。
- 网站图标、分类图片图标、Chrome 原版快捷图标、搜索相关图标、编辑预览和新增预览统一显示为灰白色单色剪影。
- 文字型备用图标保持可读，但使用相同灰度体系。
- 不改变网站卡片、分类、搜索、拖拽、编辑、导入导出等交互逻辑。

## 架构

### 主题注册

在现有 `designThemes` 配置中增加：

```js
{
  id: "minimal",
  labelKey: "designThemeMinimal",
  copyKey: "designThemeMinimalCopy",
  code: "MN-04"
}
```

中英文翻译字典增加主题名称与说明。Customize 面板继续使用现有主题卡片渲染函数，不新增独立交互分支。

### 样式隔离

新增独立样式文件：

```text
styles/themes/minimal.css
```

所有规则限定在：

```css
html[data-theme="minimal"]
```

主题通过现有 `document.documentElement.dataset.theme` 生效，不修改页面结构，也不在组件中散落主题判断。

### 外观数据

`appearance.designTheme` 保存 `minimal`。现有外观预设、完整备份、导入和迁移逻辑已经通过主题白名单处理 `designTheme`，加入主题配置后即可复用。

简洁模式不会写入或替换以下数据：

- `appearance.theme`
- `appearance.background`
- `appearance.activeCustomBackgroundId`
- `appearance.customBackgroundImages`
- `appearance.accentColor`
- 背景不透明度与模糊参数

因此切换到其他主题时不需要恢复快照，不存在状态覆盖风险。

## 视觉令牌

简洁模式采用固定中性灰令牌，避免读取用户彩色主题值：

```css
--background-page: #161616;
--background-panel: #1f1f1f;
--background-card: #242424;
--background-hover: #2d2d2d;
--text-primary: #f0f0f0;
--text-secondary: #b8b8b8;
--text-muted: #858585;
--border-default: rgb(255 255 255 / 14%);
--border-strong: rgb(255 255 255 / 72%);
--action-primary: #d8d8d8;
--action-primary-hover: #f0f0f0;
--focus-ring: #ffffff;
```

基础变量 `--accent`、`--line-hot`、`--accent-cyan` 和相关 RGB 值在简洁主题作用域中覆盖为灰度，确保旧组件中依赖强调色的状态不会残留彩色。

## 背景行为

简洁模式固定显示纯深灰背景。

- 隐藏 `body.has-custom-background::before` 中的自定义图片。
- 清除内置背景的渐变、彩色光斑、网格和扫描线。
- 保留原有背景数据和 CSS 自定义属性，切换主题后继续使用。
- 弹窗遮罩可以保留透明度与模糊，但颜色必须为中性黑灰。

## 图标剪影

图标不修改源文件，不写回存储。图像加载后只读分析透明通道和四角底色，为元素增加以下渲染分类：

- 透明图标：保留透明通道，把所有可见像素压成统一灰白色。
- 深色不透明底图：增强为黑白轮廓，通过 `screen` 混合隐藏黑色底面，只显示浅色剪影。
- 浅色不透明底图：先反相，再使用相同的轮廓与混合处理。
- 无法读取像素的外部图标：使用高对比灰度回退，不中断图标加载。

实际数据检测表明，TikTok 等 favicon 使用完全不透明的方形底色；如果无条件压成单色，会变成无法识别的实心方块。上述分类保证透明 Logo 保持纯色剪影，同时让带底色 Logo 保留可识别轮廓。图标容器统一使用深灰背景和灰色边框。

像素检测结果仅保存在当前页面 DOM 类名中，不加入 Chrome Storage，不产生新的背景或图标数据，也不改变现有 favicon 候选顺序。

覆盖范围：

- `.shortcut-icon img`
- `.category-icon img`
- `.classic-shortcut .shortcut-icon img`
- 新增与编辑网站弹窗中的预览图标
- 分类编辑弹窗中的图片预览
- 尺寸与圆角实时预览中的图标

文字型图标不使用图像滤镜，直接覆盖为深灰底、浅灰字或浅灰底、深灰字，确保小尺寸下仍可读。

## 主题卡预览

Customize 面板新增第 4 张主题卡：

- 序号：`04`
- 代码：`MN-04`
- 中文：简洁模式
- 英文：Minimal
- 中文说明：严格灰度、纯色剪影与无干扰界面
- 英文说明：Strict grayscale, solid silhouettes, and distraction-free surfaces

预览图只使用黑、灰、白，不读取用户主题色。

## 兼容与错误处理

- 旧数据未包含 `minimal` 时行为不变。
- 导入包含 `minimal` 的外观预设时正常恢复。
- 在不认识 `minimal` 的旧版本中，现有规范化逻辑会回退到默认主题，不破坏其他数据。
- 图标加载失败时继续使用现有备用文字图标。
- 简洁主题不新增网络请求、脚本执行或存储权限。

## 测试与验收

自动测试：

1. `newtab.html` 正确加载 `styles/themes/minimal.css`。
2. `designThemes` 注册 `minimal`、中英文名称、说明和 `MN-04`。
3. `minimal.css` 所有主题规则均限定在 `html[data-theme="minimal"]`。
4. 透明、深色不透明、浅色不透明和读取失败的图标均进入正确的灰度剪影分支。
5. 简洁模式隐藏自定义背景，但不修改 `appearance.background` 和背景数据。
6. 外观预设与完整备份可保存和恢复 `minimal`。
7. 现有迁移、交互、导入导出和语法测试继续通过。

视觉验收：

1. 主页面、Customize 面板和所有弹窗无彩色残留。
2. 简洁模式始终呈现深灰界面。
3. 自定义壁纸不可见，切回其他主题后恢复。
4. 网站与分类图片图标显示为灰白色单色剪影。
5. 备用文字图标清晰可读。
6. 选中、悬停、焦点和拖拽反馈仍然清楚。
7. 桌面和窄屏布局无溢出、遮挡或文本截断。
8. 分类、快捷方式、排序、搜索和用户外观数据保持不变。
