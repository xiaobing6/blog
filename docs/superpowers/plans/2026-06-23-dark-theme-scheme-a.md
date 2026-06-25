# 深色主题方案 A（分层深灰）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将当前浅色高对比主题切换为"分层深灰"深色主题，通过三层结构（页面背景 + 内容卡片 + 文字）保证中间区域有足够对比度和层次感。

**Architecture:** 采用 CSS 变量集中管理颜色，所有组件从 `:root` 读取颜色变量。只需修改全局 CSS 变量 + 各组件中硬编码的颜色值，即可完成主题切换。关键设计：页面背景 `#121212`，内容卡片 `#1e1e1e`，主文字 `#f5f5f4`，形成清晰的三层结构。

**Tech Stack:** Astro 7 + 原生 CSS 变量 + Tailwind CSS 4（仅 Vite 插件方式引入）

---

## 文件结构总览

| 文件 | 改动类型 | 说明 |
|------|----------|------|
| `src/styles/global.css` | 修改 | 更新 `:root` 颜色变量、body 背景、prose 正文样式、代码块、引用块等 |
| `src/components/Header.astro` | 修改 | 头部背景、边框色 |
| `src/components/Footer.astro` | 修改 | 底部背景、边框色 |
| `src/pages/index.astro` | 修改 | 首页标题渐变、副按钮样式 |
| `src/pages/blog/index.astro` | 修改 | 文章卡片背景、边框、悬停阴影、标签样式 |
| `src/layouts/BlogPost.astro` | 修改 | 文章标签、hero 图片边框 |

---

### Task 1: 更新全局 CSS 变量与基础样式

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: 更新 `:root` 颜色变量**

将 `:root` 中的颜色变量替换为分层深灰方案：

```css
:root {
	--bg-primary: #121212;
	--bg-secondary: #1e1e1e;
	--text-primary: #f5f5f4;
	--text-secondary: #a8a29e;
	--text-muted: #78716c;
	--accent: #f97316;
	--accent-light: #fb923c;
	--border: #2e2e2e;
	--radius-sm: 6px;
	--radius-md: 12px;
	--radius-lg: 20px;

	--font-serif: "Noto Serif SC", "Source Han Serif SC", "STSong", "SimSun", serif;
	--font-sans: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif;
	--font-mono: "SF Mono", "Fira Code", "Consolas", monospace;
}
```

- [ ] **Step 2: 更新 body 背景渐变光晕**

将 `body::before` 的径向渐变换为深色调橙色光晕（降低不透明度，避免太亮）：

```css
body::before {
	content: '';
	position: fixed;
	inset: 0;
	z-index: -2;
	background:
		radial-gradient(ellipse 80% 50% at 50% -20%, rgba(249, 115, 22, 0.15), transparent),
		radial-gradient(ellipse 60% 40% at 20% 80%, rgba(251, 146, 60, 0.08), transparent);
	pointer-events: none;
}
```

- [ ] **Step 3: 更新噪点纹理不透明度**

`body::after` 的噪点不透明度从 `0.025` 提升到 `0.06`，在深色底上更有质感：

```css
body::after {
	content: '';
	position: fixed;
	inset: 0;
	z-index: -1;
	opacity: 0.06;
	background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
	pointer-events: none;
}
```

- [ ] **Step 4: 更新 .glass 毛玻璃类**

```css
.glass {
	background: rgba(30, 30, 30, 0.72);
	backdrop-filter: blur(12px);
	-webkit-backdrop-filter: blur(12px);
	border: 1px solid rgba(255, 255, 255, 0.06);
}
```

- [ ] **Step 5: 更新 prose 正文样式**

修改 `.prose` 区域中以下元素的颜色：

**引用块 blockquote：**
```css
.prose blockquote {
	margin: 2rem 0;
	padding: 1rem 1.5rem;
	border-left: 3px solid var(--accent);
	background: rgba(249, 115, 22, 0.08);
	border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
	font-style: italic;
	color: var(--text-secondary);
}
```

**行内代码 code：**
```css
.prose code {
	font-family: var(--font-mono);
	font-size: 0.9em;
	background: rgba(249, 115, 22, 0.12);
	padding: 0.15em 0.4em;
	border-radius: 4px;
	color: var(--accent-light);
}
```

**代码块 pre（更深的底，和卡片形成对比）：**
```css
.prose pre {
	background: #0a0a0a;
	color: #e4e4e7;
	padding: 1.25rem;
	border-radius: var(--radius-md);
	overflow-x: auto;
	margin: 1.5rem 0;
	border: 1px solid var(--border);
}
```

**链接下划线颜色：**
```css
.prose a {
	color: var(--accent);
	border-bottom: 1px solid rgba(249, 115, 22, 0.3);
	transition: border-color 0.2s ease, color 0.2s ease;
}

.prose a:hover {
	color: var(--accent-light);
	border-bottom-color: var(--accent);
}
```

- [ ] **Step 6: 验证无浅色硬编码颜色残留**

运行以下命令检查是否还有浅色硬编码残留：
```
grep -n "#fafaf9\|#ffffff\|#1c1917\|#57534e\|#e7e5e4\|rgba(0, 0, 0" src/styles/global.css
```
预期：无匹配（或只有代码注释中的）。

---

### Task 2: 更新 Header 组件

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: 修改 header 背景与边框**

将 header 的背景色从浅色调换为深色调毛玻璃：

```css
header {
	position: sticky;
	top: 0;
	z-index: 100;
	padding: 1rem 1.5rem;
	background: rgba(18, 18, 18, 0.75);
	backdrop-filter: blur(16px);
	-webkit-backdrop-filter: blur(16px);
	border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
```

- [ ] **Step 2: 检查无其他硬编码浅色**

检查 `Header.astro` 的 `<style>` 块中是否还有其他需要改的颜色。该文件其余颜色都使用 CSS 变量，无需改动。

---

### Task 3: 更新 Footer 组件

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: 修改 footer 背景与边框阴影**

```css
footer {
	width: 100%;
	padding: 3rem 1.5rem;
	background: var(--bg-secondary);
	border-top: 1px solid var(--border);
	margin-top: auto;
	box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.02);
}
```

其余文字颜色已使用 CSS 变量，无需改动。

---

### Task 4: 更新首页样式

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: 修改 h1 标题渐变**

深色主题下标题渐变从主白到次灰：

```css
h1 {
	font-size: 3.75rem;
	margin-bottom: 1.25rem;
	animation: fadeInUp 0.8s ease-out 0.1s both;
	background: linear-gradient(180deg, var(--text-primary) 0%, var(--text-secondary) 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}
```

- [ ] **Step 2: 修改副按钮样式**

`.btn-secondary` 的背景、边框从浅色调换为深色调：

```css
.btn-secondary {
	background: rgba(255, 255, 255, 0.04);
	color: var(--text-primary);
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-secondary:hover {
	background: rgba(255, 255, 255, 0.08);
	color: var(--text-primary);
	border-color: rgba(255, 255, 255, 0.15);
}
```

---

### Task 5: 更新博客列表页卡片与标签

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] **Step 1: 修改文章卡片背景与悬停效果**

卡片使用 `--bg-secondary`（`#1e1e1e`）作为背景，与页面 `#121212` 形成层次：

```css
.post-card {
	background: var(--bg-secondary);
	border: 1px solid var(--border);
	border-radius: var(--radius-md);
	overflow: hidden;
	transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.post-card:hover {
	transform: translateY(-4px);
	box-shadow:
		0 0 0 1px rgba(249, 115, 22, 0.1),
		0 20px 40px rgba(0, 0, 0, 0.4);
	border-color: rgba(249, 115, 22, 0.25);
}
```

- [ ] **Step 2: 修改标签样式**

```css
.post-tag {
	font-size: 0.8rem;
	padding: 0.35rem 0.75rem;
	background: rgba(255, 255, 255, 0.05);
	color: var(--text-secondary);
	border-radius: 9999px;
	border: 1px solid rgba(255, 255, 255, 0.06);
	transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.post-tag:hover {
	background: rgba(249, 115, 22, 0.12);
	color: var(--accent);
	border-color: rgba(249, 115, 22, 0.3);
}
```

---

### Task 6: 更新文章详情页布局

**Files:**
- Modify: `src/layouts/BlogPost.astro`

- [ ] **Step 1: 修改文章详情页标签样式**

```css
.post-tag {
	font-size: 0.8rem;
	padding: 0.35rem 0.85rem;
	background: rgba(255, 255, 255, 0.05);
	color: var(--text-secondary);
	border: 1px solid rgba(255, 255, 255, 0.06);
	border-radius: 9999px;
	transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.post-tag:hover {
	background: rgba(249, 115, 22, 0.12);
	color: var(--accent);
	border-color: rgba(249, 115, 22, 0.3);
}
```

- [ ] **Step 2: 修改 hero 图片边框**

```css
.hero-image img {
	width: 100%;
	border-radius: var(--radius-md);
	border: 1px solid rgba(255, 255, 255, 0.06);
}
```

---

### Task 7: 全项目颜色残留检查与构建验证

**Files:**
- Verify: 全项目 `src/` 目录

- [ ] **Step 1: 全局搜索浅色硬编码颜色**

运行命令搜索可能遗漏的浅色硬编码：
```
grep -rn "#fafaf9\|#ffffff\|#fefefe\|#1c1917\|#57534e\|#e7e5e4\|rgba(0, 0, 0, 0.0" src/
```
预期：无匹配（或仅注释中出现）。若有遗漏，对应修改。

- [ ] **Step 2: 构建验证**

```
$env:ASTRO_TELEMETRY_DISABLED=1; npx astro build
```
预期：`build Complete!`，所有页面生成成功，无报错。

---

## 自检清单

**Spec coverage:**
- ✅ 三层结构（页面背景 #121212 / 卡片 #1e1e1e / 文字 #f5f5f4）— Task 1
- ✅ 高对比度文字 — Task 1 变量
- ✅ 代码块与卡片有对比（代码块 #0a0a0a 比卡片更深）— Task 1 Step 5
- ✅ 中间区域（内容卡片）有明确层次感 — Task 5
- ✅ 所有组件适配深色主题 — Task 2-6

**Placeholder scan:** 无 TBD/TODO，所有步骤含具体代码。

**Type consistency:** 颜色变量名保持一致（`--bg-primary`, `--bg-secondary`, `--text-primary` 等），所有组件引用同一套变量名。
