# 유튜브 인급동 웹페이지

YouTube가 지정한 인기 급상승 동영상을 실시간으로 확인할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- 🎬 YouTube Data API v3를 사용한 인급동 동영상 조회
- ⏰ 1시간마다 자동 갱신
- 📱 반응형 디자인 (모바일/태블릿/데스크톱 지원)
- ▶️ YouTube 임베드 플레이어로 동영상 재생
- 🔄 수동 새로고침 기능

## 시작하기

### 1. YouTube API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "라이브러리"로 이동
4. "YouTube Data API v3" 검색 후 활성화
5. "사용자 인증 정보" > "사용자 인증 정보 만들기" > "API 키" 선택
6. 생성된 API 키 복사

### 2. 프로젝트 설정

```bash
# 의존성 설치
npm install

# .env 파일 생성 (프로젝트 루트에)
echo REACT_APP_YOUTUBE_API_KEY=your_api_key_here > .env
```

`.env` 파일에 다음 내용을 추가하세요:
```
REACT_APP_YOUTUBE_API_KEY=발급받은_API_키
```

### 3. 로컬 개발 서버 실행

```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 4. 빌드

```bash
npm run build
```

## GitHub Pages 배포

### 1. package.json 수정

`package.json`의 `homepage` 필드를 본인의 GitHub 사용자명과 저장소명에 맞게 수정하세요:

```json
"homepage": "https://[YOUR_USERNAME].github.io/youtube_famousWeb"
```

### 2. 배포

```bash
# gh-pages 설치 (이미 package.json에 포함됨)
npm install

# 배포 실행
npm run deploy
```

### 3. GitHub 저장소 설정

1. GitHub 저장소의 Settings > Pages로 이동
2. Source를 "gh-pages branch"로 설정
3. 저장 후 몇 분 후에 사이트가 활성화됩니다

## 주의사항

- YouTube API 키는 일일 할당량이 있습니다 (기본 10,000 units/일)
- API 키를 GitHub에 공개하지 않도록 주의하세요 (`.env` 파일은 `.gitignore`에 포함됨)
- GitHub Pages 배포 시 API 키는 환경 변수로 설정할 수 없으므로, 다른 방법을 고려해야 할 수 있습니다
  - 예: 별도의 백엔드 서버 사용 또는 API 키를 코드에 포함 (보안상 권장하지 않음)

## 기술 스택

- React 18
- YouTube Data API v3
- CSS3 (반응형 디자인)

## 라이선스

MIT

