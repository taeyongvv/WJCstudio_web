// YouTube API 키
const YOUTUBE_API_KEY = 'AIzaSyCtTtFZSSBMo0G4-HMaOi-fGnk_h3CxP08';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/videos';

// 전역 변수
let lastUpdate = null;
let autoRefreshInterval = null;
const AUTO_REFRESH_KEY = 'youtube_trending_auto_refreshed';
let currentCategory = ''; // 현재 선택된 카테고리

// 페이지 로드 시 초기화 (동적 로드 대응)
(function() {
    function initApp() {
        // [MY_LOG] 앱 초기화
        console.log('[MY_LOG] app.js 초기화 시작');
        
        // 초기 동영상 로드
        fetchTrendingVideos();
        
        // 1시간마다 자동 갱신 설정 (3600000ms = 1시간)
        autoRefreshInterval = setInterval(() => {
            // [MY_LOG] 자동 갱신 실행
            console.log('[MY_LOG] 1시간 경과 - 자동 갱신 시작');
            fetchTrendingVideos();
        }, 3600000);
    }
    
    // DOM이 이미 준비되었거나 준비 중인지 확인
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        // DOM이 이미 준비됨 - 즉시 초기화
        // 약간의 지연을 두어 DOM 요소들이 확실히 준비되도록 함
        setTimeout(initApp, 50);
    }
})();

// YouTube 인급동 동영상 가져오기
async function fetchTrendingVideos() {
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const videoList = document.getElementById('videoList');
    const refreshButton = document.getElementById('refreshButton');
    const updateInfo = document.getElementById('updateInfo');

    if (!YOUTUBE_API_KEY) {
        errorText.textContent = 'YouTube API 키가 설정되지 않았습니다.';
        errorMessage.style.display = 'block';
        loadingMessage.style.display = 'none';
        return;
    }

    // file:// 프로토콜에서 API 호출 차단 안내
    if (window.location.protocol === 'file:') {
        errorText.textContent = '로컬 파일에서는 YouTube API를 사용할 수 없습니다. 로컬 서버를 사용해주세요. (python -m http.server 8000)';
        errorMessage.style.display = 'block';
        loadingMessage.style.display = 'none';
        refreshButton.disabled = false;
        refreshButton.textContent = '새로고침';
        return;
    }

    try {
        // UI 업데이트
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        videoList.innerHTML = '';
        refreshButton.disabled = true;
        refreshButton.textContent = '갱신 중...';
        
        // [MY_LOG] API 호출 시작
        console.log('[MY_LOG] YouTube 인급동 동영상 조회 시작');
        
        // YouTube Data API v3를 사용하여 한국 인급동 동영상 가져오기
        let apiUrl = `${YOUTUBE_API_URL}?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=20&key=${YOUTUBE_API_KEY}`;
        
        // 카테고리가 선택된 경우 videoCategoryId 추가
        if (currentCategory) {
            apiUrl += `&videoCategoryId=${currentCategory}`;
        }
        
        // [MY_LOG] API URL 확인
        console.log('[MY_LOG] API 호출 URL:', apiUrl);
        
        const response = await fetch(apiUrl);

        const data = await response.json();

        if (!response.ok) {
            // [MY_LOG] 상세 에러 정보 로깅
            console.error('[MY_LOG] API 오류 상세:', data);
            const errorMessage = data.error?.message || `API 오류: ${response.status}`;
            const errorReason = data.error?.errors?.[0]?.reason || '';
            throw new Error(`${errorMessage}${errorReason ? ' (원인: ' + errorReason + ')' : ''}`);
        }
        
        // [MY_LOG] API 응답 확인
        console.log('[MY_LOG] API 응답 받음:', data.items?.length || 0, '개 동영상');
        
        if (data.items && data.items.length > 0) {
            displayVideos(data.items);
            lastUpdate = new Date();
            updateLastUpdateInfo();
        } else {
            throw new Error('인급동 동영상을 찾을 수 없습니다.');
        }
    } catch (err) {
        // [MY_LOG] 에러 발생
        console.error('[MY_LOG] 에러 발생:', err);
        
        // 첫 접속 시 자동 새로고침 (한 번만)
        const hasAutoRefreshed = sessionStorage.getItem(AUTO_REFRESH_KEY);
        if (!hasAutoRefreshed) {
            // [MY_LOG] 첫 접속 실패 - 자동 새로고침 시도
            console.log('[MY_LOG] 첫 접속 실패 - 자동 새로고침 시도');
            sessionStorage.setItem(AUTO_REFRESH_KEY, 'true');
            
            // 1초 후 자동 새로고침
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            return; // 새로고침되므로 에러 메시지 표시 안 함
        }
        
        // 이미 새로고침했거나 두 번째 실패 시 에러 메시지 표시
        errorText.textContent = `동영상을 불러오는 중 오류가 발생했습니다: ${err.message}`;
        errorMessage.style.display = 'block';
    } finally {
        loadingMessage.style.display = 'none';
        refreshButton.disabled = false;
        refreshButton.textContent = '새로고침';
    }
}

// 동영상 목록 표시
function displayVideos(videos) {
    const videoList = document.getElementById('videoList');
    videoList.innerHTML = '';

    videos.forEach(video => {
        const videoCard = createVideoCard(video);
        videoList.appendChild(videoCard);
    });
}

// 동영상 카드 생성
function createVideoCard(video) {
    const videoId = video.id;
    const snippet = video.snippet || {};
    const statistics = video.statistics || {};
    const thumbnailUrl = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || '';

    // 카드 컨테이너
    const card = document.createElement('div');
    card.className = 'video-card';
    card.dataset.videoId = videoId;

    // 썸네일 또는 플레이어 컨테이너
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'video-thumbnail-container';
    mediaContainer.id = `media-${videoId}`;

    // 썸네일 이미지
    const thumbnail = document.createElement('img');
    thumbnail.src = thumbnailUrl;
    thumbnail.alt = snippet.title;
    thumbnail.className = 'video-thumbnail';
    thumbnail.onclick = () => showPlayer(videoId);

    // 재생 버튼 오버레이
    const playOverlay = document.createElement('div');
    playOverlay.className = 'play-button-overlay';
    playOverlay.onclick = () => showPlayer(videoId);
    playOverlay.innerHTML = `
        <svg viewBox="0 0 24 24" class="play-icon">
            <path d="M8 5v14l11-7z" fill="white" />
        </svg>
    `;

    mediaContainer.appendChild(thumbnail);
    mediaContainer.appendChild(playOverlay);

    // 동영상 정보
    const info = document.createElement('div');
    info.className = 'video-info';

    const title = document.createElement('h3');
    title.className = 'video-title';
    title.textContent = snippet.title;
    title.onclick = () => showPlayer(videoId);

    const meta = document.createElement('div');
    meta.className = 'video-meta';
    meta.innerHTML = `
        <span class="video-channel">${snippet.channelTitle || '채널명 없음'}</span>
        <span class="video-views">${formatViewCount(statistics.viewCount)}</span>
    `;

    const description = document.createElement('p');
    description.className = 'video-description';
    description.textContent = (snippet.description || '').substring(0, 100) + '...';

    const date = document.createElement('span');
    date.className = 'video-date';
    date.textContent = formatDate(snippet.publishedAt);

    info.appendChild(title);
    info.appendChild(meta);
    info.appendChild(description);
    info.appendChild(date);

    card.appendChild(mediaContainer);
    card.appendChild(info);

    return card;
}

// 플레이어 표시
function showPlayer(videoId) {
    const mediaContainer = document.getElementById(`media-${videoId}`);
    if (!mediaContainer) return;

    // 썸네일 정보 저장
    const thumbnail = mediaContainer.querySelector('.video-thumbnail');
    const thumbnailUrl = thumbnail ? thumbnail.src : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    // 플레이어로 교체
    mediaContainer.innerHTML = `
        <div class="video-player-container">
            <iframe
                class="video-player"
                src="https://www.youtube.com/embed/${videoId}?autoplay=1"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            ></iframe>
        </div>
    `;

    // 닫기 버튼을 video-info에 추가
    const card = document.querySelector(`[data-video-id="${videoId}"]`);
    const videoInfo = card?.querySelector('.video-info');
    if (videoInfo) {
        // 기존 닫기 버튼 제거
        const existingCloseBtn = videoInfo.querySelector('.close-player-button');
        if (existingCloseBtn) {
            existingCloseBtn.remove();
        }

        // 새 닫기 버튼 추가
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-player-button';
        closeBtn.textContent = '플레이어 닫기';
        closeBtn.onclick = () => closePlayer(videoId, thumbnailUrl);
        videoInfo.appendChild(closeBtn);
    }
}

// 플레이어 닫기
function closePlayer(videoId, thumbnailUrl) {
    const mediaContainer = document.getElementById(`media-${videoId}`);
    if (!mediaContainer) return;

    // 썸네일로 복원
    mediaContainer.innerHTML = `
        <img src="${thumbnailUrl}" alt="동영상 썸네일" class="video-thumbnail" onclick="showPlayer('${videoId}')">
        <div class="play-button-overlay" onclick="showPlayer('${videoId}')">
            <svg viewBox="0 0 24 24" class="play-icon">
                <path d="M8 5v14l11-7z" fill="white" />
            </svg>
        </div>
    `;

    // 닫기 버튼 제거
    const card = document.querySelector(`[data-video-id="${videoId}"]`);
    const videoInfo = card?.querySelector('.video-info');
    const closeBtn = videoInfo?.querySelector('.close-player-button');
    if (closeBtn) {
        closeBtn.remove();
    }
}

// 조회수 포맷팅
function formatViewCount(count) {
    if (!count) return '조회수 없음';
    const num = parseInt(count);
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M회`;
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K회`;
    }
    return `${num}회`;
}

// 날짜 포맷팅
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 마지막 업데이트 정보 업데이트
function updateLastUpdateInfo() {
    const updateInfo = document.getElementById('updateInfo');
    if (!lastUpdate) {
        updateInfo.textContent = '마지막 업데이트: 아직 업데이트되지 않음';
        return;
    }

    const now = new Date();
    const diff = now - lastUpdate;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    let timeText = '';
    if (hours > 0) {
        timeText = `${hours}시간 전`;
    } else if (minutes > 0) {
        timeText = `${minutes}분 전`;
    } else {
        timeText = '방금 전';
    }

    updateInfo.textContent = `마지막 업데이트: ${timeText}`;
}

// 주기적으로 업데이트 정보 갱신 (1분마다)
setInterval(updateLastUpdateInfo, 60000);

// 카테고리 선택 함수
function selectCategory(categoryId) {
    // [MY_LOG] 카테고리 선택
    console.log('[MY_LOG] 카테고리 선택:', categoryId || '전체');
    
    // 현재 카테고리 업데이트
    currentCategory = categoryId;
    
    // 탭 활성화 상태 업데이트
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
        if (tab.dataset.category === categoryId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // 선택된 카테고리의 동영상 불러오기
    fetchTrendingVideos();
}

