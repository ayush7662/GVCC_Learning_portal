import api from './api';

export const bookmarkService = {
  createBookmark: (data) => api.post('/bookmarks', data),
  getBookmarks: (videoId) => api.get(`/bookmarks/${videoId}`),
  updateBookmark: (id, data) => api.put(`/bookmarks/${id}`, data),
  deleteBookmark: (id) => api.delete(`/bookmarks/${id}`),
};
