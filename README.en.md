# OpenClaw Install Tools

English | [中文](./README.md)

Help you install [OpenClaw](https://openclaw.ai/) — interactive installation wizard, LAN file transfer, and smart diagnostics.

> OpenClaw is a personal AI assistant that runs on your own machine, interacting through chat platforms like WhatsApp, Telegram, and Discord. This tool helps you through the installation process.

## Features

### Installation Wizard `/install`

- **Conditional branch guidance** — Automatically recommends steps based on your system environment (Node.js installed? Which install method?)
- **Windows / macOS support** — Auto-detects your OS and provides platform-specific installation flow
- **One-click copy** — All terminal commands are copyable with a single click
- **Command generator** — Select platform, install method, AI model, and chat platforms to generate customized install commands

### LAN Transfer `/transfer`

- **WebRTC P2P direct connection** — Files and text transfer directly over LAN, no server involved
- **4-digit room code pairing** — Open the site on two computers, enter the same room code to connect
- **File transfer** — Pick a file to send, recipient downloads with one click
- **Text transfer** — Paste terminal error logs and send in real-time
- **Clipboard sync** — Enable to automatically sync clipboards between devices

### Diagnostics `/debug`

- **Common error lookup** — 6 categories of known installation issues (permissions, environment, network, port conflicts, SSL, API keys)
- **Platform-specific fixes** — Each issue provides separate fix steps and commands for Windows and macOS
- **AI log analysis** — Paste error logs and get AI-powered diagnosis and fix suggestions
- **Two-tier diagnostics** — Frontend regex matching (instant) + Workers AI fallback (for unknown errors)

## Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                       Browser (Device A)                       │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐    │
│  │  Install  │  │ Diagnostics  │  │    LAN Transfer      │    │
│  │  Wizard   │  │  /debug      │  │    /transfer         │    │
│  └──────────┘  └──────┬───────┘  └──────────┬───────────┘    │
│                       │                      │                │
│                       │ AI Analysis          │ WebRTC         │
│                       ▼                      │ DataChannel    │
│               ┌───────────────┐              │                │
│               │  Workers AI   │              │  P2P Direct    │
│               │ (llama model) │              │                │
│               └───────────────┘              │                │
│                                              ▼                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │           Cloudflare Durable Objects                     │  │
│  │           (SDP signaling relay only, ~2KB)                │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                              │                │
└──────────────────────────────────────────────┼────────────────┘
                                               │ WebRTC
                                               │ DataChannel
┌──────────────────────────────────────────────┼────────────────┐
│                       Browser (Device B)      │                │
│                                              ▼                │
│                                    ┌──────────────────┐       │
│                                    │   LAN Transfer    │       │
│                                    │   /transfer       │       │
│                                    └──────────────────┘       │
└───────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Deployment | Cloudflare Workers |
| UI | shadcn/ui + Tailwind CSS v4 + Lucide React |
| State | Zustand |
| Animation | Framer Motion |
| P2P Transfer | Native WebRTC API (RTCPeerConnection + DataChannel) |
| Signaling | Cloudflare Durable Objects (WebSocket) |
| AI Analysis | Cloudflare Workers AI (llama-3.1-8b-instruct) |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Muluk-m/openclaw-install-tools.git
cd openclaw-install-tools

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open http://localhost:3000 to see the app.

### Cloudflare Deployment

This project uses Durable Objects (signaling) and Workers AI (log analysis). Make sure these features are enabled on your Cloudflare account before deploying.

```bash
# Local preview (simulates Cloudflare environment)
npm run preview

# Deploy to Cloudflare Workers
npm run deploy
```

Configuration is defined in `wrangler.jsonc`.

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page
│   ├── install/                  # Install wizard module
│   │   ├── page.tsx              # Platform selection (OS auto-detect)
│   │   ├── windows/page.tsx      # Windows install wizard
│   │   ├── mac/page.tsx          # macOS install wizard
│   │   └── customize/page.tsx    # Command generator
│   ├── transfer/                 # LAN transfer module
│   │   ├── page.tsx              # Create/join room
│   │   └── room/page.tsx         # Transfer interface
│   ├── debug/                    # Diagnostics module
│   │   ├── page.tsx              # Error search + common issues
│   │   ├── [slug]/page.tsx       # Issue detail
│   │   └── analyze/page.tsx      # AI log analyzer
│   └── api/                      # API routes
│       ├── room/route.ts         # Room management API
│       └── analyze/route.ts      # AI analysis API
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── install/                  # Install wizard components
│   ├── transfer/                 # Transfer components
│   └── debug/                    # Diagnostics components
├── lib/
│   ├── webrtc.ts                 # WebRTC connection manager
│   ├── signaling.ts              # Signaling client
│   ├── signaling-do.ts           # Durable Object signaling server
│   ├── error-patterns.ts         # Error pattern library
│   └── install-steps.ts          # Install step data (declarative step tree)
└── stores/
    ├── wizard-store.ts           # Wizard state
    └── transfer-store.ts         # Transfer state
```

## Contributing

Contributions are welcome! Here are some areas to help with:

- **Add install steps** — Handle different OS versions, more edge cases
- **Add error patterns** — Add new known errors to `src/lib/error-patterns.ts`
- **Improve UI/UX** — Interaction and visual improvements
- **Add chat platforms** — Support more chat platform options in the command generator
- **Internationalization** — Add English and other language support

```bash
# Development
npm run dev

# Type check
npx tsc --noEmit

# Build check
npm run build

# Lint
npm run lint
```

## License

[MIT](./LICENSE)
