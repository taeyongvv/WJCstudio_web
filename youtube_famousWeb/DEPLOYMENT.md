# GitHub Pages 배포 가이드

## 404 에러 해결 방법

GitHub Pages에서 404 에러가 발생하는 경우 다음을 확인하세요:

### 1. 파일 위치 확인

다음 파일들이 **저장소 루트**에 있어야 합니다:
- `index.html`
- `styles.css`
- `app.js`

**잘못된 예:**
```
WJCstudio_web/
  └── youtube_famousWeb/
      ├── index.html  ❌ (하위 폴더에 있음)
      ├── styles.css
      └── app.js
```

**올바른 예:**
```
WJCstudio_web/
  ├── index.html  ✅ (루트에 있음)
  ├── styles.css
  └── app.js
```

### 2. GitHub Pages 설정 확인

1. GitHub 저장소로 이동
2. **Settings** > **Pages** 클릭
3. **Source** 섹션에서:
   - "Deploy from a branch" 선택
   - **Branch**: `main` (또는 `master`) 선택
   - **Folder**: `/ (root)` 선택
4. **Save** 클릭

### 3. 파일 업로드 확인

다음 명령어로 파일이 제대로 커밋되었는지 확인:

```bash
git status
git add index.html styles.css app.js
git commit -m "Add HTML files for GitHub Pages"
git push origin main
```

### 4. 배포 대기

GitHub Pages는 배포에 몇 분이 걸릴 수 있습니다. 
- Settings > Pages에서 배포 상태 확인
- 녹색 체크 표시가 나타나면 배포 완료

### 5. URL 확인

올바른 URL 형식:
- ✅ `https://taeyongvv.github.io/WJCstudio_web/`
- ✅ `https://taeyongvv.github.io/WJCstudio_web/index.html`
- ❌ `https://taeyongvv.github.io/WJCstudio_web/youtube_famousWeb/` (잘못된 경로)

### 6. 브라우저 캐시 문제

배포 후에도 이전 버전이 보일 수 있습니다:
- **Ctrl + Shift + R** (강력 새로고침)
- 또는 시크릿 모드에서 테스트

## 배포 체크리스트

- [ ] `index.html`이 저장소 루트에 있음
- [ ] `styles.css`가 저장소 루트에 있음
- [ ] `app.js`가 저장소 루트에 있음
- [ ] GitHub Pages 설정에서 올바른 브랜치 선택
- [ ] 파일이 커밋되고 푸시됨
- [ ] 배포가 완료될 때까지 대기 (몇 분)

## 문제 해결

여전히 404 에러가 발생하면:

1. **브라우저 개발자 도구 (F12)** 열기
2. **Network** 탭에서 실패한 요청 확인
3. **Console** 탭에서 JavaScript 오류 확인
4. GitHub 저장소의 **Actions** 탭에서 배포 로그 확인

