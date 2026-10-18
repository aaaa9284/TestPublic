# 김윤 포트폴리오

순수 HTML · CSS · JS 정적 사이트. 빌드 단계 없음.

```
index.html            메인 (작업 이야기 3편 · 소개 · 연락)
resume.html           이력서 한 장 요약 (인쇄 / PDF 저장 버튼)
projects/vet.html     동물병원 보고서 자동화
projects/live.html    라이브 리타게팅 시스템
projects/mocap.html   모션캡처 데이터 처리 자동화
assets/css/style.css  디자인 토큰(:root) + 전체 스타일
assets/js/main.js     다크 모드, 스크롤 효과, 라이트박스, 유튜브 지연 로딩
assets/img/           WebP 이미지 (1600px)
vercel.json           cleanUrls (/projects/vet 처럼 .html 없이 접근)
```

## 로컬 미리보기
```
python -m http.server 8000
```
→ http://localhost:8000 (경로가 `/`로 시작하므로 파일을 더블클릭해 열면 스타일이 깨집니다)

## 배포 (Vercel)
1. 이 폴더를 GitHub 저장소로 올림
2. vercel.com → Add New → Project → 저장소 Import
3. Framework Preset: **Other**, Build Command / Output Directory 비워둠 → Deploy

또는 CLI: `npx vercel` (폴더 안에서 실행) → 확인 후 `npx vercel --prod`

## 색상 바꾸기
`assets/css/style.css` 맨 위 `--accent` 값 (라이트 / 다크 각각).
