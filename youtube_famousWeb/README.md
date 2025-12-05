# 유튜브 인급동 웹페이지

YouTube가 지정한 인기 급상승 동영상을 실시간으로 확인할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- 🎬 YouTube Data API v3를 사용한 인급동 동영상 조회
- ⏰ 1시간마다 자동 갱신
- 📱 반응형 디자인 (모바일/태블릿/데스크톱 지원)
- ▶️ YouTube 임베드 플레이어로 동영상 재생
- 🔄 수동 새로고침 기능

## 시작하기

### 1. 파일 구조

```
youtube_famousWeb/
├── index.html      # 메인 HTML 파일
├── styles.css      # 스타일시트
├── app.js          # JavaScript 로직
└── README.md       # 이 파일
```

### 2. 로컬에서 실행

**방법 1: 직접 브라우저에서 열기**
- `index.html` 파일을 더블클릭하거나 브라우저로 드래그하여 열기
- 또는 브라우저 주소창에 파일 경로 입력 (예: `file:///D:/unity3D/WJCstudio/youtube_famousWeb/index.html`)

**방법 2: 로컬 서버 사용 (권장)**
```bash
# Python이 설치되어 있다면
python -m http.server 8000

# 또는 Node.js가 설치되어 있다면
npx http-server -p 8000
```
그 후 브라우저에서 `http://localhost:8000` 접속

### 3. GitHub Pages 배포

1. GitHub 저장소에 파일 업로드
2. Settings > Pages로 이동
3. Source를 "Deploy from a branch" 선택
4. Branch를 "main" (또는 "master") 선택
5. Save 후 몇 분 후에 사이트 활성화

배포 주소: `https://taeyongvv.github.io/WJCstudio_web/`

## API 키 설정

현재 API 키는 `app.js` 파일에 하드코딩되어 있습니다:
```javascript
const YOUTUBE_API_KEY = 'AIzaSyCtTtFZSSBMo0G4-HMaOi-fGnk_h3CxP08';
```

## 주의사항

- YouTube API 키는 일일 할당량이 있습니다 (기본 10,000 units/일)
- API 키를 GitHub에 공개하지 않도록 주의하세요 (이미 코드에 포함되어 있으므로 공개 저장소에 올리면 노출됨)
- Google Cloud Console에서 API 키 제한을 설정하는 것을 권장합니다:
  - HTTP 리퍼러(웹사이트) 제한: 본인의 GitHub Pages 도메인만 허용
  - API 제한: YouTube Data API v3만 허용

## 기술 스택

- 순수 HTML5
- CSS3 (반응형 디자인)
- JavaScript (ES6+)
- YouTube Data API v3

## 라이선스

MIT
