# OpenClaw Install Tools

[English](./README.en.md) | 中文

帮你装好 [OpenClaw](https://openclaw.ai/) — 交互式安装向导、局域网文件传输、智能问题诊断。

> OpenClaw 是一个部署在你电脑上的个人 AI 助手，可以通过 WhatsApp、Telegram、Discord 等聊天平台与你交互。本工具帮助你完成安装过程。

## 功能

### 安装向导 `/install`

- **条件分支式引导** — 根据你的系统环境（有没有 Node.js？用什么安装方式？）自动推荐步骤路径
- **Windows / macOS 双平台** — 自动检测操作系统，提供针对性的安装流程
- **一键复制命令** — 所有终端命令支持点击即复制
- **命令生成器** — 选择平台、安装方式、AI 模型、聊天平台，生成定制化安装命令

### LAN 传输 `/transfer`

- **WebRTC P2P 直连** — 文件和文本通过局域网直接传输，不经任何服务器
- **4 位房间号配对** — 两台电脑打开网页，输入相同房间号即可连接
- **文件传输** — 选择文件发送，对方一键下载
- **文本传输** — 粘贴终端报错日志，实时发送给对方
- **剪贴板同步** — 开启后双方剪贴板自动同步

### 问题诊断 `/debug`

- **常见错误速查** — 6 大类已知安装问题（权限、环境、网络、端口、证书、API Key）
- **分平台修复方案** — 每个问题提供 Windows 和 macOS 各自的修复步骤和命令
- **AI 日志分析** — 粘贴报错日志，AI 智能分析给出诊断和修复建议
- **两层诊断** — 前端正则匹配（毫秒级）+ Workers AI 兜底（处理未知错误）

## 架构

```
┌───────────────────────────────────────────────────────────────┐
│                        浏览器 (设备 A)                         │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐    │
│  │ 安装向导  │  │  问题诊断     │  │     LAN 传输          │    │
│  │ /install  │  │  /debug      │  │     /transfer        │    │
│  └──────────┘  └──────┬───────┘  └──────────┬───────────┘    │
│                       │                      │                │
│                       │ AI 分析              │ WebRTC         │
│                       ▼                      │ DataChannel    │
│               ┌───────────────┐              │                │
│               │ Workers AI    │              │     P2P 直连    │
│               │ (llama 模型)  │              │                │
│               └───────────────┘              │                │
│                                              ▼                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │            Cloudflare Durable Objects                    │  │
│  │            (仅转发 SDP 信令，~2KB)                        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                              │                │
└──────────────────────────────────────────────┼────────────────┘
                                               │ WebRTC
                                               │ DataChannel
┌──────────────────────────────────────────────┼────────────────┐
│                        浏览器 (设备 B)        │                │
│                                              ▼                │
│                                    ┌──────────────────┐       │
│                                    │    LAN 传输       │       │
│                                    │    /transfer      │       │
│                                    └──────────────────┘       │
└───────────────────────────────────────────────────────────────┘
```

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 16 (App Router) |
| 部署 | Cloudflare Workers |
| UI | shadcn/ui + Tailwind CSS v4 + Lucide React |
| 状态管理 | Zustand |
| 动画 | Framer Motion |
| P2P 传输 | WebRTC 原生 API (RTCPeerConnection + DataChannel) |
| 信令 | Cloudflare Durable Objects (WebSocket) |
| AI 分析 | Cloudflare Workers AI (llama-3.1-8b-instruct) |

## 快速开始

```bash
# 克隆项目
git clone https://github.com/Muluk-m/openclaw-install-tools.git
cd openclaw-install-tools

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 http://localhost:3000 查看效果。

### Cloudflare 部署

项目使用了 Durable Objects（信令）和 Workers AI（日志分析），部署前需确保 Cloudflare 账户已启用这些功能。

```bash
# 本地预览（模拟 Cloudflare 环境）
npm run preview

# 部署到 Cloudflare Workers
npm run deploy
```

配置已在 `wrangler.jsonc` 中定义。

## 项目结构

```
src/
├── app/                          # Next.js App Router 页面
│   ├── page.tsx                  # Landing 首页
│   ├── install/                  # 安装向导模块
│   │   ├── page.tsx              # 平台选择（自动检测 OS）
│   │   ├── windows/page.tsx      # Windows 安装向导
│   │   ├── mac/page.tsx          # macOS 安装向导
│   │   └── customize/page.tsx    # 命令生成器
│   ├── transfer/                 # LAN 传输模块
│   │   ├── page.tsx              # 创建/加入房间
│   │   └── room/page.tsx         # 传输界面
│   ├── debug/                    # 诊断模块
│   │   ├── page.tsx              # 错误搜索 + 常见问题
│   │   ├── [slug]/page.tsx       # 问题详情
│   │   └── analyze/page.tsx      # AI 日志分析
│   └── api/                      # API 路由
│       ├── room/route.ts         # 房间管理 API
│       └── analyze/route.ts      # AI 分析 API
├── components/
│   ├── ui/                       # shadcn/ui 组件
│   ├── install/                  # 安装向导组件
│   ├── transfer/                 # 传输组件
│   └── debug/                    # 诊断组件
├── lib/
│   ├── webrtc.ts                 # WebRTC 连接管理
│   ├── signaling.ts              # 信令客户端
│   ├── signaling-do.ts           # Durable Object 信令服务
│   ├── error-patterns.ts         # 错误模式库
│   └── install-steps.ts          # 安装步骤数据（声明式步骤树）
└── stores/
    ├── wizard-store.ts           # 向导状态
    └── transfer-store.ts         # 传输状态
```

## 贡献

欢迎贡献! 以下是一些贡献方向：

- **补充安装步骤** — 不同系统版本的差异、更多边界情况处理
- **添加错误模式** — 在 `src/lib/error-patterns.ts` 中添加新的已知错误
- **改进 UI/UX** — 交互优化、视觉改进
- **添加聊天平台** — 在命令生成器中支持更多聊天平台选项
- **国际化** — 添加英文等多语言支持

```bash
# 开发
npm run dev

# 类型检查
npx tsc --noEmit

# 构建检查
npm run build

# Lint
npm run lint
```

## License

[MIT](./LICENSE)
