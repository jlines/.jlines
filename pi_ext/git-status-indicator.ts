import { execSync } from "node:child_process";
   import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

   let enabled = true;

   function run(cwd: string, command: string): string | null {
     try {
       return execSync(command, {
         cwd,
         encoding: "utf-8",
         stdio: ["ignore", "pipe", "ignore"],
       }).trim();
     } catch {
       return null;
     }
   }

   function buildGitStatus(cwd: string): string {
     const inside = run(cwd, "git rev-parse --is-inside-work-tree");
     if (inside !== "true") return "git: n/a";

     const branch = run(cwd, "git rev-parse --abbrev-ref HEAD") ?? "detached";
     const porcelain = run(cwd, "git status --porcelain") ?? "";

     let staged = 0;
     let unstaged = 0;
     let untracked = 0;

     for (const line of porcelain.split("\n")) {
       if (!line.trim()) continue;
       if (line.startsWith("??")) {
         untracked++;
         continue;
       }

       const indexStatus = line[0];
       const worktreeStatus = line[1];

       if (indexStatus && indexStatus !== " ") staged++;
       if (worktreeStatus && worktreeStatus !== " ") unstaged++;
     }

     const dirty = staged + unstaged + untracked > 0;
     const parts = [`branch:${branch}`, dirty ? "dirty" : "clean"];
     if (staged) parts.push(`S:${staged}`);
     if (unstaged) parts.push(`U:${unstaged}`);
     if (untracked) parts.push(`?:${untracked}`);

     return parts.join(" | ");
   }

   function refreshStatus(ctx: any) {
     if (!ctx.hasUI) return;

     if (!enabled) {
       ctx.ui.setStatus("git-status", "");
       return;
     }

     ctx.ui.setStatus("git-status", buildGitStatus(ctx.cwd));
   }

   export default function (pi: ExtensionAPI) {
     pi.on("session_start", async (_event, ctx) => {
       refreshStatus(ctx);
     });

     pi.on("turn_end", async (_event, ctx) => {
       refreshStatus(ctx);
     });

     pi.registerCommand("gitstatus", {
       description: "Git status indicator controls: on | off | refresh",
       handler: async (args, ctx) => {
         const cmd = (args ?? "refresh").trim().toLowerCase();

         if (cmd === "off") enabled = false;
         if (cmd === "on") enabled = true;

         refreshStatus(ctx);

         if (ctx.hasUI) {
           ctx.ui.notify(`gitstatus: ${cmd}`, "info");
         }
       },
     });
   }
