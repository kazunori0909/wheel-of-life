import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "wheel-of-life"; // あなたのリポジトリ名

const nextConfig: NextConfig = {
  // 静的HTMLとして出力する設定
  output: "export",

  // GitHub Pagesはサブディレクトリ(/wheel-of-life)で公開されるため、
  // 本番環境(ビルド時)のみベースパスを設定します
  basePath: isProd ? `/${repoName}` : "",
  
  // 生成されるリンク等のプレフィックス設定
  assetPrefix: isProd ? `/${repoName}/` : "",

  // GitHub PagesではNext.jsの画像最適化サーバーが使えないため無効化
  images: {
    unoptimized: true,
  },
};

export default nextConfig;