<p align="center">
  <img src="src/app/icon.svg" width="80" height="80" alt="OpenClaw Logo" />
</p>

<h1 align="center">OpenClaw Install Tools</h1>

<p align="center">
  Help you install <a href="https://openclaw.ai/">OpenClaw</a> — install guide, LAN transfer, AI diagnostics
</p>

<p align="center">
  English | <a href="./README.md">中文</a>
</p>

> OpenClaw is a personal AI assistant that runs on your own machine, interacting through chat platforms like WhatsApp, Telegram, Discord, and Feishu (Lark). This tool helps you through the installation process.

## Features

### Install Guide `/install`

- **Phased guidance** — Environment setup → OpenClaw initialization → Feishu plugin integration, from zero to working
- **Copy → Paste → AI verify** — Each step provides a shell command to copy; paste your terminal output and AI tells you if it's correct
- **macOS / Windows** — Platform differences handled via tab switching, no page navigation
- **Feishu plugin integration** — Built-in guide for the official Feishu plugin, from app creation to pairing authorization

### LAN Transfer `/transfer`

- **WebRTC P2P direct** — Files and text transfer directly over LAN, no server involved
- **4-digit room code** — Open the site on two computers, enter the same code to connect
- **Files / Text / Clipboard** — File transfer, real-time text, and automatic clipboard sync

### AI Diagnostics `/debug`

- **Pure AI analysis** — Paste any error log, Cloudflare Workers AI analyzes and suggests fixes
- **No signup required** — Instant diagnosis, logs are not stored

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (Device A)                      │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────┐     │
│  │  Install  │  │     AI       │  │   LAN Transfer    │     │
│  │  Guide    │  │  Diagnostics │  │   /transfer       │     │
│  └────┬─────┘  └──────┬───────┘  └─────────┬─────────┘     │
│       │                │                     │               │
│       │ Step verify    │ Log analysis        │ WebRTC        │
│       ▼                ▼                     │ DataChannel   │
│  ┌──────────────────────────┐                │               │
│  │   Cloudflare Workers AI   │                │  P2P Direct   │
│  │   (llama-3.1-8b)         │                │               │
│  └──────────────────────────┘                ▼               │
│                                    ┌──────────────────┐      │
│                                    │  PeerJS Signaling │      │
│                                    └──────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                                               │ WebRTC
                                               │ DataChannel
┌──────────────────────────────────────────────┼──────────────┐
│                      Browser (Device B)       │              │
│                                              ▼              │
│                                    ┌──────────────────┐     │
│                                    │   LAN Transfer    │     │
│                                    │   /transfer       │     │
│                                    └──────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Deployment | Cloudflare Workers |
| UI | shadcn/ui + Tailwind CSS v4 + Lucide React |
| State | Zustand |
| P2P Transfer | PeerJS (WebRTC) |
| AI Analysis | Cloudflare Workers AI (llama-3.1-8b-instruct) |

## Getting Started

```bash
git clone https://github.com/Muluk-m/openclaw-install-tools.git
cd openclaw-install-tools
npm install
npm run dev
```

Open http://localhost:3000 to see the app.

### Cloudflare Deployment

This project uses Workers AI (log analysis + step verification). Make sure this feature is enabled on your Cloudflare account before deploying.

```bash
# Local preview
npm run preview

# Deploy to Cloudflare Workers
npm run deploy
```

Configuration is defined in `wrangler.jsonc`.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── install/page.tsx          # Install guide (phased step list)
│   ├── transfer/
│   │   ├── page.tsx              # Create/join room
│   │   └── room/page.tsx         # Transfer interface
│   ├── debug/page.tsx            # AI diagnostics
│   └── api/analyze/route.ts      # Workers AI API (step verify + log analysis)
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── install/
│   │   ├── command-block.tsx     # Copyable command block
│   │   ├── step-block.tsx        # Step display (command + expected output + platform tabs)
│   │   └── step-verifier.tsx     # AI verifier (paste output → pass/fail)
│   ├── transfer/                 # Transfer components
│   └── debug/log-analyzer.tsx    # AI log analyzer
├── lib/
│   ├── install-steps.ts          # Install step data (3 phases, 14 steps)
│   ├── webrtc.ts                 # WebRTC connection manager
│   └── utils.ts                  # Utilities
└── stores/
    └── transfer-store.ts         # Transfer state
```

## Contributing

Contributions welcome! Some areas:

- **Add install steps** — Add new steps or adjust flow in `src/lib/install-steps.ts`
- **Improve AI prompts** — Optimize verification / diagnosis prompts in `src/app/api/analyze/route.ts`
- **Improve UI/UX** — Interaction and visual improvements
- **Internationalization** — Add more language support

```bash
npm run dev      # Development
npm run build    # Build check
npm run lint     # Lint
```

## License

[MIT](./LICENSE)
