# CLAUDE.md

`oss-landing-template` 저장소의 작업 지침. `AGENTS.md`는 이 파일만 가리킨다.

## 이 저장소가 하는 일

오픈소스 프로젝트 홈페이지 **템플릿**이다. 이걸 복제해서 `site.config.ts` 만 고치면
새 프로젝트의 홈페이지가 된다. 붙이는 방법은 [README.md](README.md)가 정본이고,
이 파일은 **고칠 때의 규칙**만 다룬다.

복제 절차 자체는 `create-opensource` 스킬이 담당한다.

## 깨지 말아야 할 것

### 문구·링크·이미지는 site.config.ts 에만 있다

컴포넌트는 읽기만 한다. 새 섹션을 만들 때 문구를 컴포넌트 안에 쓰면 그 순간
"복사해서 내용만 바꾸기"가 무너진다 — 다음 사람이 파일을 전수로 뒤지게 된다.

검사: `grep -rn '"[A-Z][a-z]\{4,\}' components/*.tsx` 로 나오는 문자열이
UI 라벨(Copy·Copied·GitHub)이 아니라 **제품 문구**면 config 로 빼야 한다.

### 없는 라우트를 링크하지 않는다

`nav` · `footer.columns` · `app/sitemap.ts` 는 실제로 존재하는 경로만 담는다.
페이지를 지우면 이 셋에서도 지운다. 사이트맵의 404 는 사이트 전체 색인 신뢰도를 깎는다.

### 근거 없는 숫자를 만들지 않는다

별 개수·기여자·릴리스 버전은 전부 `lib/github.ts` 가 GitHub API 에서 읽는다.
하드코딩하거나 "예시값"을 넣지 않는다. API 가 실패하면 그 조각을 **숨긴다** —
`★ 0` 을 그리면 죽은 프로젝트로 보이므로, 값이 없으면 아예 안 그린다.

원본(solhun-web-page)에 있던 후기 3개와 `aggregateRating 4.9/150` JSON-LD 는
지어낸 값이라 통째로 뺐다. 다시 넣지 않는다.

### 3rd-party 로고를 public/ 에 두지 않는다

상표다. 템플릿째 배포되면 문제가 된다. 원본의 로고 18개를 지운 이유다.

### 쓰기 API 는 키가 없으면 전부 막힌다

`lib/admin-auth.ts` 의 `isAdmin` 은 `ADMIN_API_KEY` 가 없으면 **무조건 false** 다.
"키 미설정 = 인증 통과"로 뒤집는 변경을 넣지 않는다. 비교는 상수 시간으로 한다
(앞자리부터 순차 비교하면 응답 시간으로 키를 한 글자씩 맞출 수 있다).

### 피드백에 쓰기 API 를 열지 않는다

`/api/feedback` 은 GET 과 DELETE 만 있다. 에이전트가 제보를 등록할 수 있으면
이 페이지의 존재 이유가 사라진다.

## 검증 기준

"됐다"고 말하기 전에 확인한다.

- `pnpm typecheck` 와 `pnpm build` 가 통과해야 한다. 빌드는 GitHub API 를 실제로
  치므로, 레이트리밋에 걸리면 배지가 비어도 **빌드는 성공해야** 한다(그게 설계다).
- `site.config.ts` 를 고쳤으면 **화면을 열어** 반영을 본다. 타입이 통과했다고
  문구가 바뀐 게 아니다.
- 라우트를 추가/삭제했으면 `nav`·`footer`·`sitemap.ts` 세 곳을 같이 고쳤는지 본다.
  한 곳만 고치면 나머지가 404 를 가리킨다.
- API 를 고쳤으면 **키 없이 한 번, 틀린 키로 한 번** 쳐서 둘 다 401 인지 본다.
  200 을 받는 경로가 하나라도 있으면 쓰기가 열린 것이다.

## 개발 명령

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm typecheck
pnpm build
pnpm db:generate && pnpm db:migrate
```

## 피드백 위젯 (feedback-kit)

- 부착 타입: **global** (홈페이지 방문자 전원). 배선은 `components/feedback/FeedbackWidget.tsx`, 마운트는 `app/layout.tsx`.
- 수집처: 라쏘런 프로젝트 「에이전트 스왑 홈페이지」 · 소스 `agent-swap-web`. 허용 호스트: `agent-swap.solhun.com`, `agent-swap-web.vercel.app`, `localhost:3210`
  (호스트를 늘리면 라쏘런 소스 `dp update-source-hosts` 도 같이 — 안 맞으면 버튼은 뜨는데 보내면 403).
- 환경변수 `NEXT_PUBLIC_DP_FEEDBACK_URL` / `NEXT_PUBLIC_DP_FEEDBACK_KEY` — 빌드 때 인라인되므로 Vercel production·preview 에 둘 다 넣는다.
  비면 위젯이 조용히 사라진다(배포 뒤 번들에서 수집 URL 문자열을 센다).

## 배포

- GitHub `woorichicken/agent-swap-web`(public) → Vercel 개인 계정 `gyeonghunjeong-7007s-projects/agent-swap-web`, production branch `main`.
  main 에 push 하면 자동 배포된다. 수동 `vercel --prod` 는 쓰지 않는다(배포 이력이 Git 과 갈린다).
- env: `NEXT_PUBLIC_DP_FEEDBACK_URL`·`_KEY`(production·preview, `--no-sensitive` — `NEXT_PUBLIC_*` 는 sensitive 로 못 넣는다),
  `DATABASE_URL`·`ADMIN_API_KEY`(sensitive, production·preview). DB 는 Neon `agent-swap-web`(`rough-pine-91836154`, aws-us-east-1), 원본 값은 1Password Employee 볼트.
