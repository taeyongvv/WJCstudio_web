import React, { useState } from 'react';
import './VideoCard.css';

function VideoCard({ video }) {
  const [showPlayer, setShowPlayer] = useState(false);

  // 동영상 정보 추출
  const videoId = video.id;
  const snippet = video.snippet || {};
  const statistics = video.statistics || {};

  // 썸네일 URL
  const thumbnailUrl = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || '';

  // 조회수 포맷팅
  const formatViewCount = (count) => {
    if (!count) return '조회수 없음';
    const num = parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M회`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K회`;
    }
    return `${num}회`;
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="video-card">
      {!showPlayer ? (
        <div className="video-thumbnail-container">
          <img
            src={thumbnailUrl}
            alt={snippet.title}
            className="video-thumbnail"
            onClick={() => setShowPlayer(true)}
          />
          <div className="play-button-overlay" onClick={() => setShowPlayer(true)}>
            <svg viewBox="0 0 24 24" className="play-icon">
              <path d="M8 5v14l11-7z" fill="white" />
            </svg>
          </div>
        </div>
      ) : (
        <div className="video-player-container">
          <iframe
            className="video-player"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={snippet.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      
      <div className="video-info">
        <h3 className="video-title" onClick={() => setShowPlayer(true)}>
          {snippet.title}
        </h3>
        <div className="video-meta">
          <span className="video-channel">{snippet.channelTitle}</span>
          <span className="video-views">{formatViewCount(statistics.viewCount)}</span>
        </div>
        <p className="video-description">{snippet.description?.substring(0, 100)}...</p>
        <span className="video-date">{formatDate(snippet.publishedAt)}</span>
        {showPlayer && (
          <button 
            className="close-player-button"
            onClick={() => setShowPlayer(false)}
          >
            플레이어 닫기
          </button>
        )}
      </div>
    </div>
  );
}

export default VideoCard;

