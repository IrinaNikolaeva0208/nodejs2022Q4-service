export const usersRoutes = {
  getAll: '/user',
  createAdmin: '/user/admin',
  getById: (userId) => `/user/${userId}`,
  update: (userId) => `/user/${userId}`,
  delete: (userId) => `/user/${userId}`,
};

export const artistsRoutes = {
  getAll: '/artist',
  getById: (artistId) => `/artist/${artistId}`,
  create: '/artist',
  update: (artistId) => `/artist/${artistId}`,
  delete: (artistId) => `/artist/${artistId}`,
};

export const albumsRoutes = {
  getAll: '/album',
  getById: (albumId) => `/album/${albumId}`,
  create: '/album',
  update: (albumId) => `/album/${albumId}`,
  delete: (albumId) => `/album/${albumId}`,
};

export const tracksRoutes = {
  getAll: '/track',
  getById: (trackId) => `/track/${trackId}`,
  create: '/track',
  update: (trackId) => `/track/${trackId}`,
  delete: (trackId) => `/track/${trackId}`,
};

export const favoritesRoutes = {
  getAll: '/favs',
  artists: (artistId) => `/favs/artist/${artistId}`,
  albums: (albumId) => `/favs/album/${albumId}`,
  tracks: (trackId) => `/favs/track/${trackId}`,
};

export const authRoutes = {
  signup: '/auth/signup',
  login: '/auth/login',
  refresh: '/auth/refresh',
  confirmEmail: (token) => `/auth/confirm?token=${token}`,
};
