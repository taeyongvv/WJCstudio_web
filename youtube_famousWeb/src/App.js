import React, { useState, useEffect } from 'react';
import './App.css';
import VideoList from './components/VideoList';
import Header from './components/Header';

// YouTube API 키
const YOUTUBE_API_KEY = 'AIzaSyCtTtFZSSBMo0G4-HMaOi-fGnk_h3CxP08';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/videos';

function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // YouTube 인급동 동영상 가져오기
  const fetchTrendingVideos = async () => {
    if (!YOUTUBE_API_KEY) {
      setError('YouTube API 키가 설정되지 않았습니다. .env 파일에 REACT_APP_YOUTUBE_API_KEY를 설정해주세요.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // [MY_LOG] API 호출 시작
      console.log('[MY_LOG] YouTube 인급동 동영상 조회 시작');
      
      // YouTube Data API v3를 사용하여 한국 인급동 동영상 가져오기
      const response = await fetch(
        `${YOUTUBE_API_URL}?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=20&key=${YOUTUBE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }

      const data = await response.json();
      
      // [MY_LOG] API 응답 확인
      console.log('[MY_LOG] API 응답 받음:', data.items?.length || 0, '개 동영상');
      
      if (data.items && data.items.length > 0) {
        setVideos(data.items);
        setLastUpdate(new Date());
      } else {
        setError('인급동 동영상을 찾을 수 없습니다.');
      }
    } catch (err) {
      // [MY_LOG] 에러 발생
      console.error('[MY_LOG] 에러 발생:', err);
      setError(`동영상을 불러오는 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 초기 로드
  useEffect(() => {
    fetchTrendingVideos();
  }, []);

  // 1시간마다 자동 갱신 (3600000ms = 1시간)
  useEffect(() => {
    const interval = setInterval(() => {
      // [MY_LOG] 자동 갱신 실행
      console.log('[MY_LOG] 1시간 경과 - 자동 갱신 시작');
      fetchTrendingVideos();
    }, 3600000); // 1시간 = 3600000ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <Header 
        lastUpdate={lastUpdate} 
        onRefresh={fetchTrendingVideos}
        loading={loading}
      />
      <main className="main-content">
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchTrendingVideos} className="retry-button">
              다시 시도
            </button>
          </div>
        )}
        {loading && !videos.length && (
          <div className="loading-message">
            <p>인급동 동영상을 불러오는 중...</p>
          </div>
        )}
        {!loading && !error && videos.length > 0 && (
          <VideoList videos={videos} />
        )}
      </main>
    </div>
  );
}

export default App;

