# 博客管理后台使用指南

管理后台地址：<https://xiaobing6-blog.pages.dev/admin/>

后台采用 Sveltia CMS，通过 GitHub API 修改仓库中的 Markdown、JSON 和图片文件。每次保存都有 Git 提交记录，Cloudflare Pages 会在 GitHub 收到提交后自动重新部署，无需在本地修改源码。

## 后台可以维护什么

- 文章：新建、编辑、删除、草稿/发布、首页推荐、分类、标签、封面图和 Markdown 正文。
- 项目：项目简介、角色、技术栈、成果、在线地址、源码地址和相关文章。
- 个人资料：姓名、身份定位、首页介绍、当前重点、技能分组和公开链接。
- 图片：上传到 `public/uploads`，可用作封面或插入正文。

`.mdx` 文件可能包含 Astro 组件和 JavaScript，只保留源码维护，后台默认只管理普通 `.md` 文章，避免可视化编辑器破坏组件语法。

## 日常发布流程

1. 打开后台并登录。
2. 进入“文章”，点击新建。
3. 在右上角的三点菜单中检查 URL 标识（slug）。建议使用简短的小写英文，例如 `astro-content-collections`。
4. 填写标题、摘要、日期、分类、标签、封面和正文。
5. 新文章默认是草稿。草稿可以保存，但不会出现在公开页面、RSS、Sitemap 或站内搜索中。
6. 准备公开时关闭“草稿”，再保存。
7. 保存会提交到 GitHub 的 `master` 分支，随后等待 Cloudflare Pages 自动完成部署。

发布后如果发现问题，可以先重新开启“草稿”；如需恢复旧版本，可在 GitHub 提交历史中回退对应文件。

## 登录方式

### 方式一：GitHub Access Token（现在即可使用）

这是个人使用最快的方式。首次登录时按后台提示创建 GitHub fine-grained personal access token：

- Repository access 只选择 `xiaobing6/blog`。
- Repository permissions 中为 Contents 选择 Read and write。
- 令牌由浏览器保存，请只在自己的设备上使用，不要截图、发送或提交到仓库。
- 使用公共电脑后务必从后台退出，并在 GitHub 中撤销令牌。

官方说明：<https://sveltiacms.app/en/docs/backends/github>

### 方式二：仅限本人账号的 GitHub OAuth（推荐的最终状态）

项目在 `workers/cms-auth` 中提供了基于官方认证器的定制 Worker。它会在 OAuth 完成后调用 GitHub 用户接口核对账号，只有 `xiaobing6` 才会收到令牌；其他账号会被拒绝。白名单缺失或 GitHub 校验失败时也会默认拒绝。

1. 测试并部署 Worker，记下生成的 `workers.dev` 地址：

   ```powershell
   cd workers/cms-auth
   npm test
   npm run deploy
   ```

2. 在 GitHub 的 Developer settings 中创建 OAuth App：
   - Homepage URL：`https://xiaobing6-blog.pages.dev/admin/`
   - Authorization callback URL：`<Worker 地址>/callback`
3. 在 `workers/cms-auth` 目录中把 OAuth 凭据写入 Worker Secret：

   ```powershell
   npx wrangler@4.110.0 secret put GITHUB_CLIENT_ID
   npx wrangler@4.110.0 secret put GITHUB_CLIENT_SECRET
   ```

4. `wrangler.toml` 已配置：
   - `ALLOWED_DOMAINS=xiaobing6-blog.pages.dev`
   - `ALLOWED_GITHUB_USERS=xiaobing6`
5. 在 `public/admin/config.yml` 的 `backend` 下加入 Worker 地址和 `auth_methods: [oauth]`。第二项会关闭 Access Token 登录，确保所有远程登录都必须经过账号白名单。
6. 提交并推送博客配置，Cloudflare Pages 部署完成后使用 GitHub 按钮登录。

Client Secret 只能保存在 Cloudflare Worker Secret 中，绝不能提交到仓库或发送到聊天中。完整命令也记录在 `workers/cms-auth/README.md`。

定制代码基于 [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth)，并保留其 MIT License。

## 内容与图片约定

- URL 标识发布后尽量不要修改，否则旧文章地址会失效。
- 封面建议为 2:1 横图，单张不超过 10 MB；实际建议压缩到 500 KB 以内。
- 分类用于较宽的主题，标签用于更具体的关键词。
- 只有少量最具代表性的文章或项目开启“首页推荐”。
- 删除内容会直接形成 Git 提交。误删可以通过 GitHub 历史恢复。
