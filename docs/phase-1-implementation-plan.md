# 第一批功能实施计划：个人介绍与技术能力展示

> 更新日期：2026-07-26  
> 关联文档：[个人介绍与技术博客功能候选清单](./blog-feature-backlog.md)  
> 目标版本：Phase 1  
> 技术基线：Astro 7、Content Collections、Markdown/MDX、Tailwind CSS 4、Cloudflare Pages

## 执行状态（2026-07-26）

第一批的工程能力已经实现并通过本地生产构建与浏览器回归；Phase 1 整体仍需真实内容和线上配置才能关闭。

| 状态         | 范围                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 已完成       | 统一资料与项目数据、公开文章过滤、首页/关于/项目页、文章阅读链路、SEO、亮暗主题、标签/分类/归档、Pagefind、RSS、检查与发布清单 |
| 代码已接入   | Cloudflare Web Analytics 条件加载；配置 `PUBLIC_CF_WEB_ANALYTICS_TOKEN` 后启用                                                 |
| 等待真实资料 | 额外 1–3 个代表项目、至少 2 篇代表文章、经历时间线、头像/所在地/邮箱（仅在作者确认公开后加入）                                 |
| 等待外部动作 | 将本次代码部署到 Cloudflare，并从公网复查主要路由、搜索、RSS、Sitemap 和分享卡片                                               |

本次没有为缺失资料创建占位经历、虚构项目或空联系方式。Task 3/4/9/10 中依赖这些资料或线上权限的条目保持未完成。

## 1. 目标

第一批改造完成后，一个第一次访问网站的人应该能够：

1. 在首页 30 秒内知道作者是谁、主要技术方向是什么。
2. 在 3 分钟内找到代表项目、代表文章和可验证的外部链接。
3. 顺畅阅读长篇技术文章，并能继续浏览相关内容。
4. 通过正确的搜索引擎和社交分享元数据识别作者与文章。
5. 在不误发草稿的前提下继续使用 Markdown/MDX 发布内容。

## 2. 第一批范围

第一批由三个连续迭代组成。每个迭代都必须可独立构建和部署。

### 迭代 A：个人身份与发布基础

- PROFILE-01 至 PROFILE-07：个人首页、技能、项目、经历、联系入口。
- CONTENT-01 至 CONTENT-04、CONTENT-13：草稿、未来日期、精选、分类和校验。
- DISCOVERY-01 至 DISCOVERY-03：首页文章和项目入口。
- SEO-01 至 SEO-04、SEO-08：个人与文章结构化数据、文章分享图修复。
- QUALITY-01、QUALITY-02、QUALITY-10：基础检查和发布清单。

### 迭代 B：技术文章阅读体验

- DISCOVERY-04、DISCOVERY-05：上一篇、下一篇和相关文章。
- READING-01 至 READING-04：阅读时长、目录、锚点和代码复制。
- UX-01 至 UX-05：主题切换与基础无障碍。

### 迭代 C：内容发现与反馈

- DISCOVERY-06 至 DISCOVERY-09：标签总览、分类、归档和全文搜索。
- OPS-01：Cloudflare Web Analytics。
- SEO-09：RSS 排序与字段补全。

## 3. 明确不在第一批的功能

- 评论、Newsletter、阅读量、点赞和 Webmention。
- 多语言、多作者、PWA 和离线阅读。
- Mermaid、数学公式、参考文献、图片灯箱等扩展写作能力。
- CMS、账号、权限、会员和付费内容。
- 动态生成 OG 图片；第一批先正确使用文章封面和默认分享图。
- 博客分页；现有文章量较少，先完成归档和搜索，达到约 15–20 篇后再启用。

## 4. 开始前需要准备的真实资料

实施时不得编造个人信息。开始首页与关于页改造前，需要准备：

- [ ] 公开姓名或常用昵称。
- [ ] 一句话身份定位和 2–3 句个人简介。
- [ ] 当前主要技术方向与正在学习的方向。
- [ ] 2–4 个代表项目：名称、目标、个人职责、技术栈、结果、代码/演示链接。
- [ ] 工作、学习或开源经历时间线。
- [ ] 头像或个人标识。
- [ ] GitHub、邮箱和其他确认公开的链接。
- [ ] 是否展示所在地、求职或合作状态。

资料未齐时允许先完成数据结构和组件，但页面不得上线虚构占位内容。

## 5. 实施任务

### Task 0：建立验证基线

**涉及文件**

- 修改：`package.json`
- 可能新增：格式化、检查相关配置文件
- 新增：`docs/release-checklist.md`

**步骤**

- [ ] 记录当前首页、关于页、博客列表、文章页、标签页、RSS 和 Sitemap 的构建结果。
- [ ] 增加 `check` 脚本，运行 Astro/TypeScript 检查。
- [ ] 增加统一的格式化和静态检查脚本。
- [ ] 创建发布检查清单，至少覆盖主要路由、404、RSS、Sitemap 和分享元数据。
- [ ] 确认构建前后现有公开 URL 不发生非计划变化。

**验收标准**

- `npm run check` 成功。
- `npm run build` 成功。
- 检查和格式化命令能在 Windows/CI 中非交互运行。

### Task 1：集中管理个人资料和站点配置

**涉及文件**

- 新增：`src/data/profile.ts`
- 新增：`src/data/projects.ts`，或使用独立的 `projects` Content Collection
- 修改：`src/consts.ts`
- 修改：`src/content.config.ts`

**数据设计**

- `profile`：姓名、短简介、详细简介、头像、角色、所在地、状态、邮箱和社交链接。
- `skills`：名称、分组、熟练度描述和证据链接；不使用主观百分比进度条。
- `experience`：时间、组织/项目、角色、摘要和链接。
- `projects`：名称、摘要、本人职责、技术栈、结果、封面、仓库、演示和相关文章。
- 文章新增：`draft`、`featured`、`category`。

**步骤**

- [ ] 为所有数据定义 TypeScript 类型或 Zod schema。
- [ ] 将 Header、Footer 和 SEO 中重复的作者信息改为读取统一配置。
- [ ] 为可选链接过滤空值，禁止渲染空按钮。
- [ ] 为现有文章补齐新增字段的安全默认值。

**验收标准**

- 个人资料只在一个数据源维护。
- 缺失可选资料不会导致构建失败或空白 UI。
- 非法项目链接、日期或文章 Frontmatter 会在构建时给出明确错误。

### Task 2：统一公开文章查询，阻止误发布

**涉及文件**

- 新增：`src/utils/posts.ts`
- 修改：`src/pages/blog/index.astro`
- 修改：`src/pages/blog/[...slug].astro`
- 修改：`src/pages/blog/tags/[tag].astro`
- 修改：`src/pages/rss.xml.js`
- 可能修改：`astro.config.mjs` 的 Sitemap 过滤配置

**步骤**

- [ ] 实现唯一的 `getPublishedPosts()`：生产环境过滤 `draft: true` 和未来日期，按发布日期倒序。
- [ ] 本地开发允许通过明确选项预览草稿，但默认列表应有清晰的草稿标识。
- [ ] 博客列表、详情静态路由、标签页、RSS、Sitemap 和后续搜索全部复用公开文章规则。
- [ ] 增加获取精选文章、相邻文章和相关文章的纯函数。
- [ ] 相关文章排序规则确定为：同系列优先，其次同分类，再按共同标签数量和发布日期。

**验收标准**

- 草稿和未来日期文章不出现在生产构建的 HTML、RSS、Sitemap 或 Pagefind 索引中。
- 所有公开文章按日期稳定排序。
- 同一篇文章不会推荐自身。

### Task 3：重建首页的信息层级

**涉及文件**

- 修改：`src/pages/index.astro`
- 新增：`src/components/home/ProfileHero.astro`
- 新增：`src/components/home/SkillSummary.astro`
- 新增：`src/components/home/FeaturedProjects.astro`
- 新增：`src/components/home/FeaturedPosts.astro`
- 新增：`src/components/SocialLinks.astro`

**页面顺序**

1. 姓名、身份定位、短简介。
2. “查看项目”“阅读文章”“联系我”三个主要行动入口。
3. 主要技术方向和当前关注内容。
4. 2–4 个精选项目。
5. 3–5 篇精选或最新文章。
6. 简短经历/可信度摘要与完整关于页入口。
7. GitHub、邮箱等联系入口。

**步骤**

- [ ] 首页内容从 `profile`、`projects` 和公开文章数据生成。
- [ ] CTA 文案具体，不使用“了解更多”这类脱离上下文的文字。
- [ ] 项目卡片必须展示本人职责或结果，不能只展示技术栈。
- [ ] 移动端首屏仍能看到身份定位和至少一个主要行动入口。

**验收标准**

- 不进入其他页面也能回答“是谁、擅长什么、做过什么、如何联系”。
- 首页没有模板占位文案、无效链接和示例项目。
- 页面关闭 JavaScript 后仍可浏览所有核心内容。

### Task 4：完善关于页和项目页

**涉及文件**

- 修改：`src/pages/about.astro`
- 新增：`src/pages/projects/index.astro`
- 可能新增：`src/pages/projects/[slug].astro`
- 新增：经历、技能和项目相关展示组件

**步骤**

- [ ] 关于页改为：个人摘要、技术方向、经历时间线、工作原则、当前关注、联系入口。
- [ ] 项目列表展示代表项目，不把所有练习仓库等权展示。
- [ ] 复杂项目提供详情页：背景、约束、职责、决策、结果、复盘、相关链接。
- [ ] 项目与相关文章双向关联。
- [ ] Header 增加“项目”入口，Footer 增加必要的社交和 RSS 入口。

**验收标准**

- 每项关键能力至少能链接到一个项目、文章或外部证明。
- 项目页明确区分团队成果和本人贡献。
- 页面不公开未授权的公司、客户或个人信息。

### Task 5：增强文章阅读与连续浏览

**涉及文件**

- 修改：`src/pages/blog/[...slug].astro`
- 修改：`src/layouts/BlogPost.astro`
- 新增：`src/components/TableOfContents.astro`
- 新增：`src/components/PostNavigation.astro`
- 新增：`src/components/RelatedPosts.astro`
- 新增：`src/components/CodeCopy.astro` 或等价脚本
- 新增：阅读时长相关 Remark 插件或工具

**步骤**

- [ ] 从渲染结果获取标题列表，生成二、三级目录。
- [ ] 目录在桌面端可固定显示，在移动端折叠；没有足够标题时不显示。
- [ ] 为标题提供可复制锚点并处理键盘焦点。
- [ ] 按中文与英文混合文本的合理规则计算阅读时长和字数。
- [ ] 文章底部增加上一篇、下一篇和最多 3 篇相关文章。
- [ ] 为代码块增加复制按钮，成功状态通过文字和可访问状态提示。
- [ ] 客户端脚本只用于目录状态、复制和主题切换，不把正文改造成大型前端应用。

**验收标准**

- 长文章可通过目录跳转，URL hash 可直接定位章节。
- 代码复制在桌面和移动端浏览器工作；无 JavaScript 时仍能阅读代码。
- 上下篇和相关文章只包含已公开文章。

### Task 6：补全个人与文章 SEO

**涉及文件**

- 修改：`src/components/BaseHead.astro`
- 新增：`src/components/StructuredData.astro`
- 修改：`src/layouts/BlogPost.astro`
- 修改：首页、关于页、项目页调用参数

**步骤**

- [ ] 为 `BaseHead` 增加页面类型、作者、发布日期、更新时间和图片参数。
- [ ] 文章页传入真实 `heroImage`；无封面时使用稳定的默认分享图。
- [ ] 文章页输出 `og:type=article` 及文章时间、作者和标签属性。
- [ ] 首页输出 `WebSite` 和 `Person` JSON-LD。
- [ ] 关于页输出 `ProfilePage` 和 `Person` JSON-LD。
- [ ] 文章页输出 `BlogPosting` JSON-LD。
- [ ] 所有结构化数据中的 URL 和图片使用绝对地址。
- [ ] 检查首页、关于页、项目页和至少两篇文章的分享预览。

**验收标准**

- 不同文章的分享标题、摘要和图片正确。
- JSON-LD 可以被结构化数据验证工具解析，没有虚构字段。
- Canonical 继续保持唯一且指向生产域名。

### Task 7：实现亮暗主题和基础无障碍

**涉及文件**

- 修改：`src/styles/global.css`
- 修改：`src/components/Header.astro`
- 新增：`src/components/ThemeToggle.astro`
- 修改：所有页面或抽取统一页面布局

**步骤**

- [ ] 将颜色整理为亮色、暗色两组语义变量。
- [ ] 首次访问遵循系统主题，手动选择后持久化。
- [ ] 在首屏渲染前应用已保存主题，避免闪烁。
- [ ] 增加“跳到正文”链接，并为主内容提供稳定目标。
- [ ] 为交互元素补充 `:focus-visible` 状态。
- [ ] 在 `prefers-reduced-motion: reduce` 下关闭平滑滚动和非必要动画。
- [ ] 验证两种主题下正文、代码、标签、卡片和表单对比度。

**验收标准**

- 系统主题、手动切换和刷新后的主题保持均正确。
- 键盘可以依次访问导航、主题按钮、正文链接和页脚链接。
- 减少动画模式下没有强制滚动或入场动画。

### Task 8：补充标签、分类、归档和搜索

**涉及文件**

- 新增：`src/pages/blog/tags/index.astro`
- 新增：`src/pages/blog/categories/index.astro`
- 新增：`src/pages/blog/categories/[category].astro`
- 新增：`src/pages/blog/archive.astro`
- 新增：`src/pages/search.astro`
- 新增：`src/components/Search.astro`
- 修改：`package.json`
- 可能新增：`pagefind.yml`

**步骤**

- [ ] 标签总览展示标签名称和公开文章数量。
- [ ] 分类页复用公开文章查询和统一文章卡片。
- [ ] 归档页按年份分组，并显示每年文章数量。
- [ ] 构建完成后运行 Pagefind，对 `dist/` 中的静态 HTML 建立索引。
- [ ] 搜索只索引主要内容，排除导航、页脚、404 和草稿。
- [ ] 搜索结果展示标题、摘要、分类/标签和命中片段。
- [ ] Header 提供搜索入口，键盘可访问；搜索不可用时不影响普通导航。

**验收标准**

- 搜索能够找到中文标题、正文和代码相关词汇。
- 搜索索引中不存在草稿或未来文章。
- 搜索构建产物可直接部署到 Cloudflare Pages，不依赖服务端运行时。

### Task 9：接入匿名统计并完善 RSS

**涉及范围**

- Cloudflare Web Analytics 控制台配置
- 可能修改：全局 Head 或 Cloudflare 注入设置
- 修改：`src/pages/rss.xml.js`
- 新增或修改：隐私说明

**步骤**

- [ ] 启用 Cloudflare Web Analytics，确认不重复注入脚本。
- [ ] 第一批只采集聚合页面访问数据，不做用户画像。
- [ ] RSS 按发布日期倒序，补充作者、分类和更新时间。
- [ ] 决定 RSS 输出摘要还是全文，并在文档中固定策略。
- [ ] 在页脚提供 RSS 链接；如果存在统计脚本，提供简短隐私说明。

**验收标准**

- 统计面板能看到真实线上访问，不影响静态页面渲染。
- RSS XML 合法且文章顺序正确。
- 隐私说明与实际加载的第三方服务一致。

### Task 10：回归验证与部署

**步骤**

- [ ] 运行 `npm run check`、静态检查和格式检查。
- [ ] 运行生产构建以及 Pagefind 索引。
- [ ] 按项目约定使用 `astro dev --background` 做本地交互检查，并用 `astro dev stop` 结束后台服务。
- [ ] 检查首页、关于、项目、博客、文章、标签、分类、归档、搜索和 404。
- [ ] 检查 RSS、Sitemap、robots.txt、Canonical、Open Graph 和 JSON-LD。
- [ ] 检查 360px 移动宽度、桌面宽度、键盘导航、亮暗主题和减少动画模式。
- [ ] 部署 Cloudflare 预览版本并检查关键链接。
- [ ] 上线后从公网验证主要路由、静态资源、RSS、Sitemap 和搜索索引均返回成功状态。
- [ ] 将完成的功能在 Backlog 中标记为已完成，并记录未完成项原因。

## 6. 实施顺序与依赖

```text
Task 0 验证基线
  └─ Task 1 统一资料与内容模型
      ├─ Task 2 公开文章过滤
      │   ├─ Task 3 首页
      │   ├─ Task 5 阅读体验
      │   └─ Task 8 内容发现与搜索
      ├─ Task 4 关于与项目
      └─ Task 6 SEO
Task 7 主题与无障碍可在 Task 3–6 稳定后统一适配
Task 9 统计与 RSS 在页面结构稳定后实施
Task 10 最终回归与部署
```

不要同时重写全部页面。推荐按 `Task 0 → 1 → 2 → 3/4 → 5/6 → 7 → 8 → 9 → 10` 逐步提交，每一步保持生产构建可用。

## 7. 第一批完成定义

满足以下条件才算 Phase 1 完成：

- [ ] 首页和关于页使用真实个人信息，没有 Starter 模板残留。
- [ ] 至少有 2 个真实代表项目和 3 篇可代表能力的技术文章被展示。
- [ ] 草稿和未来日期内容不会意外发布。
- [ ] 文章具有阅读时长、目录、锚点、代码复制、上下篇和相关文章。
- [ ] 首页、个人资料和文章均有正确的结构化数据与分享预览。
- [ ] 亮暗主题、键盘导航和减少动画模式可用。
- [ ] 标签、分类、归档和全文搜索可用且只包含公开内容。
- [ ] Cloudflare 上能够看到基础匿名访问数据。
- [ ] 检查、构建、主要页面和公网部署验证全部通过。

## 8. 技术参考

- [Astro 路由与分页](https://docs.astro.build/en/guides/routing/)
- [Astro 组件](https://docs.astro.build/en/basics/astro-components/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro 样式与 CSS](https://docs.astro.build/en/guides/styling/)
- [Astro 阅读时长方案](https://docs.astro.build/en/recipes/reading-time/)
- [Astro 代码高亮](https://docs.astro.build/en/guides/syntax-highlighting/)
- [Pagefind 文档](https://pagefind.app/docs/)

## 9. 与旧方案的关系

`docs/superpowers/plans/` 中的旧方案保留作为历史参考，其中部分任务已经完成，且文件路径与当前项目不完全一致。后续实施以本文档和功能候选清单为准；旧深色主题配色稿可以作为视觉探索输入，但不直接替代 Task 7 的系统主题与手动切换方案。
