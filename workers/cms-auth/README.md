# 博客 CMS OAuth Worker

这是基于 [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) 的轻量定制版本。除官方的域名检查、CSRF 防护和 OAuth 授权码交换外，它还会在返回令牌前读取 GitHub 当前用户，并只允许 `ALLOWED_GITHUB_USERS` 中的账号登录。

当前白名单：

- GitHub 用户名：`xiaobing6`
- 调用域名：`xiaobing6-blog.pages.dev`

如果账号不匹配、白名单缺失或 GitHub 用户校验失败，Worker 会拒绝登录并且不会把 OAuth Token 返回给 CMS。

## 测试

```powershell
cd workers/cms-auth
npm test
```

## 首次部署

1. 部署 Worker，获得 `workers.dev` 地址：

   ```powershell
   cd workers/cms-auth
   npm run deploy
   ```

2. 在 GitHub → Settings → Developer settings → OAuth Apps 创建应用：

   - Homepage URL：`https://xiaobing6-blog.pages.dev/admin/`
   - Authorization callback URL：`https://<Worker 地址>/callback`

3. 将 OAuth 凭据写入 Worker Secret。不要把值写进仓库：

   ```powershell
   npx wrangler@4.110.0 secret put GITHUB_CLIENT_ID
   npx wrangler@4.110.0 secret put GITHUB_CLIENT_SECRET
   ```

4. 确认 Worker 的 Variables 中包含：

   - `ALLOWED_DOMAINS=xiaobing6-blog.pages.dev`
   - `ALLOWED_GITHUB_USERS=xiaobing6`

5. 在博客的 `public/admin/config.yml` 中启用 Worker，并只保留 OAuth：

   ```yaml
   backend:
     name: github
     repo: xiaobing6/blog
     branch: master
     base_url: https://<Worker 地址>
     auth_methods: [oauth]
   ```

6. 提交并推送博客配置，等待 Cloudflare Pages 重新部署。

## 更新

上游认证器升级时，应重新对照官方 `src/index.js`，保留账号白名单校验和最小权限范围：

- OAuth scope：`public_repo read:user`
- 白名单变量：`ALLOWED_GITHUB_USERS`
- GitHub 用户接口：`GET https://api.github.com/user`

## 许可

基础认证代码来自 Sveltia CMS Authenticator，遵循 MIT License。许可证见 `LICENSE.txt`。
