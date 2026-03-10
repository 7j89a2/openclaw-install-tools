"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CopyableBlock as CopyableBlockData } from "@/lib/install-steps";

interface CopyableBlockProps {
  block: CopyableBlockData;
}

export function CopyableBlock({ block }: CopyableBlockProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(!block.collapsible);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(block.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = block.content.split("\n").length;

  return (
    <div className="rounded-lg border border-border bg-muted">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          {block.collapsible && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
              {block.label}
            </button>
          )}
          {!block.collapsible && (
            <span className="text-xs text-muted-foreground">{block.label}</span>
          )}
          {!expanded && (
            <span className="text-xs text-muted-foreground/60">
              ({lineCount} 行)
            </span>
          )}
        </div>
        <Button variant="ghost" size="icon-xs" onClick={handleCopy}>
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span className="sr-only">{copied ? "已复制" : "复制"}</span>
        </Button>
      </div>
      {expanded && (
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed max-h-96 overflow-y-auto">
          <code>{block.content}</code>
        </pre>
      )}
    </div>
  );
}
