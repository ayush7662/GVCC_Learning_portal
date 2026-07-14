import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videoService } from '../services/videoService';
import { bookmarkService } from '../services/bookmarkService';
import { progressService } from '../services/progressService';
import { useAuth } from '../context/AuthContext';

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef(null);
  const [video, setVideo] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [bookmarkName, setBookmarkName] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    fetchVideo();
    fetchBookmarks();
    setupScreenshotProtection();
    
    return () => {
      cleanupScreenshotProtection();
    };
  }, [id]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [video]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && isPlaying) {
        saveProgress();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isPlaying, id]);

  const fetchVideo = async () => {
    try {
      const response = await videoService.getVideos();
      const foundVideo = response.data.find(v => v._id === id);
      if (foundVideo) {
        setVideo(foundVideo);
        const progressResponse = await progressService.getProgress(id);
        if (progressResponse.data && progressResponse.data.timestamp > 0) {
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.currentTime = progressResponse.data.timestamp;
            }
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await bookmarkService.getBookmarks(id);
      setBookmarks(response.data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const saveProgress = async () => {
    if (videoRef.current) {
      try {
        await progressService.saveProgress({
          videoId: id,
          timestamp: videoRef.current.currentTime
        });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setVolume(vol);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddBookmark = async () => {
    try {
      await bookmarkService.createBookmark({
        name: bookmarkName || 'Bookmark',
        timestamp: currentTime,
        videoId: id
      });
      setBookmarkName('');
      setShowBookmarkModal(false);
      fetchBookmarks();
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    try {
      await bookmarkService.deleteBookmark(bookmarkId);
      fetchBookmarks();
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  const handleSeekToBookmark = (timestamp) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      videoRef.current.play();
    }
  };

  const getProgressPercentage = () => {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  };

  const setupScreenshotProtection = () => {
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('selectstart', preventSelection);
    document.addEventListener('keydown', handlePrintScreen);
    window.addEventListener('blur', handleTabBlur);
    window.addEventListener('focus', handleTabFocus);
  };

  const cleanupScreenshotProtection = () => {
    document.removeEventListener('contextmenu', preventContextMenu);
    document.removeEventListener('selectstart', preventSelection);
    document.removeEventListener('keydown', handlePrintScreen);
    window.removeEventListener('blur', handleTabBlur);
    window.removeEventListener('focus', handleTabFocus);
  };

  const preventContextMenu = (e) => {
    e.preventDefault();
  };

  const preventSelection = (e) => {
    e.preventDefault();
  };

  const handlePrintScreen = (e) => {
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleTabBlur = () => {
    setIsBlurred(true);
  };

  const handleTabFocus = () => {
    setTimeout(() => setIsBlurred(false), 1000);
  };

  if (!video) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showToast && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          Screenshot is not allowed!
        </div>
      )}

      <button
        onClick={() => navigate('/')}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
      <p className="text-gray-600 mb-6">{video.description}</p>

      <div className="relative">
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full rounded-lg"
          onDragStart={(e) => e.preventDefault()}
          style={{
            filter: isBlurred ? 'blur(10px)' : 'none',
            transition: 'filter 0.3s ease'
          }}
        />

        <div className="absolute top-4 right-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
          {user?.email}
        </div>

        <div className="mt-4 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={togglePlay}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1"
            />

            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24"
            />

            <button
              onClick={toggleFullscreen}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Fullscreen
            </button>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>

          <button
            onClick={() => setShowBookmarkModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Add Bookmark
          </button>
        </div>
      </div>

      {showBookmarkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Bookmark</h2>
            <input
              type="text"
              placeholder="Bookmark name (optional)"
              value={bookmarkName}
              onChange={(e) => setBookmarkName(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-gray-600 mb-4">
              Timestamp: {formatTime(currentTime)}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleAddBookmark}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowBookmarkModal(false);
                  setBookmarkName('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Bookmarks</h2>
        {bookmarks.length === 0 ? (
          <p className="text-gray-600">No bookmarks yet.</p>
        ) : (
          <div className="space-y-2">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark._id}
                className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{bookmark.name}</h3>
                  <p className="text-gray-600 text-sm">{formatTime(bookmark.timestamp)}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleSeekToBookmark(bookmark.timestamp)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm"
                  >
                    Go to
                  </button>
                  <button
                    onClick={() => handleDeleteBookmark(bookmark._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
