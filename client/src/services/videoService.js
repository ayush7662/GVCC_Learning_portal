import api from './api';

export const videoService = {
  getVideos: () => api.get('/videos'),
};
