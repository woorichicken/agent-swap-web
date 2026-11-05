/**
 * 터미널 데모 녹화 — fixtures/*.ansi (capture.mjs 가 만든 실제 출력)를 terminal.html 이 한 줄씩 재생하고
 * Playwright 가 그 페이지를 녹화한다. 무음 mp4 + 포스터를 public/ 에 쓴다.
 *
 *   node scripts/terminal-demo/capture.mjs     # (선택) 실제 출력 다시 받기
 *   node scripts/terminal-demo/record.mjs      # public/demo.mp4, public/demo-poster.png
 *
 * 임시 산출물은 매 회차 새 폴더(OUT)에 둔다 — 실패본도 원인 판정 근거라 지우지 않는다.
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync, readdirSync, copyFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const W = 1600, H = 1000; // 16:10. 영상 크기 = 뷰포트
const OUT = process.argv[2] ?? join(process.env.TMPDIR ?? "/tmp", `asw-demo-${Date.now()}`);
mkdirSync(OUT, { recursive: true });

const fx = {
  list: readFileSync(join(here, "fixtures/aswap-list.ansi"), "utf8"),
  auto: readFileSync(join(here, "fixtures/cswap-auto.ansi"), "utf8"),
};

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, recordVideo: { dir: OUT, size: { width: W, height: H } } });
const page = await ctx.newPage();
await page.goto(pathToFileURL(join(here, "terminal.html")).href);

// 가장 긴 줄이 화면 안에 들어가는지 — 넘치면 글자가 잘린 채 녹화되므로 먼저 잰다.
await page.evaluate(([f]) => {
  window.__fx = f;
}, [fx]);

let posterTaken = null;
const listDone = new Promise((r) => (posterTaken = r));
await page.exposeFunction("__listDone", () => posterTaken());
const run = page.evaluate(([f]) => window.runDemo(f, { listDone: () => window.__listDone() }), [fx]);
await listDone;
await page.waitForTimeout(150);
await page.screenshot({ path: join(OUT, "poster.png") });
await run;
await page.waitForFunction(() => window.__done === true);
const overflow = await page.evaluate(() => { const s = document.getElementById("screen"); return s.scrollWidth - s.clientWidth; });
console.log("가로 넘침(px):", overflow);
await ctx.close(); // close 후에야 webm 이 확정된다
await browser.close();

const webm = readdirSync(OUT).find((f) => f.endsWith(".webm"));
const mp4 = join(OUT, "demo.mp4");
const ff = spawnSync("ffmpeg", ["-y", "-i", join(OUT, webm), "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "24", "-preset", "slow", "-r", "30", "-movflags", "+faststart", "-vf", "scale=1600:-2", mp4], { encoding: "utf8" });
if (ff.status !== 0) { console.error(ff.stderr.slice(-800)); process.exit(1); }
console.log("OUT", OUT);
