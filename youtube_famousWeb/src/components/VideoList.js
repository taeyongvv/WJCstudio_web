import React from 'react';
import VideoCard from './VideoCard';
import './VideoList.css';

function VideoList({ videos }) {
  return (
    <div className="video-list">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

export default VideoList;

