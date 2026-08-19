# Google Drive 主题预设合并设计

## 目标

在 Runner Shortcut Hub 的主题预设区域增加“拉取（合并）”和“上传（合并）”入口。用户完成一次 Google 授权后，可以在本地预设与 Google Drive 云端预设之间双向合并，同时保留现有的本地导入、导出、保存和更新功能。

## 发布与授权前提

- 先在 Chrome Web Store 创建未发布草稿并取得永久扩展 ID。
- 在 Google Cloud 项目中启用 Google Drive API。
- 创建绑定永久扩展 ID 的 Chrome Extension OAuth Client ID。
- Manifest V3 增加 `identity` 权限、OAuth Client ID 和 `https://www.googleapis.com/auth/drive.file` scope。
- 第一次点击云端按钮时才调用 `chrome.identity.getAuthToken({ interactive: true })`，不在扩展启动时主动弹出授权。
- `drive.file` 只允许 Runner 管理由自身创建或由用户明确交给它的文件，不申请整个 Drive 的读写权限。

## Google Drive 存储结构

Runner 在“我的云端硬盘”根目录创建一个用户可见的 `Runner Shortcut Hub` 文件夹，并在其中维护一个 `appearance-presets.json` 文件。文件沿用现有主题预设 envelope：

- `type: runner-shortcut-hub-appearance-preset`
- `version: 1`
- `exportedAt`
- `locale`
- `activePresetId`
- `presets`
- `backgrounds`

文件夹和文件都由 Runner 创建，因此可在最小的 `drive.file` scope 下查找、读取和更新。查找时同时校验名称、父目录和 MIME 类型；若出现多个历史副本，选择最近修改的有效文件，后续上传更新该文件。

## 用户界面

在现有主题预设操作区增加两个按钮：

- `拉取（合并）`：从 Google Drive 读取云端文件并合并到本地。
- `上传（合并）`：读取云端文件，将本地和云端内容合并后写回 Google Drive。

按钮使用本地内置 SVG 图标，不加载远程图标或脚本。进行网络操作时禁用两个按钮并显示明确状态。现有“导入预设”“保存为预设”“更新当前预设”“导出全部预设”保持不变。

首次点击云端按钮时显示用途说明后触发 Google 授权。用户已登录 Google Drive 并不代表已经授权 Runner；Chrome 仍会显示一次 Google OAuth 同意界面。

## 合并规则

合并以稳定的预设 ID 为主键：

1. 只存在一侧的预设直接保留。
2. 两侧 ID 相同且内容相同，只保留一份。
3. 两侧 ID 相同但内容不同，`updatedAt` 较新的版本覆盖较旧版本。
4. `updatedAt` 相同但内容不同，上传时以本地版本为准，拉取时以云端版本为准。
5. ID 不同但名称相同的预设都保留，不自动改名。
6. 自定义壁纸按稳定 ID 合并；同 ID 冲突时跟随所选预设来源。未被任何合并后预设引用的壁纸不上传。
7. 合并操作不传播删除：任何一侧独有的预设都不会因为另一侧缺失而删除。

拉取成功后写入本地存储，但不自动应用任何预设。上传成功后不改变当前本地外观。云端文件不存在时，上传会创建；拉取则提示云端暂无预设且不改变本地数据。

## 组件边界

- `appearance preset envelope`：复用现有导入校验、迁移、清洗与壁纸处理逻辑。
- `preset merge`：纯函数，接收本地和云端 envelope、冲突优先方向，返回确定性的合并结果。
- `Google identity`：只负责取得和刷新 access token；401 时移除缓存 token 并重试一次。
- `Drive client`：只负责查找/创建文件夹、查找/下载/创建/更新 JSON 文件。
- `UI controller`：负责按钮忙碌状态、授权触发、成功/失败提示和调用本地写入。

Google API 调用使用平台 `fetch`，不引入远程 SDK、远程脚本或动态代码。

## 错误与安全处理

- 未配置 OAuth Client ID：云端按钮不可用并显示“云端同步尚未配置”。
- 用户取消授权：不修改本地或云端数据。
- 401：清除缓存 token，重新获取一次；仍失败则停止。
- 403：提示 Drive API/权限配置问题，不扩大 scope。
- 离线、超时、配额错误：保持两侧原数据不变并允许重试。
- 云端 JSON 超过 5 MB、格式错误或版本不兼容：拒绝合并。
- 上传采用先读取、合并、再更新的流程；更新前复查云端 `modifiedTime`，发现并发修改时重新拉取并合并一次，避免静默覆盖。
- 日志和提示不输出 access token、OAuth 响应或用户文件内容。

## 测试与验收

- 单元测试覆盖：空云端、单侧独有、相同 ID 新旧版本、时间相同时的方向优先、同名不同 ID、壁纸去重、无删除传播和损坏 envelope。
- Drive client 测试覆盖：文件夹/文件不存在、创建、读取、更新、401 重试、403、并发冲突和响应体过大。
- UI 测试覆盖：中英文文案、按钮顺序、忙碌禁用、未配置状态和错误提示。
- Manifest 测试覆盖：`identity`、`drive.file`、固定 OAuth Client ID；CSP 继续保持 `script-src 'self'`。
- 对最终 Chrome Web Store ZIP 再次扫描远程托管代码、外部 URL 和权限声明。
- 手工验收：新账号首次授权；上传后在 Drive 网页看到文件夹和 JSON；另一台 Chrome 拉取后获得预设；本地/云端冲突按规则合并；取消授权或断网不丢数据。

## 不在本次范围

- 自动后台同步、定时同步或实时监听 Drive 变更。
- 多个云端文件、共享文件夹、团队盘或公开分享链接。
- 同步网站快捷方式、分类、搜索历史或完整数据备份。
- 删除云端文件、注销 Google 账号或管理其他 Drive 文件。

## 官方依据

- Chrome Identity API: https://developer.chrome.com/docs/extensions/reference/api/identity
- Google Drive app data and file storage overview: https://developers.google.com/drive/api/guides/about-sdk
- Google Drive scopes: https://developers.google.com/drive/api/guides/api-specific-auth
