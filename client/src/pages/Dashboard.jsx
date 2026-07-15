import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { videoService } from "../services/videoService";
import { progressService } from "../services/progressService";

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
    fetchRecentVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await videoService.getVideos();
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentVideos = async () => {
    try {
      const response = await progressService.getRecent();
      setRecentVideos(response.data);
    } catch (error) {
      console.error("Error fetching recent videos:", error);
    }
  };

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = (videoId) => {
    const recent = recentVideos.find((r) => r.videoId?._id === videoId);
    if (!recent || !recent.videoId) return 0;
    return Math.min(
      100,
      (recent.timestamp / recent.videoId.duration) * 100
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Dashboard
          </h1>

          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Recently Watched */}
        {recentVideos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Recently Watched
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentVideos.map(
                (item) =>
                  item.videoId && (
                    <Link
                      key={item.videoId._id}
                      to={`/video/${item.videoId._id}`}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                    >
                      <img
                        src={item.videoId.thumbnail}
                        alt={item.videoId.title}
                        className="w-full h-48 object-cover"
                      />

                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                          {item.videoId.title}
                        </h3>

                        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${getProgressPercentage(
                                item.videoId._id
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </Link>
                  )
              )}
            </div>
          </div>
        )}

        {/* All Videos */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            All Videos
          </h2>

          {filteredVideos.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              No videos found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
                <Link
                  key={video._id}
                  to={`/video/${video._id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                      {video.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                      {video.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDuration(video.duration)}
                      </span>

                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                        Watch
                      </button>
                    </div>

                    {getProgressPercentage(video._id) > 0 && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${getProgressPercentage(video._id)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;