# 呆橘导航站

一个基于 `Next.js 16 + App Router + Tailwind CSS` 的极简高级风导航站模板，默认按静态导出方式构建，便于部署到腾讯云 Pages 和 Cloudflare Pages。

## 本地开发

```bash
npm run dev
```

默认访问 `http://localhost:3000`。

## 当前结构

- `src/app/layout.tsx`：站点根布局与 SEO 元数据
- `src/app/page.tsx`：首页结构与内容展示
- `src/content/navigation/_meta.md`：站点标题与摘要
- `src/content/navigation/*/index.md`：单个模块的分类信息与站点列表
- `src/lib/navigation.ts`：模块 Markdown 解析逻辑
- `src/app/globals.css`：全局视觉风格与组件层次

## 部署说明

项目已在 `next.config.ts` 中开启 `output: "export"`，执行以下命令后会生成静态产物：

```bash
npm run build
```

构建完成后可将静态输出目录用于 Pages 平台部署。

## 后续扩展建议

- 增加分类详情页与标签页
- 接入本地搜索或 Algolia 搜索
- 补充 `sitemap`、`robots.txt` 和自定义 OG 图
- 将 `src/content/navigation` 替换为 CMS 或远程内容源
