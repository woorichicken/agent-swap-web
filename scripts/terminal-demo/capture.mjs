/**
 * 실제 CLI 출력을 실행해(색 포함) 가명 처리해서 fixtures/ 에 저장한다.
 * 숫자·문구는 건드리지 않는다 — 바꾸는 것은 메일 주소와 "Running instances" 블록(내 프로젝트 경로) 제거뿐.
 *
 * 사용: node scripts/terminal-demo/capture.mjs     (aswap·cswap 이 PATH 에 있어야 한다)
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "fixtures");
mkdirSync(out, { recursive: true });

// 실제 메일 → 가짜 메일. 실제 값을 이 파일에 적지 않는다(공개 저장소다) —
// 출력에 처음 나온 순서대로 가명을 붙이고, 두 명령에서 같은 사람은 같은 가명을 쓴다.
const ALIASES = ["work@example.com", "personal@example.com", "team@example.com", "side@example.com"];
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const seen = new Map();

/** FORCE_COLOR=1 이면 파이프로 받아도 색(ANSI)이 나온다 — pty 가 필요 없다. */
function run(cmd, args, okCodes = [0]) {
  const r = spawnSync(cmd, args, { encoding: "utf8", env: { ...process.env, FORCE_COLOR: "1" } });
  // cswap auto 는 "전환 없음" 이 종료코드 2 다 — 정상이므로 허용 목록으로 판정한다.
  if (!okCodes.includes(r.status)) throw new Error(`${cmd} ${args.join(" ")} exit=${r.status}\n${r.stderr}`);
  return r.stdout.replace(/\r\n/g, "\n");
}

function anonymize(text) {
  const t = text.replace(EMAIL, (addr) => {
    if (addr.endsWith("@example.com")) return addr;
    if (!seen.has(addr)) {
      const alias = ALIASES[seen.size];
      if (!alias) throw new Error("가명이 모자란다 — ALIASES 를 늘린다");
      seen.set(addr, alias);
    }
    return seen.get(addr);
  });
  // 남은 실제 메일이 있으면 저장하지 않는다.
  const leaked = (t.match(EMAIL) ?? []).filter((a) => !a.endsWith("@example.com"));
  if (leaked.length) throw new Error(`가명 처리 실패 ${leaked.length}건`);
  return t;
}

// 1) aswap list — 프로젝트 경로가 든 "Running instances" 블록은 통째로 뺀다.
let list = anonymize(run("aswap", ["list"]));
list = list.replace(/(?:\x1b\[[0-9;]*m)*Running instances:[\s\S]*?\n\n(?=(?:\x1b\[[0-9;]*m)*Other agents:)/, "");
writeFileSync(join(out, "aswap-list.ansi"), list.trimEnd() + "\n");

// 2) cswap auto — 읽기 전용(--dry-run --once). 전환을 실제로 하지 않는다.
const auto = anonymize(run("cswap", ["auto", "--dry-run", "--once", "--threshold", "80"], [0, 2]));
writeFileSync(join(out, "cswap-auto.ansi"), auto.trimEnd() + "\n");

console.log("saved", out);
