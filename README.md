<p align="center">
  <img src="src/app/icon.svg" width="80" height="80" alt="OpenClaw Logo" />
</p>

<h1 align="center">OpenClaw Install Tools</h1>

<p align="center">
  帮你装好 <a href="https://openclaw.ai/">OpenClaw</a> — 安装指南、局域网传输、AI 问题诊断
</p>

<p align="center">
  <a href="./README.en.md">English</a> | 中文
</p>

> OpenClaw 是一个部署在你电脑上的个人 AI 助手，可以通过 WhatsApp、Telegram、Discord、飞书等聊天平台与你交互。本工具帮助你完成安装过程。

## 功能

### 安装指南 `/install`

- **分阶段引导** — 环境准备 → OpenClaw 初始化 → 飞书插件接入，完整覆盖从零到可用
- **复制 → 粘贴 → AI 验证** — 每一步提供 shell 命令复制，粘贴终端输出后 AI 判断是否正确
- **macOS / Windows 双平台** — 平台差异通过 tab 切换，不用跳转页面
- **飞书插件接入** — 集成官方飞书插件安装指南，从创建应用到配对授权全流程

### LAN 传输 `/transfer`

- **WebRTC P2P 直连** — 文件和文本通过局域网直接传输，不经任何服务器
- **4 位房间号配对** — 两台电脑打开网页，输入相同房间号即可连接
- **文件 / 文本 / 剪贴板** — 文件传输、实时文本发送、剪贴板自动同步

### AI 诊断 `/debug`

- **纯 AI 分析** — 粘贴任意报错日志，Cloudflare Workers AI 分析问题并给出修复建议
- **无需注册** — 即粘即诊，日志不会被存储

## 架构

```
┌─────────────────────────────────────────────────────────────┐
│                      浏览器 (设备 A)                          │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐     │
│  │ 安装指南  │  │  AI 诊断     │  │    LAN 传输        │     │
│  │ /install  │  │  /debug      │  │    /transfer       │     │
│  └────┬─────┘  └──────┬───────┘  └─────────┬─────────┘     │
│       │                │                     │               │
│       │ 步骤验证        │ 日志分析            │ WebRTC        │
│       ▼                ▼                     │ DataChannel   │
│  ┌──────────────────────────┐                │               │
│  │     Cloudflare Workers AI │                │  P2P 直连     │
│  │     (llama-3.1-8b)       │                │               │
│  └──────────────────────────┘                ▼               │
│                                    ┌──────────────────┐      │
│                                    │   PeerJS 信令     │      │
│                                    └──────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                                               │ WebRTC
                                               │ DataChannel
┌──────────────────────────────────────────────┼──────────────┐
│                      浏览器 (设备 B)          │              │
│                                              ▼              │
│                                    ┌──────────────────┐     │
│                                    │    LAN 传输       │     │
│                                    │    /transfer      │     │
│                                    └──────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 16 (App Router) |
| 部署 | Cloudflare Workers |
| UI | shadcn/ui + Tailwind CSS v4 + Lucide React |
| 状态管理 | Zustand |
| P2P 传输 | PeerJS (WebRTC) |
| AI 分析 | Cloudflare Workers AI (llama-3.1-8b-instruct) |

## 快速开始

```bash
git clone https://github.com/Muluk-m/openclaw-install-tools.git
cd openclaw-install-tools
npm install
npm run dev
```

打开 http://localhost:3000 查看效果。

### Cloudflare 部署

项目使用了 Workers AI（日志分析 + 步骤验证），部署前需确保 Cloudflare 账户已启用该功能。

```bash
# 本地预览
npm run preview

# 部署到 Cloudflare Workers
npm run deploy
```

配置已在 `wrangler.jsonc` 中定义。

## 项目结构

```
src/
├── app/
│   ├── page.tsx                  # 首页
│   ├── install/page.tsx          # 安装指南（分阶段步骤列表）
│   ├── transfer/
│   │   ├── page.tsx              # 创建/加入房间
│   │   └── room/page.tsx         # 传输界面
│   ├── debug/page.tsx            # AI 诊断
│   └── api/analyze/route.ts      # Workers AI API（步骤验证 + 日志分析）
├── components/
│   ├── ui/                       # shadcn/ui 组件
│   ├── install/
│   │   ├── command-block.tsx     # 可复制的命令块
│   │   ├── step-block.tsx        # 单步展示（命令 + 期望输出 + 平台 tab）
│   │   └── step-verifier.tsx     # AI 验证（粘贴输出 → 通过/失败）
│   ├── transfer/                 # 传输组件
│   └── debug/log-analyzer.tsx    # AI 日志分析器
├── lib/
│   ├── install-steps.ts          # 安装步骤数据（3 阶段 14 步）
│   ├── webrtc.ts                 # WebRTC 连接管理
│   └── utils.ts                  # 工具函数
└── stores/
    └── transfer-store.ts         # 传输状态
```

## 贡献

欢迎贡献! 一些方向：

- **补充安装步骤** — 在 `src/lib/install-steps.ts` 中添加新步骤或调整现有流程
- **改进 AI prompt** — 优化 `src/app/api/analyze/route.ts` 中的验证 / 诊断 prompt
- **改进 UI/UX** — 交互优化、视觉改进
- **国际化** — 添加英文等多语言支持

```bash
npm run dev      # 开发
npm run build    # 构建检查
npm run lint     # Lint
```

## License

[MIT](./LICENSE)
