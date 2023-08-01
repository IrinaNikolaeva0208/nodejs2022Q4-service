import { request } from './lib';
import { StatusCodes } from 'http-status-codes';
import { removeTokenUser, tokensAndIds } from './utils';
import {
  usersRoutes,
  albumsRoutes,
  artistsRoutes,
  tracksRoutes,
  favoritesRoutes,
} from './endpoints';
import { FindFavsDto } from 'src/favourites/dto/findFavs.dto';

const createAlbumDto = {
  name: 'TEST_ALBUM',
  year: 2022,
  artistId: null,
};

const createArtistDto = {
  name: 'TEST_artist',
  grammy: true,
};

const createTrackDto = {
  name: 'Test track',
  duration: 335,
  artistId: null,
  albumId: null,
};

// Probability of collisions for UUID is almost zero
const randomUUID = '0a35dd62-e09f-444b-a628-f4e7c6954f57';

describe('Favorites (e2e)', () => {
  const unauthorizedRequest = request;
  const userHeaders = { Accept: 'application/json' };
  const unauthorizedHeaders = { Accept: 'application/json' };
  const adminHeaders = { Accept: 'application/json' };
  let mockUserId: string | undefined;
  let mockAdminId: string | undefined;
  let findFavsDto: FindFavsDto = { userId: 'i' };

  beforeAll(async () => {
    mockUserId = (await tokensAndIds.mockUserId).body.id;
    userHeaders['Authorization'] =
      'Bearer ' + (await tokensAndIds.userToken).body.accessToken;
    adminHeaders['Authorization'] = tokensAndIds.adminToken;
    mockAdminId = tokensAndIds.mockAdminId;
    findFavsDto.userId = mockUserId;
  });

  afterAll(async () => {
    // delete mock user
    if (mockUserId) {
      await removeTokenUser(unauthorizedRequest, mockUserId, adminHeaders);
    }

    if (userHeaders['Authorization']) {
      delete userHeaders['Authorization'];
    }
  });

  describe('GET (basic)', () => {
    it('should correctly get all favorites (at least empty) in case of "User" role', async () => {
      const response = await unauthorizedRequest
        .get(favoritesRoutes.getAll)
        .set(userHeaders)
        .send(findFavsDto);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty('artists');
      expect(response.body).toHaveProperty('albums');
      expect(response.body).toHaveProperty('tracks');
      expect(response.body.artists).toBeInstanceOf(Array);
      expect(response.body.albums).toBeInstanceOf(Array);
      expect(response.body.tracks).toBeInstanceOf(Array);
    });

    it('should respond with UNAUTHORIZED status code in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .get(favoritesRoutes.getAll)
        .set(unauthorizedHeaders)
        .send(findFavsDto);
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with FORBIDDEN status code in case of "Admin" role', async () => {
      const response = await unauthorizedRequest
        .get(favoritesRoutes.getAll)
        .set(adminHeaders)
        .send(findFavsDto);
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it("should respond with FORBIDDEN status code in case of trying to get other peoples's favourites", async () => {
      const getUsersResponse = await unauthorizedRequest
        .get(usersRoutes.getAll)
        .set(adminHeaders);

      const { id: userId } = getUsersResponse.body.find(
        (user) => user.id != mockAdminId && user.id != mockUserId,
      );

      const response = await unauthorizedRequest
        .get(favoritesRoutes.getAll)
        .set(adminHeaders)
        .send({ userId });
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });
  });

  describe('GET (advanced)', () => {
    it('should correctly get all favorites entities in case of "User" role', async () => {
      const createArtistResponse = await unauthorizedRequest
        .post(artistsRoutes.create)
        .set(adminHeaders)
        .send(createArtistDto);

      expect(createArtistResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: artistId },
      } = createArtistResponse;

      const createAlbumResponse = await unauthorizedRequest
        .post(albumsRoutes.create)
        .set(adminHeaders)
        .send({ ...createAlbumDto, artistId });

      expect(createAlbumResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: albumId },
      } = createAlbumResponse;

      const createTrackResponse = await unauthorizedRequest
        .post(tracksRoutes.create)
        .set(adminHeaders)
        .send({ ...createTrackDto, artistId, albumId });

      expect(createTrackResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: trackId },
      } = createTrackResponse;

      const addTrackToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.tracks(trackId))
        .set(userHeaders)
        .send(findFavsDto);

      expect(addTrackToFavoritesResponse.status).toBe(StatusCodes.CREATED);

      const addAlbumToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.albums(albumId))
        .set(userHeaders)
        .send(findFavsDto);

      expect(addAlbumToFavoritesResponse.status).toBe(StatusCodes.CREATED);

      const addArtistToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.artists(artistId))
        .set(userHeaders)
        .send(findFavsDto);

      expect(addArtistToFavoritesResponse.status).toBe(StatusCodes.CREATED);

      const response = await unauthorizedRequest
        .get(favoritesRoutes.getAll)
        .set(userHeaders)
        .send(findFavsDto);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toBeInstanceOf(Object);

      expect(response.body.artists).toContainEqual({
        id: artistId,
        name: createArtistDto.name,
        grammy: createArtistDto.grammy,
      });

      expect(response.body.albums).toContainEqual({
        id: albumId,
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId,
      });

      expect(response.body.tracks).toContainEqual({
        id: trackId,
        name: createTrackDto.name,
        duration: createTrackDto.duration,
        artistId,
        albumId,
      });

      const deleteArtistResponse = await unauthorizedRequest
        .delete(artistsRoutes.delete(artistId))
        .set(adminHeaders);

      expect(deleteArtistResponse.status).toBe(StatusCodes.NO_CONTENT);

      const deleteAlbumResponse = await unauthorizedRequest
        .delete(albumsRoutes.delete(albumId))
        .set(adminHeaders);

      expect(deleteAlbumResponse.status).toBe(StatusCodes.NO_CONTENT);

      const deleteTrackResponse = await unauthorizedRequest
        .delete(tracksRoutes.delete(trackId))
        .set(adminHeaders);

      expect(deleteTrackResponse.status).toBe(StatusCodes.NO_CONTENT);

      const responseAfterDeletion = await unauthorizedRequest
        .get(favoritesRoutes.getAll)
        .set(userHeaders)
        .send(findFavsDto);

      expect(responseAfterDeletion.status).toBe(StatusCodes.OK);

      const artistSearchRes = responseAfterDeletion.body.artists.find(
        (artist) => artist.id === artistId,
      );
      const albumSearchRes = responseAfterDeletion.body.albums.find(
        (album) => album.id === albumId,
      );
      const trackSearchRes = responseAfterDeletion.body.tracks.find(
        (track) => track.id === trackId,
      );

      expect(artistSearchRes).toBeUndefined();
      expect(albumSearchRes).toBeUndefined();
      expect(trackSearchRes).toBeUndefined();
    });
  });

  describe('POST', () => {
    it('should respond with UNAUTHORIZED status code while adding artist to favorites in case of not being unauthorized', async () => {
      const createArtistResponse = await unauthorizedRequest
        .post(artistsRoutes.create)
        .set(adminHeaders)
        .send(createArtistDto);

      expect(createArtistResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: artistId },
      } = createArtistResponse;

      const addArtistToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.artists(artistId))
        .set(unauthorizedHeaders)
        .send(findFavsDto);

      expect(addArtistToFavoritesResponse.status).toBe(
        StatusCodes.UNAUTHORIZED,
      );

      const cleanupResponse = await unauthorizedRequest
        .delete(artistsRoutes.delete(artistId))
        .set(adminHeaders);

      expect(cleanupResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with FORBIDDEN status code while adding artist to favorites in case of "Admin" role', async () => {
      const createArtistResponse = await unauthorizedRequest
        .post(artistsRoutes.create)
        .set(adminHeaders)
        .send(createArtistDto);

      expect(createArtistResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: artistId },
      } = createArtistResponse;

      const addArtistToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.artists(artistId))
        .set(adminHeaders)
        .send(findFavsDto);

      expect(addArtistToFavoritesResponse.status).toBe(StatusCodes.FORBIDDEN);

      const cleanupResponse = await unauthorizedRequest
        .delete(artistsRoutes.delete(artistId))
        .set(adminHeaders);

      expect(cleanupResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should correctly add artist to favorites in case of "User" role', async () => {
      const createArtistResponse = await unauthorizedRequest
        .post(artistsRoutes.create)
        .set(adminHeaders)
        .send(createArtistDto);

      expect(createArtistResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: artistId },
      } = createArtistResponse;

      const addArtistToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.artists(artistId))
        .set(userHeaders)
        .send(findFavsDto);

      expect(addArtistToFavoritesResponse.status).toBe(StatusCodes.CREATED);

      const response = await unauthorizedRequest
        .get(favoritesRoutes.getAll)
        .set(userHeaders)
        .send(findFavsDto);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.artists).toContainEqual({
        id: artistId,
        name: createArtistDto.name,
        grammy: createArtistDto.grammy,
      });

      const cleanupResponse = await unauthorizedRequest
        .delete(artistsRoutes.delete(artistId))
        .set(adminHeaders);

      expect(cleanupResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should correctly add album to favorites in case of "User" role', async () => {
      const createAlbumResponse = await unauthorizedRequest
        .post(albumsRoutes.create)
        .set(adminHeaders)
        .send(createAlbumDto);

      expect(createAlbumResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: albumId },
      } = createAlbumResponse;

      const addAlbumToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.albums(albumId))
        .set(userHeaders)
        .send(findFavsDto);

      expect(addAlbumToFavoritesResponse.status).toBe(StatusCodes.CREATED);

      const response = await unauthorizedRequest
        .get(favoritesRoutes.getAll)
        .set(userHeaders)
        .send(findFavsDto);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.albums).toContainEqual({
        id: albumId,
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId,
      });

      const cleanupResponse = await unauthorizedRequest
        .delete(albumsRoutes.delete(albumId))
        .set(adminHeaders);

      expect(cleanupResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with UNAUTHORIZED status code while adding album to favorites in case of not being unauthorized', async () => {
      const createAlbumResponse = await unauthorizedRequest
        .post(albumsRoutes.create)
        .set(adminHeaders)
        .send(createAlbumDto);

      expect(createAlbumResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: albumId },
      } = createAlbumResponse;

      const addAlbumToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.albums(albumId))
        .set(unauthorizedHeaders)
        .send(findFavsDto);

      expect(addAlbumToFavoritesResponse.status).toBe(StatusCodes.UNAUTHORIZED);

      const cleanupResponse = await unauthorizedRequest
        .delete(albumsRoutes.delete(albumId))
        .set(adminHeaders);

      expect(cleanupResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with FORBIDDEN status code while adding album to favorites in case of "Admin" role', async () => {
      const createAlbumResponse = await unauthorizedRequest
        .post(albumsRoutes.create)
        .set(adminHeaders)
        .send(createAlbumDto);

      expect(createAlbumResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: albumId },
      } = createAlbumResponse;

      const addAlbumToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.albums(albumId))
        .set(adminHeaders)
        .send(findFavsDto);

      expect(addAlbumToFavoritesResponse.status).toBe(StatusCodes.FORBIDDEN);

      const cleanupResponse = await unauthorizedRequest
        .delete(albumsRoutes.delete(albumId))
        .set(adminHeaders);

      expect(cleanupResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should correctly add track to favorites in case of "User" role', async () => {
      const createTrackResponse = await unauthorizedRequest
        .post(tracksRoutes.create)
        .set(adminHeaders)
        .send(createTrackDto);

      expect(createTrackResponse.status).toBe(StatusCodes.CREATED);

      const {
        body: { id: trackId },
      } = createTrackResponse;

      const addTrackToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.tracks(trackId))
        .set(userHeaders)
        .send(findFavsDto);

      expect(addTrackToFavoritesResponse.status).toBe(StatusCodes.CREATED);

      const response = await unauthorizedRequest
        .get(favoritesRoutes.getAll)
        .set(userHeaders)
        .send(findFavsDto);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.tracks).toContainEqual({
        id: trackId,
        name: createTrackDto.name,
        duration: createTrackDto.duration,
        artistId: createTrackDto.artistId,
        albumId: createTrackDto.albumId,
      });

      const cleanupResponse = await unauthorizedRequest
        .delete(tracksRoutes.delete(trackId))
        .set(adminHeaders);

      expect(cleanupResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with UNAUTHORIZED status code while adding track to favorites in case of not being unauthorized', async () => {
      const createTrackResponse = await unauthorizedRequest
        .post(tracksRoutes.create)
        .set(adminHeaders)
        .send(createTrackDto);

      expect(createTrackResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: trackId },
      } = createTrackResponse;

      const addTrackToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.albums(trackId))
        .set(unauthorizedHeaders)
        .send(findFavsDto);

      expect(addTrackToFavoritesResponse.status).toBe(StatusCodes.UNAUTHORIZED);

      const cleanupResponse = await unauthorizedRequest
        .delete(tracksRoutes.delete(trackId))
        .set(adminHeaders);

      expect(cleanupResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with FORBIDDEN status code while adding track to favorites in case of "Admin" role', async () => {
      const createTrackResponse = await unauthorizedRequest
        .post(tracksRoutes.create)
        .set(adminHeaders)
        .send(createTrackDto);

      expect(createTrackResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: trackId },
      } = createTrackResponse;

      const addTrackToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.albums(trackId))
        .set(adminHeaders)
        .send(findFavsDto);

      expect(addTrackToFavoritesResponse.status).toBe(StatusCodes.FORBIDDEN);

      const cleanupResponse = await unauthorizedRequest
        .delete(tracksRoutes.delete(trackId))
        .set(adminHeaders);

      expect(cleanupResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with BAD_REQUEST in case of invalid id and "User" role', async () => {
      const artistsResponse = await unauthorizedRequest
        .post(favoritesRoutes.artists('invalid'))
        .set(userHeaders)
        .send(findFavsDto);

      expect(artistsResponse.status).toBe(StatusCodes.BAD_REQUEST);

      const albumsResponse = await unauthorizedRequest
        .post(favoritesRoutes.albums('invalid'))
        .set(userHeaders)
        .send(findFavsDto);

      expect(albumsResponse.status).toBe(StatusCodes.BAD_REQUEST);

      const tracksResponse = await unauthorizedRequest
        .post(favoritesRoutes.tracks('invalid'))
        .set(userHeaders)
        .send(findFavsDto);

      expect(tracksResponse.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with UNPROCESSABLE_ENTITY in case of entity absence and "User" role', async () => {
      const artistsResponse = await unauthorizedRequest
        .post(favoritesRoutes.artists(randomUUID))
        .set(userHeaders)
        .send(findFavsDto);

      expect(artistsResponse.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);

      const albumsResponse = await unauthorizedRequest
        .post(favoritesRoutes.albums(randomUUID))
        .set(userHeaders)
        .send(findFavsDto);

      expect(albumsResponse.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);

      const tracksResponse = await unauthorizedRequest
        .post(favoritesRoutes.tracks(randomUUID))
        .set(userHeaders)
        .send(findFavsDto);

      expect(tracksResponse.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    });
  });

  describe('DELETE', () => {
    it('should correctly delete album from favorites in case of "User" role', async () => {
      const createAlbumResponse = await unauthorizedRequest
        .post(albumsRoutes.create)
        .set(adminHeaders)
        .send(createAlbumDto);

      expect(createAlbumResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: albumId },
      } = createAlbumResponse;

      const addAlbumToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.albums(albumId))
        .set(userHeaders)
        .send(findFavsDto);

      expect(addAlbumToFavoritesResponse.status).toBe(StatusCodes.CREATED);

      const deleteAlbumFromFavoritesResponse = await unauthorizedRequest
        .delete(favoritesRoutes.albums(albumId))
        .set(userHeaders)
        .send(findFavsDto);

      expect(deleteAlbumFromFavoritesResponse.status).toBe(
        StatusCodes.NO_CONTENT,
      );

      const response = await unauthorizedRequest
        .get(favoritesRoutes.getAll)
        .set(userHeaders)
        .send(findFavsDto);

      expect(response.status).toBe(StatusCodes.OK);

      const albumSearchResult = response.body.albums.find(
        (album) => album.id === albumId,
      );

      expect(albumSearchResult).toBeUndefined();

      const cleanupResponse = await unauthorizedRequest
        .delete(albumsRoutes.delete(albumId))
        .set(adminHeaders);

      expect(cleanupResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with UNAUTHORIZED status code while deletting album from favourites in case of not being unauthorized', async () => {
      const createAlbumResponse = await unauthorizedRequest
        .post(albumsRoutes.create)
        .set(adminHeaders)
        .send(createAlbumDto);

      expect(createAlbumResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: albumId },
      } = createAlbumResponse;

      const addAlbumToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.albums(albumId))
        .set(userHeaders)
        .send(findFavsDto);

      expect(addAlbumToFavoritesResponse.status).toBe(StatusCodes.CREATED);

      const deleteAlbumFromFavoritesResponse = await unauthorizedRequest
        .delete(favoritesRoutes.albums(albumId))
        .set(unauthorizedHeaders)
        .send(findFavsDto);

      expect(deleteAlbumFromFavoritesResponse.status).toBe(
        StatusCodes.UNAUTHORIZED,
      );

      const cleanupResponse = await unauthorizedRequest
        .delete(albumsRoutes.delete(albumId))
        .set(adminHeaders);

      expect(cleanupResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with FORBIDDEN status code while deletting album from favourites in case of "Admin" role', async () => {
      const createAlbumResponse = await unauthorizedRequest
        .post(albumsRoutes.create)
        .set(adminHeaders)
        .send(createAlbumDto);

      expect(createAlbumResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: albumId },
      } = createAlbumResponse;

      const addAlbumToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.albums(albumId))
        .set(userHeaders)
        .send(findFavsDto);

      expect(addAlbumToFavoritesResponse.status).toBe(StatusCodes.CREATED);

      const deleteAlbumFromFavoritesResponse = await unauthorizedRequest
        .delete(favoritesRoutes.albums(albumId))
        .set(adminHeaders)
        .send(findFavsDto);

      expect(deleteAlbumFromFavoritesResponse.status).toBe(
        StatusCodes.FORBIDDEN,
      );

      const cleanupResponse = await unauthorizedRequest
        .delete(albumsRoutes.delete(albumId))
        .set(adminHeaders);

      expect(cleanupResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should correctly delete artist from favorites in case of "User" role', async () => {
      const createArtistResponse = await unauthorizedRequest
        .post(artistsRoutes.create)
        .set(adminHeaders)
        .send(createArtistDto);

      expect(createArtistResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: artistId },
      } = createArtistResponse;

      const addArtistToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.artists(artistId))
        .set(userHeaders)
        .send(findFavsDto);

      expect(addArtistToFavoritesResponse.status).toBe(StatusCodes.CREATED);

      const deleteArtistFromFavoritesResponse = await unauthorizedRequest
        .delete(favoritesRoutes.artists(artistId))
        .set(userHeaders)
        .send(findFavsDto);

      expect(deleteArtistFromFavoritesResponse.status).toBe(
        StatusCodes.NO_CONTENT,
      );

      const response = await unauthorizedRequest
        .get(favoritesRoutes.getAll)
        .set(userHeaders)
        .send(findFavsDto);

      expect(response.status).toBe(StatusCodes.OK);

      const artistSearchResult = response.body.artists.find(
        (artist) => artist.id === artistId,
      );

      expect(artistSearchResult).toBeUndefined();

      const cleanupResponse = await unauthorizedRequest
        .delete(artistsRoutes.delete(artistId))
        .set(adminHeaders);

      expect(cleanupResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with UNAUTHORIZED status code while deletting artist from favourites in case of not being unauthorized', async () => {
      const createArtistResponse = await unauthorizedRequest
        .post(artistsRoutes.create)
        .set(adminHeaders)
        .send(createArtistDto);

      expect(createArtistResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: artistId },
      } = createArtistResponse;

      const addArtistToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.artists(artistId))
        .set(userHeaders)
        .send(findFavsDto);

      expect(addArtistToFavoritesResponse.status).toBe(StatusCodes.CREATED);

      const deleteArtistFromFavoritesResponse = await unauthorizedRequest
        .delete(favoritesRoutes.artists(artistId))
        .set(unauthorizedHeaders)
        .send(findFavsDto);

      expect(deleteArtistFromFavoritesResponse.status).toBe(
        StatusCodes.UNAUTHORIZED,
      );

      const cleanupResponse = await unauthorizedRequest
        .delete(artistsRoutes.delete(artistId))
        .set(adminHeaders);

      expect(cleanupResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with FORBIDDEN status code while deletting artist from favourites in case of "Admin" role', async () => {
      const createArtistResponse = await unauthorizedRequest
        .post(artistsRoutes.create)
        .set(adminHeaders)
        .send(createArtistDto);

      expect(createArtistResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: artistId },
      } = createArtistResponse;

      const addArtistToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.artists(artistId))
        .set(userHeaders)
        .send(findFavsDto);

      expect(addArtistToFavoritesResponse.status).toBe(StatusCodes.CREATED);

      const deleteArtistFromFavoritesResponse = await unauthorizedRequest
        .delete(favoritesRoutes.artists(artistId))
        .set(unauthorizedHeaders)
        .send(findFavsDto);

      expect(deleteArtistFromFavoritesResponse.status).toBe(
        StatusCodes.UNAUTHORIZED,
      );

      const cleanupResponse = await unauthorizedRequest
        .delete(artistsRoutes.delete(artistId))
        .set(adminHeaders);

      expect(cleanupResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should correctly delete track from favorites in case of "User" role', async () => {
      const createTrackResponse = await unauthorizedRequest
        .post(tracksRoutes.create)
        .set(adminHeaders)
        .send(createTrackDto);

      expect(createTrackResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: trackId },
      } = createTrackResponse;

      const addTrackToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.tracks(trackId))
        .set(userHeaders)
        .send(findFavsDto);

      expect(addTrackToFavoritesResponse.status).toBe(StatusCodes.CREATED);

      const deleteTrackFromFavoritesResponse = await unauthorizedRequest
        .delete(favoritesRoutes.tracks(trackId))
        .set(userHeaders)
        .send(findFavsDto);

      expect(deleteTrackFromFavoritesResponse.status).toBe(
        StatusCodes.NO_CONTENT,
      );

      const response = await unauthorizedRequest
        .get(favoritesRoutes.getAll)
        .set(userHeaders)
        .send(findFavsDto);

      expect(response.status).toBe(StatusCodes.OK);

      const trackSearchResult = response.body.tracks.find(
        (track) => track.id === trackId,
      );

      expect(trackSearchResult).toBeUndefined();

      const cleanupResponse = await unauthorizedRequest
        .delete(tracksRoutes.delete(trackId))
        .set(adminHeaders);

      expect(cleanupResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with UNAUTHORIZED status code while deletting track from favourites in case of not being unauthorized', async () => {
      const createTrackResponse = await unauthorizedRequest
        .post(tracksRoutes.create)
        .set(adminHeaders)
        .send(createTrackDto);

      expect(createTrackResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: trackId },
      } = createTrackResponse;

      const addTrackToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.tracks(trackId))
        .set(userHeaders)
        .send(findFavsDto);

      expect(addTrackToFavoritesResponse.status).toBe(StatusCodes.CREATED);

      const deleteTrackFromFavoritesResponse = await unauthorizedRequest
        .delete(favoritesRoutes.tracks(trackId))
        .set(unauthorizedHeaders)
        .send(findFavsDto);

      expect(deleteTrackFromFavoritesResponse.status).toBe(
        StatusCodes.UNAUTHORIZED,
      );

      const cleanupResponse = await unauthorizedRequest
        .delete(tracksRoutes.delete(trackId))
        .set(adminHeaders);

      expect(cleanupResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with FORBIDDEN status code while deletting track from favourites in case of "Admin" role', async () => {
      const createTrackResponse = await unauthorizedRequest
        .post(tracksRoutes.create)
        .set(adminHeaders)
        .send(createTrackDto);

      expect(createTrackResponse.status).toBe(StatusCodes.CREATED);
      const {
        body: { id: trackId },
      } = createTrackResponse;

      const addTrackToFavoritesResponse = await unauthorizedRequest
        .post(favoritesRoutes.tracks(trackId))
        .set(userHeaders)
        .send(findFavsDto);

      expect(addTrackToFavoritesResponse.status).toBe(StatusCodes.CREATED);

      const deleteTrackFromFavoritesResponse = await unauthorizedRequest
        .delete(favoritesRoutes.tracks(trackId))
        .set(adminHeaders)
        .send(findFavsDto);

      expect(deleteTrackFromFavoritesResponse.status).toBe(
        StatusCodes.FORBIDDEN,
      );

      const cleanupResponse = await unauthorizedRequest
        .delete(tracksRoutes.delete(trackId))
        .set(adminHeaders);

      expect(cleanupResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with BAD_REQUEST status code in case of invalid id and "User" role', async () => {
      const response = await unauthorizedRequest
        .delete(albumsRoutes.delete('some-invalid-id'))
        .set(adminHeaders);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should respond with NOT_FOUND status code in case if entity doesn't exist and user has 'User' role", async () => {
      const albumsDeletionFromFavoritesResponse = await unauthorizedRequest
        .delete(albumsRoutes.delete(randomUUID))
        .set(adminHeaders);

      expect(albumsDeletionFromFavoritesResponse.status).toBe(
        StatusCodes.NOT_FOUND,
      );

      const artistsDeletionFromFavoritesResponse = await unauthorizedRequest
        .delete(artistsRoutes.delete(randomUUID))
        .set(adminHeaders);

      expect(artistsDeletionFromFavoritesResponse.status).toBe(
        StatusCodes.NOT_FOUND,
      );

      const tracksDeletionFromFavoritesResponse = await unauthorizedRequest
        .delete(tracksRoutes.delete(randomUUID))
        .set(adminHeaders);

      expect(tracksDeletionFromFavoritesResponse.status).toBe(
        StatusCodes.NOT_FOUND,
      );
    });
  });
});
