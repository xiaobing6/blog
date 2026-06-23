# 博客优化计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 对现有 Astro + Markdown 博客进行整体检查和小幅优化，修复明显问题，提升可维护性与用户体验。

**Architecture：** 保持现有 Astro Content Collections + Tailwind CSS 架构不变，仅做局部改进，不引入重型依赖或重构整体结构。

**Tech Stack：** Astro 7、Tailwind CSS 4、Markdown/MDX、TypeScript

---

## 检查结论

当前博客已完成基础搭建，主要问题集中在：**站点配置未更新、部分页面语言属性错误、HTML 语义化不足、缺少 SEO 与博客常用功能（标签、404、robots.txt）**。

---

## Task 1: 修正站点基础配置

**Files:**
- Modify: [`astro.config.mjs`](file:///e:/code/Website/astro.config.mjs)
- Modify: [`src/consts.ts`](file:///e:/code/Website/src/consts.ts)

- [ ] **Step 1: 将 site 从占位域名改为可配置占位符**

  ```js
  // astro.config.mjs
  export default defineConfig({
    site: process.env.SITE_URL || 'https://localhost:4321',
    // ...
  });
  ```

- [ ] **Step 2: 在 consts.ts 中增加站点作者字段，供 Footer 使用**

  ```ts
  // src/consts.ts
  export const SITE_TITLE = '我的博客';
  export const SITE_DESCRIPTION = '用 Astro 搭建的个人练手博客';
  export const SITE_AUTHOR = '你的名字';
  ```

- [ ] **Step 3: 本地验证构建无报错**

  Run: `$env:ASTRO_TELEMETRY_DISABLED=1; npm run build`
  Expected: 构建成功，输出到 `dist/`

---

## Task 2: 统一页面语言属性与 HTML 语义

**Files:**
- Modify: [`src/pages/blog/index.astro`](file:///e:/code/Website/src/pages/blog/index.astro)
- Modify: [`src/pages/blog/[...slug].astro`](file:///e:/code/Website/src/pages/blog/[...slug].astro)
- Modify: [`src/layouts/BlogPost.astro`](file:///e:/code/Website/src/layouts/BlogPost.astro)

- [ ] **Step 1: 将所有 `<html lang="en">` 改为 `<html lang="zh-CN">`**

  受影响文件：`blog/index.astro`、`blog/[...slug].astro`、`BlogPost.astro`

- [ ] **Step 2: 在 BlogPost 的 `<article>` 内为标题区添加 `<header>` 标签**

  修改 [`src/layouts/BlogPost.astro`](file:///e:/code/Website/src/layouts/BlogPost.astro) 中 `class="title"` 的 div 为 `<header class="title">`

- [ ] **Step 3: 开发服务器中检查页面源码 lang 属性**

  Run: `$env:ASTRO_TELEMETRY_DISABLED=1; npm run dev`
  访问 http://localhost:4321/blog/ 并查看 `<html>` 标签。

---

## Task 3: 添加标签（tags）功能

**Files:**
- Modify: [`src/content.config.ts`](file:///e:/code/Website/src/content.config.ts)
- Modify: [`src/content/blog/my-first-post.md`](file:///e:/code/Website/src/content/blog/my-first-post.md)
- Create: [`src/pages/blog/tags/[tag].astro`](file:///e:/code/Website/src/pages/blog/tags/[tag].astro)
- Modify: [`src/pages/blog/index.astro`](file:///e:/code/Website/src/pages/blog/index.astro)

- [ ] **Step 1: 在内容 schema 中增加 tags 字段**

  ```ts
  // src/content.config.ts
  z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.optional(image()),
    tags: z.array(z.string()).default([]),
  });
  ```

- [ ] **Step 2: 为示例文章添加 tags frontmatter**

  ```yaml
  ---
  title: '我的第一篇 Astro 博客'
  description: '记录用 Astro 搭建博客的学习过程'
  pubDate: 'Jun 23 2026'
  heroImage: '../../assets/blog-placeholder-1.jpg'
  tags: ['astro', 'markdown', 'learning']
  ---
  ```

- [ ] **Step 3: 创建标签详情页**

  Create: [`src/pages/blog/tags/[tag].astro`](file:///e:/code/Website/src/pages/blog/tags/[tag].astro)

  ```astro
  ---
  import { getCollection } from 'astro:content';
  import BaseHead from '../../../components/BaseHead.astro';
  import Footer from '../../../components/Footer.astro';
  import Header from '../../../components/Header.astro';

  export async function getStaticPaths() {
    const posts = await getCollection('blog');
    const tags = [...new Set(posts.flatMap((post) => post.data.tags || []))];
    return tags.map((tag) => ({
      params: { tag },
      props: { tag },
    }));
  }

  const { tag } = Astro.props;
  const posts = (await getCollection('blog'))
    .filter((post) => post.data.tags?.includes(tag))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  ---

  <!doctype html>
  <html lang="zh-CN">
    <head>
      <BaseHead title={`标签: ${tag}`} description={`包含标签 ${tag} 的文章`} />
    </head>
    <body>
      <Header />
      <main>
        <h1>标签: {tag}</h1>
        <ul>
          {posts.map((post) => (
            <li>
              <a href={`/blog/${post.id}/`}>{post.data.title}</a>
              <span>{post.data.pubDate.toLocaleDateString('zh-CN')}</span>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </body>
  </html>
  ```

- [ ] **Step 4: 在博客列表页显示文章标签**

  在 [`src/pages/blog/index.astro`](file:///e:/code/Website/src/pages/blog/index.astro) 的文章链接下方添加：

  ```astro
  {post.data.tags?.map((tag) => (
    <a href={`/blog/tags/${tag}/`} class="tag">#{tag}</a>
  ))}
  ```

- [ ] **Step 5: 验证标签页可访问**

  访问 http://localhost:4321/blog/tags/astro/ 应显示对应文章。

---

## Task 4: 添加 404 页面与 robots.txt

**Files:**
- Create: [`src/pages/404.astro`](file:///e:/code/Website/src/pages/404.astro)
- Create: [`public/robots.txt`](file:///e:/code/Website/public/robots.txt)

- [ ] **Step 1: 创建 404 页面**

  ```astro
  ---
  import BaseHead from '../components/BaseHead.astro';
  import Footer from '../components/Footer.astro';
  import Header from '../components/Header.astro';
  import { SITE_TITLE } from '../consts';
  ---

  <!doctype html>
  <html lang="zh-CN">
    <head>
      <BaseHead title={`页面未找到 | ${SITE_TITLE}`} description="页面不存在" />
    </head>
    <body>
      <Header />
      <main class="text-center py-20">
        <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p class="text-xl text-gray-600 mb-8">页面不存在</p>
        <a href="/" class="text-blue-600 hover:underline">返回首页</a>
      </main>
      <Footer />
    </body>
  </html>
  ```

- [ ] **Step 2: 创建 robots.txt**

  ```txt
  User-agent: *
  Allow: /

  Sitemap: https://localhost:4321/sitemap-index.xml
  ```

  部署前需将 Sitemap URL 替换为真实域名。

- [ ] **Step 3: 构建验证**

  Run: `$env:ASTRO_TELEMETRY_DISABLED=1; npm run build`
  Expected: `dist/404.html` 与 `dist/robots.txt` 存在

---

## Task 5: 清理模板默认内容与社交链接

**Files:**
- Modify: [`src/components/Footer.astro`](file:///e:/code/Website/src/components/Footer.astro)
- Modify: [`src/components/Header.astro`](file:///e:/code/Website/src/components/Header.astro)
- Modify: [`src/pages/about.astro`](file:///e:/code/Website/src/pages/about.astro)

- [ ] **Step 1: 移除 Header 中指向 Astro 官方的社交图标**

  将 Header 的 `social-links` 改为空 div 或删除该 div。

- [ ] **Step 2: 简化 Footer，使用 consts.ts 中的作者名**

  ```astro
  ---
  import { SITE_AUTHOR } from '../consts';
  const today = new Date();
  ---
  <footer>
    &copy; {today.getFullYear()} {SITE_AUTHOR}. 保留所有权利.
  </footer>
  ```

- [ ] **Step 3: 修复 about.astro 的日期写法**

  将 `pubDate={new Date('2026年6月23日')}` 改为 `pubDate={new Date('2026-06-23')}`

---

## Task 6: 可选增强（Nice-to-Have）

**Files:**
- Create: [`src/components/ThemeToggle.astro`](file:///e:/code/Website/src/components/ThemeToggle.astro)
- Modify: [`src/components/Header.astro`](file:///e:/code/Website/src/components/Header.astro)

- [ ] **Step 1: 添加暗黑模式切换按钮**

  使用 Tailwind 的 `dark:` 修饰符和 localStorage 实现，不引入额外依赖。

- [ ] **Step 2: 在 Header 右侧嵌入切换按钮**

  ```astro
  <ThemeToggle />
  ```

---

## 优先级建议

1. **先做 Task 1、2、5**：修复基础配置与模板残留，影响 correctness
2. **再做 Task 4**：SEO 与 404，上线前必须
3. **最后做 Task 3、6**：功能增强，可后续迭代

---

## 验证清单

- [ ] `npm run build` 成功
- [ ] 首页、博客列表、文章详情、标签页、404 页面均可正常访问
- [ ] 所有页面 `<html lang="zh-CN">`
- [ ] 文章标签可点击并正确筛选
