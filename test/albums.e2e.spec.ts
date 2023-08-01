import { request } from './lib';
import { StatusCodes } from 'http-status-codes';
import { albumsRoutes, artistsRoutes, tracksRoutes } from './endpoints';
import { validate } from 'uuid';
import { removeTokenUser, tokensAndIds } from './utils';

const createAlbumDto = {
  name: 'TEST_ALBUM',
  year: 2022,
  artistId: null,
};

const createArtistDto = {
  name: 'TEST_artist',
  grammy: true,
};

// Probability of collisions for UUID is almost zero
const randomUUID = '0a35dd62-e09f-444b-a628-f4e7c6954f57';

describe('Album (e2e)', () => {
  const unauthorizedRequest = request;
  const userHeaders = { Accept: 'application/json' };
  const unauthorizedHeaders = { Accept: 'application/json' };
  const adminHeaders = { Accept: 'application/json' };
  let mockUserId: string | undefined;
  let mockAdminId: string | undefined;

  beforeAll(async () => {
    mockUserId = (await tokensAndIds.mockUserId).body.id;
    userHeaders['Authorization'] =
      'Bearer ' + (await tokensAndIds.userToken).body.accessToken;
    adminHeaders['Authorization'] = tokensAndIds.adminToken;
    mockAdminId = tokensAndIds.mockAdminId;
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

  describe('GET', () => {
    it('should correctly get all albums', async () => {
      const response = await unauthorizedRequest
        .get(albumsRoutes.getAll)
        .set(userHeaders);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toBeInstanceOf(Array);
    });

    it('should respond with UNAUTHORIZED status code while getting all albums in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .get(albumsRoutes.getAll)
        .set(unauthorizedHeaders);
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should correctly get album by id', async () => {
      const creationResponse = await unauthorizedRequest
        .post(albumsRoutes.create)
        .set(adminHeaders)
        .send(createAlbumDto);

      const { id } = creationResponse.body;

      expect(creationResponse.statusCode).toBe(StatusCodes.CREATED);

      const searchResponse = await unauthorizedRequest
        .get(albumsRoutes.getById(id))
        .set(userHeaders);

      expect(searchResponse.statusCode).toBe(StatusCodes.OK);
      expect(searchResponse.body).toBeInstanceOf(Object);

      const cleanupResponse = await unauthorizedRequest
        .delete(albumsRoutes.delete(id))
        .set(adminHeaders);

      expect(cleanupResponse.statusCode).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with UNAUTHORIZED status code while getting album by id in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .get(albumsRoutes.getById(randomUUID))
        .set(unauthorizedHeaders);
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with BAD_REQUEST status code in case of invalid id', async () => {
      const response = await unauthorizedRequest
        .get(albumsRoutes.getById('some-invalid-id'))
        .set(userHeaders);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should respond with NOT_FOUND status code in case if album doesn't exist", async () => {
      const response = await unauthorizedRequest
        .get(albumsRoutes.getById(randomUUID))
        .set(userHeaders);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('POST', () => {
    it('should correctly create album in case of "Admin" role', async () => {
      const response = await unauthorizedRequest
        .post(albumsRoutes.create)
        .set(adminHeaders)
        .send(createAlbumDto);

      const { id, name, year, artistId } = response.body;

      expect(response.status).toBe(StatusCodes.CREATED);

      expect(name).toBe(createAlbumDto.name);
      expect(year).toBe(createAlbumDto.year);
      expect(artistId).toBe(createAlbumDto.artistId);
      expect(validate(id)).toBe(true);
      const cleanupResponse = await unauthorizedRequest
        .delete(albumsRoutes.delete(id))
        .set(adminHeaders);

      expect(cleanupResponse.statusCode).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with FORBIDDEN status code in case of "User" role', async () => {
      const response = await unauthorizedRequest
        .post(albumsRoutes.create)
        .set(userHeaders)
        .send(createAlbumDto);
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it('should respond with UNAUTHORIZED status code in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .post(albumsRoutes.create)
        .set(unauthorizedHeaders)
        .send(createAlbumDto);
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with BAD_REQUEST in case of invalid required data and "Admin" role', async () => {
      const responses = await Promise.all([
        unauthorizedRequest
          .post(albumsRoutes.create)
          .set(adminHeaders)
          .send({}),
        unauthorizedRequest.post(albumsRoutes.create).set(adminHeaders).send({
          name: 'TEST_ALBUM',
        }),
        unauthorizedRequest.post(albumsRoutes.create).set(adminHeaders).send({
          year: 2022,
        }),
        unauthorizedRequest.post(albumsRoutes.create).set(adminHeaders).send({
          name: null,
          year: '2022',
        }),
      ]);

      expect(
        responses.every(
          ({ statusCode }) => statusCode === StatusCodes.BAD_REQUEST,
        ),
      );
    });
  });

  describe('PUT', () => {
    it('should correctly update album in case of "Admin" role', async () => {
      // Preparation start
      const creationResponse = await unauthorizedRequest
        .post(albumsRoutes.create)
        .set(adminHeaders)
        .send(createAlbumDto);

      const { id: createdId } = creationResponse.body;

      expect(creationResponse.status).toBe(StatusCodes.CREATED);
      const updatedYear = 2021;

      const creationArtistResponse = await unauthorizedRequest
        .post(artistsRoutes.create)
        .set(adminHeaders)
        .send(createArtistDto);

      expect(creationArtistResponse.statusCode).toBe(StatusCodes.CREATED);
      const { id: updateArtistId } = creationArtistResponse.body;
      // Preparation end

      const updateResponse = await unauthorizedRequest
        .put(albumsRoutes.update(createdId))
        .set(adminHeaders)
        .send({
          name: createAlbumDto.name,
          year: updatedYear,
          artistId: updateArtistId,
        });

      expect(updateResponse.statusCode).toBe(StatusCodes.OK);

      const { id: updatedId, name, year, artistId } = updateResponse.body;

      expect(name).toBe(createAlbumDto.name);
      expect(year).toBe(updatedYear);
      expect(artistId).toBe(updateArtistId);
      expect(validate(updatedId)).toBe(true);
      expect(createdId).toBe(updatedId);

      const cleanupResponse = await unauthorizedRequest
        .delete(albumsRoutes.delete(createdId))
        .set(adminHeaders);

      expect(cleanupResponse.statusCode).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with UNAUTHORIZED status code in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .put(albumsRoutes.update(randomUUID))
        .set(unauthorizedHeaders)
        .send({
          name: createAlbumDto.name,
          year: 1970,
          artistId: randomUUID,
        });
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with FORBIDDEN status code in case of "User" role', async () => {
      const response = await unauthorizedRequest
        .put(albumsRoutes.update(randomUUID))
        .set(userHeaders)
        .send({
          name: createAlbumDto.name,
          year: 1970,
          artistId: randomUUID,
        });
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it('should respond with BAD_REQUEST status code in case of invalid id and "Admin" role', async () => {
      const response = await unauthorizedRequest
        .put(albumsRoutes.update('some-invalid-id'))
        .set(adminHeaders)
        .send({
          name: createAlbumDto.name,
          year: 2021,
          artistId: createAlbumDto.artistId,
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with BAD_REQUEST status code in case of invalid dto and "Admin" role', async () => {
      const creationResponse = await unauthorizedRequest
        .post(albumsRoutes.create)
        .set(adminHeaders)
        .send(createAlbumDto);

      const { id: createdId } = creationResponse.body;

      expect(creationResponse.status).toBe(StatusCodes.CREATED);

      const response = await unauthorizedRequest
        .put(albumsRoutes.update(createdId))
        .set(adminHeaders)
        .send({
          name: true,
          year: '2021',
          artistId: 123,
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should respond with NOT_FOUND status code in case if album doesn't exist and user has 'Admin' role", async () => {
      const response = await unauthorizedRequest
        .put(albumsRoutes.update(randomUUID))
        .set(adminHeaders)
        .send({
          name: createAlbumDto.name,
          year: 2021,
          artistId: createAlbumDto.artistId,
        });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('DELETE', () => {
    it('should correctly delete album', async () => {
      const response = await unauthorizedRequest
        .post(albumsRoutes.create)
        .set(adminHeaders)
        .send(createAlbumDto);

      const { id } = response.body;

      expect(response.status).toBe(StatusCodes.CREATED);

      const cleanupResponse = await unauthorizedRequest
        .delete(albumsRoutes.delete(id))
        .set(adminHeaders);

      expect(cleanupResponse.statusCode).toBe(StatusCodes.NO_CONTENT);

      const searchResponse = await unauthorizedRequest
        .get(albumsRoutes.getById(id))
        .set(adminHeaders);

      expect(searchResponse.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    it('should respond with FORBIDDEN status code in case of "User" role', async () => {
      const response = await unauthorizedRequest
        .delete(albumsRoutes.delete(randomUUID))
        .set(userHeaders);
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it('should respond with UNAUTHORIZED status code in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .delete(albumsRoutes.delete(randomUUID))
        .set(unauthorizedHeaders);
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with BAD_REQUEST status code in case of invalid id and "Admin" role', async () => {
      const response = await unauthorizedRequest
        .delete(albumsRoutes.delete('some-invalid-id'))
        .set(adminHeaders);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should respond with NOT_FOUND status code in case if album doesn't exist and user has 'Admin' role", async () => {
      const response = await unauthorizedRequest
        .delete(albumsRoutes.delete(randomUUID))
        .set(adminHeaders);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it('should set track.albumId = null after delete in case of "Admin" role', async () => {
      const response = await unauthorizedRequest
        .post(albumsRoutes.create)
        .set(adminHeaders)
        .send(createAlbumDto);

      const { id } = response.body;

      expect(response.status).toBe(StatusCodes.CREATED);
      const createTrackDto = {
        name: 'TEST_TRACK',
        duration: 199,
        artistId: null,
        albumId: id,
      };

      const creationTrackResponse = await unauthorizedRequest
        .post(tracksRoutes.create)
        .set(adminHeaders)
        .send(createTrackDto);

      const { id: trackId } = creationTrackResponse.body;

      expect(creationTrackResponse.statusCode).toBe(StatusCodes.CREATED);

      const deleteResponse = await unauthorizedRequest
        .delete(albumsRoutes.delete(id))
        .set(adminHeaders);
      expect(deleteResponse.statusCode).toBe(StatusCodes.NO_CONTENT);

      const searchTrackResponse = await unauthorizedRequest
        .get(tracksRoutes.getById(trackId))
        .set(adminHeaders);

      expect(searchTrackResponse.statusCode).toBe(StatusCodes.OK);

      const { albumId } = searchTrackResponse.body;
      expect(albumId).toBe(null);
    });
  });
});
