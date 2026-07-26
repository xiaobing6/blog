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

### 方式二：GitHub OAuth（推荐的最终状态）

OAuth 登录不需要你在浏览器里手工管理 Token，需要一次性部署 Sveltia CMS Authenticator：

1. 在 Cloudflare Workers 部署 <https://github.com/sveltia/sveltia-cms-auth>，记下 Worker 地址。
2. 在 GitHub 的 Developer settings 中创建 OAuth App，Authorization callback URL 填写 `<Worker 地址>/callback`。
3. 在 Worker 的 Settings → Variables 中配置：
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`（必须加密）
   - `ALLOWED_DOMAINS=xiaobing6-blog.pages.dev`
4. 在 `public/admin/config.yml` 的 `backend` 下取消 `base_url` 注释并替换成 Worker 地址。
5. 提交并推送，Cloudflare Pages 部署完成后即可使用 GitHub 按钮登录。

Client Secret 只能保存在 Cloudflare Worker 的加密变量里，绝不能写入 `.env` 后提交，也不能发到聊天中。

OAuth 部署的官方步骤：<https://github.com/sveltia/sveltia-cms-auth#how-to-use-it>

## 内容与图片约定

- URL 标识发布后尽量不要修改，否则旧文章地址会失效。
- 封面建议为 2:1 横图，单张不超过 10 MB；实际建议压缩到 500 KB 以内。
- 分类用于较宽的主题，标签用于更具体的关键词。
- 只有少量最具代表性的文章或项目开启“首页推荐”。
- 删除内容会直接形成 Git 提交。误删可以通过 GitHub 历史恢复。
