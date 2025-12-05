import React from 'react';
import './Header.css';

function Header({ lastUpdate, onRefresh, loading }) {
  // 마지막 업데이트 시간 포맷팅
  const formatLastUpdate = (date) => {
    if (!date) return '아직 업데이트되지 않음';
    
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}시간 전`;
    } else if (minutes > 0) {
      return `${minutes}분 전`;
    } else {
      return '방금 전';
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">유튜브 인급동</h1>
        <div className="header-info">
          <span className="update-info">
            마지막 업데이트: {formatLastUpdate(lastUpdate)}
          </span>
          <button 
            className="refresh-button" 
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? '갱신 중...' : '새로고침'}
          </button>
        </div>
      </div>
      <div className="header-subtitle">
        YouTube가 지정한 인기 급상승 동영상 • 1시간마다 자동 갱신
      </div>
    </header>
  );
}

export default Header;

