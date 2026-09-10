import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const workspace = resolve(process.env.DOUNI_WORKSPACE || process.cwd());
const engine = resolve(workspace, "scripts", "institution-publication-sync-audit.mjs");
if (!existsSync(engine)) {
  process.stderr.write(`找不到机构次日进度检查执行器：${engine}\n`);
  process.exit(2);
}

const input = process.argv.slice(2);
const args = input.includes("--compact") ? input : [...input, "--compact"];
const child = spawn(process.execPath, [engine, ...args], {
  cwd: workspace,
  stdio: "inherit",
  windowsHide: true,
});
child.on("error", (error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exit(1);
});
child.on("exit", (code, signal) => {
  if (signal) process.stderr.write(`执行器被信号 ${signal} 中止\n`);
  process.exit(code ?? 1);
});
