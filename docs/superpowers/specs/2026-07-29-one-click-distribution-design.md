# FIONN191 全仓库一键分发设计

**日期：** 2026-07-29  
**状态：** 已确认  
**适用范围：** `FIONN191` 账号下现有仓库及以后创建的项目

## 1. 目标

让普通用户进入任一有可运行内容的 GitHub 仓库后，不需要克隆代码、安装开发依赖或执行构建命令，即可找到一个真实可用的主要入口：

- 网页与浏览器游戏：一键在线使用。
- macOS / Windows 软件：一键下载适合当前平台的安装包。
- Chrome 扩展：通过 Chrome Web Store 一键安装；商店发布前自动生成可提交和可测试的发布包。
- 尚无可运行内容的仓库：显示明确状态，不生成空安装包或失效按钮。

平台强制的安全确认仍然保留。项目不得使用脚本绕过 Chrome 扩展安全策略、macOS Gatekeeper、Windows SmartScreen、系统管理员确认或代码签名要求。

## 2. 已确认的方案

采用按项目类型自动发布的方案：

1. 每个仓库在 README 顶部放置与项目类型匹配的主要操作按钮。
2. GitHub Actions 自动构建、测试、打包和发布。
3. 网页项目部署到 GitHub Pages；不适合 Pages 的服务型项目使用已有正式站点或经过确认的托管平台。
4. 桌面软件通过 GitHub Releases 提供固定名称的安装包。
5. Chrome 扩展自动生成 Release ZIP 和 Chrome Web Store 提交 ZIP；获得商店条目后再显示商店安装按钮。
6. 创建公共仓库 `FIONN191/.github`，集中保存规范、按钮模板、发布检查清单和可复用工作流。
7. 在本机 Codex 全局 `AGENTS.md` 中记录“一键分发优先”规则，使以后由 Codex 创建或维护的项目默认遵守本规范。

## 3. 仓库分发矩阵

| 仓库 | 类型 | 主要入口 | 自动化 |
| --- | --- | --- | --- |
| `runner-shortcut-hub` | Chrome MV3 扩展 | Chrome Web Store；上线前提供 Release ZIP | 校验 Manifest、打包扩展、生成商店提交包和 Release |
| `I2P` | Chrome MV3 扩展 | Chrome Web Store；上线前提供 Release ZIP | 校验 Manifest、打包扩展、生成商店提交包和 Release |
| `rosiecut` | Python 桌面软件 | macOS DMG、Windows EXE | 复用现有构建工作流，统一产物名称和 README 入口 |
| `paircut` | Python 桌面软件 | macOS DMG、Windows EXE | 复用现有构建工作流，统一产物名称和 README 入口 |
| `TubeLabeler` | Swift macOS 软件 | Apple Silicon DMG | 复用现有 Release，补稳定下载入口与发布验证 |
| `cosfix` | Vite / Electron 桌面与网页项目 | 完成可运行版本后提供在线版、macOS 和 Windows 版 | 先验证当前实现；构建通过后启用 Pages / Release，不发布设计阶段空壳 |
| `marathon-strike` | Vite / Three.js 游戏及 Electron 壳 | 在线游玩；可选 macOS / Windows 版 | Pages 自动部署；桌面构建成功后创建 Release |
| `pixel-magic-edit-shop` | 静态网页游戏 | 在线游玩 | GitHub Pages 自动部署 |
| `oscillator-synth` | 静态网页工具 | 在线使用 | GitHub Pages 自动部署 |
| `fionnxanderleoportfolio` | Vite / Express 服务型网站 | 先使用 README 已有的 AI Studio 在线入口 | 验证运行时与密钥需求；正式托管完成前不把需要服务端的版本错误部署为纯 Pages |
| `https-www.fionnxanderleo.xyz-` | 仅 README 的占位仓库 | 暂无 | 写明状态，不创建失效入口 |
| `TEMP1` | 空仓库 | 暂无 | 加入未来发布规范，不创建空安装包 |

如果实施期间发现仓库默认分支上的实际项目类型与表格不同，以可运行代码为准，但必须保留“真实入口、不发布假按钮”的原则。

## 4. README 入口

有发布内容的仓库在标题和简介之后、详细安装说明之前提供显眼的操作区。按钮使用 shields.io 或普通 Markdown 链接，不依赖仓库页面中的脚本。

示例：

```md
[在线使用](https://FIONN191.github.io/example/)
[下载 macOS 版](https://github.com/FIONN191/example/releases/latest/download/Example-mac.dmg)
[下载 Windows 版](https://github.com/FIONN191/example/releases/latest/download/Example-win-x64.exe)
[安装 Chrome 扩展](https://chromewebstore.google.com/detail/EXTENSION_ID)
```

要求：

- 链接必须指向在线页面、固定名称的最新 Release 资产或正式商店条目。
- 中英双语 README 使用相同目标地址。
- 不把“克隆仓库”“加载已解压扩展”“运行 `npm install`”作为普通用户的主要入口。
- 开发者构建说明可以保留在主要入口之后。
- 商店条目、Release 或在线页面尚不存在时，不显示对应的可点击按钮。

## 5. 自动发布工作流

### 5.1 网页与游戏

- 推送到默认分支且网页构建、测试通过后部署 GitHub Pages。
- 静态项目直接发布站点文件；Vite 项目发布 `dist/`。
- 为 Vite 配置与仓库路径匹配的 `base`。
- 部署后执行 HTTP 可达性检查，失败则不更新 README 的正式入口。
- 需要服务端、私密密钥或持久化后端的项目不得伪装成纯静态 Pages 项目。

### 5.2 Chrome 扩展

- 从 `manifest.json` 读取版本号，并验证 Manifest V3、入口文件、图标和本地资源。
- 生成两个内容确定的 ZIP：
  - `项目名-v版本-chrome.zip`：GitHub Release 测试包。
  - `项目名-v版本-web-store.zip`：Chrome Web Store 提交包。
- ZIP 根目录直接包含 `manifest.json`，不得多包一层目录。
- Release 由版本标签或手动 `workflow_dispatch` 触发。
- 商店自动上传工作流只读取 GitHub Secrets，不在仓库中保存开发者令牌。
- 在没有 Chrome Web Store 条目 ID 和发布凭据时，只完成校验与打包，不显示虚假的“一键安装”按钮。

### 5.3 桌面软件

- 保留各项目现有 PyInstaller、Electron Builder 或 Swift 构建方式。
- 安装包使用固定资产名，使 `/releases/latest/download/...` 长期有效。
- macOS 与 Windows 分别在原生 Runner 上构建。
- 测试、类型检查或最小启动验证失败时，不创建正式 Release。
- 没有签名证书时明确标注“未签名”，不得自动关闭系统安全检查。
- 获得 Apple、Windows 签名凭据后，通过 GitHub Secrets 接入签名与公证步骤。

## 6. 集中模板仓库

创建公开仓库 `FIONN191/.github`，包含：

```text
.github/
├── workflows/
│   ├── reusable-pages.yml
│   ├── reusable-extension-release.yml
│   └── reusable-release-checks.yml
├── workflow-templates/
│   ├── deploy-static-pages.yml
│   ├── package-chrome-extension.yml
│   └── release-desktop-app.yml
├── README.md
├── ONE_CLICK_DISTRIBUTION.md
└── RELEASE_CHECKLIST.md
```

桌面构建差异较大，仓库内保留薄工作流；通用校验、Pages 部署和扩展打包优先调用集中工作流。集中模板升级不得在未经验证的情况下自动改变已有项目的发布行为。

## 7. 未来项目持久规则

本机 Codex 全局 `AGENTS.md` 新增以下约束：

1. 每个面向终端用户的项目必须设计一个不依赖开发环境的主要使用入口。
2. 网页优先提供在线版；桌面软件优先提供平台安装包；浏览器扩展优先提供官方商店入口。
3. README 顶部必须显示真实可用的一键入口。
4. 发布产物必须由 CI 可重复生成。
5. 不得用失效按钮、空安装包或静默绕过安全机制来满足表面验收。
6. 新项目完成前必须验证入口、产物名称和刷新后的可用性。

此规则只影响项目交付方式，不强制所有原型立刻发布。纯设计文档、实验仓库和空仓库可以标记“暂无可运行版本”。

## 8. 密钥与权限

可能需要但不得提交到 Git 的凭据包括：

- Chrome Web Store 扩展 ID、OAuth 客户端、刷新令牌。
- Apple Developer ID 证书、证书密码、公证账号信息。
- Windows 代码签名证书及密码。
- Vercel、Cloudflare 或其他服务型部署平台令牌。

工作流在缺少可选凭据时应降级为未签名构建或仅打包，不得输出包含秘密的日志。缺少发布所必需的凭据时应明确失败并说明所缺项目。

## 9. 错误处理与回滚

- 每个仓库独立修改、验证、提交和推送，一个仓库失败不阻塞已验证仓库。
- 每个仓库使用独立的 `feat/one-click-distribution` 分支；推送后等待 Actions 成功，再合并到默认分支。
- 不覆盖用户未提交的本地修改。
- 工作流使用最小权限；默认只读内容，需要发布时单独授予 `contents: write` 或 `pages: write`。
- Release 只在所有必需任务成功后创建。
- Pages 部署保留 GitHub 的历史 deployment，可回退到上一个成功版本。
- README 按钮只在目标地址验证成功后加入。
- 已有 Release 不删除、不覆盖；新版本使用新标签。

## 10. 验证标准

每个适用仓库至少完成：

1. 工作流 YAML 语法校验。
2. 项目现有测试、类型检查或构建命令通过。
3. 生成产物存在、非空且文件名稳定。
4. Chrome ZIP 根目录和 Manifest 校验通过。
5. 桌面安装包与目标平台匹配。
6. 在线版首次加载成功，关键静态资源无 404。
7. README 的主要按钮返回成功状态，并指向正确项目。
8. 中英双语 README 的入口一致。
9. 仓库中不存在密钥、令牌、证书或本机绝对路径。
10. GitHub Actions 最终运行结果可见且成功。

## 11. 实施顺序

1. 建立 `FIONN191/.github` 规范与模板。
2. 处理已有 Release 的 `rosiecut`、`paircut`、`TubeLabeler`。
3. 部署静态项目 `pixel-magic-edit-shop`、`oscillator-synth`。
4. 部署并验证 `marathon-strike` 在线版，再处理桌面构建。
5. 为 `runner-shortcut-hub`、`I2P` 添加扩展打包与商店准备流程。
6. 验证 `cosfix` 当前可运行程度，再启用对应入口。
7. 验证作品集运行时并选择真实在线入口。
8. 为占位仓库写明状态。
9. 写入本机 Codex 全局规则。
10. 逐仓库复核按钮、Actions、Release、Pages 和安全设置。
