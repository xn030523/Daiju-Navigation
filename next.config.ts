import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 为 Pages 类平台启用纯静态导出，降低腾讯云和 Cloudflare 的部署复杂度。
  output: "export",
  // 静态导出模式下禁用运行时图片优化，避免构建阶段报错。
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
