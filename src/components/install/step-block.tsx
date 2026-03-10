"use client";

import { ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CommandBlock } from "./command-block";
import { CopyableBlock } from "./copyable-block";
import { StepVerifier } from "./step-verifier";
import type { InstallStep, CommandArea, SubStep } from "@/lib/install-steps";

interface StepBlockProps {
  step: InstallStep;
  index: number;
}

function SubStepList({ steps }: { steps: SubStep[] }) {
  return (
    <div className="flex flex-col gap-3">
      {steps.map((sub, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            {i + 1}. {sub.description}
          </p>
          <CommandBlock command={sub.command} />
        </div>
      ))}
    </div>
  );
}

function CommandAreaBlock({ commands }: { commands: CommandArea }) {
  switch (commands.mode) {
    case "single":
      return <CommandBlock command={commands.command} lang={commands.lang} />;

    case "platform":
      return (
        <Tabs defaultValue="mac">
          <TabsList>
            <TabsTrigger value="mac">macOS</TabsTrigger>
            <TabsTrigger value="windows">Windows</TabsTrigger>
          </TabsList>
          {commands.mac && (
            <TabsContent value="mac">
              <CommandBlock command={commands.mac} lang="bash" />
            </TabsContent>
          )}
          {commands.windows && (
            <TabsContent value="windows">
              <CommandBlock command={commands.windows} lang="powershell" />
            </TabsContent>
          )}
        </Tabs>
      );

    case "steps":
      return <SubStepList steps={commands.steps} />;

    case "platformSteps":
      return (
        <Tabs defaultValue="mac">
          <TabsList>
            <TabsTrigger value="mac">macOS</TabsTrigger>
            <TabsTrigger value="windows">Windows</TabsTrigger>
          </TabsList>
          {commands.mac && (
            <TabsContent value="mac">
              <SubStepList steps={commands.mac} />
            </TabsContent>
          )}
          {commands.windows && (
            <TabsContent value="windows">
              <SubStepList steps={commands.windows} />
            </TabsContent>
          )}
        </Tabs>
      );
  }
}

const platformLabels: Record<string, string> = {
  mac: "仅 macOS",
  windows: "仅 Windows",
};

export function StepBlock({ step, index }: StepBlockProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border p-6">
      <div className="flex items-baseline gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {index + 1}
        </span>
        <h3 className="text-lg font-semibold">{step.title}</h3>
        {step.platformOnly && (
          <Badge variant="secondary" className="text-xs">
            {platformLabels[step.platformOnly]}
          </Badge>
        )}
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {step.description}
      </p>

      {step.link && (
        <a
          href={step.link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={
            buttonVariants({ variant: "outline", size: "sm" }) + " w-fit"
          }
        >
          <ExternalLink className="mr-2 h-3.5 w-3.5" />
          {step.link.label}
        </a>
      )}

      {step.copyable && <CopyableBlock block={step.copyable} />}

      {step.commands && <CommandAreaBlock commands={step.commands} />}

      {step.expectedOutput && (
        <div className="rounded-lg border border-dashed border-border bg-muted/50 p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            期望输出
          </p>
          <pre className="text-sm leading-relaxed">
            <code>{step.expectedOutput}</code>
          </pre>
        </div>
      )}

      {step.verifiable && <StepVerifier step={step} />}
    </div>
  );
}
