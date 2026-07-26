# 发布检查清单

用于每次新增文章或准备部署前的快速自检。

## 内容

- [ ] 标题和摘要能准确说明文章解决的问题
- [ ] `pubDate`、`category`、`tags` 已填写
- [ ] 未完成内容保留 `draft: true`
- [ ] 需要首页重点展示时设置 `featured: true`
- [ ] 图片包含有意义的替代文本，装饰图使用空 `alt`
- [ ] 外部事实、引用和链接已复核

## 页面与阅读

- [ ] 桌面端和手机端标题没有溢出
- [ ] 目录锚点、代码复制、上下篇链接可用
- [ ] 标签、分类、归档和搜索可以找到文章
- [ ] 亮色、暗色主题都清晰可读
- [ ] 仅用键盘可以访问导航和主要操作

## 构建与部署

1. 运行 `npm run format:check`
2. 运行 `npm run check`
3. 运行 `npm run build`
4. 在 `dist/` 生成的 Pagefind 索引中测试搜索
5. 检查 RSS、Sitemap、robots.txt 和 404 页面
6. 部署后抽查首页、项目页、文章页和分享卡片

Cloudflare Web Analytics 已配置默认 Beacon Token；如需轮换，可在部署环境使用 `PUBLIC_CF_WEB_ANALYTICS_TOKEN` 覆盖。
