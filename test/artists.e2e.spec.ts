import { request } from './lib';
import { StatusCodes } from 'http-status-codes';
import { validate } from 'uuid';
import { removeTokenUser, tokensAndIds } from './utils';
import { artistsRoutes, albumsRoutes, tracksRoutes } from './endpoints';

const createArtistDto = {
  name: 'TEST_artist',
  grammy: true,
};

// Probability of collisions for UUID is almost zero
const randomUUID = '0a35dd62-e09f-444b-a628-f4e7c6954f57';

describe('artist (e2e)', () => {
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
    it('should correctly get all artists', async () => {
      const response = await unauthorizedRequest
        .get(artistsRoutes.getAll)
        .set(userHeaders);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toBeInstanceOf(Array);
    });

    it('should respond with UNAUTHORIZED status code while getting all artists in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .get(artistsRoutes.getAll)
        .set(unauthorizedHeaders);
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should correctly get artist by id', async () => {
      const creationResponse = await unauthorizedRequest
        .post(artistsRoutes.create)
        .set(adminHeaders)
        .send(createArtistDto);

      const { id } = creationResponse.body;

      expect(creationResponse.statusCode).toBe(StatusCodes.CREATED);

      const searchResponse = await unauthorizedRequest
        .get(artistsRoutes.getById(id))
        .set(userHeaders);

      expect(searchResponse.statusCode).toBe(StatusCodes.OK);
      expect(searchResponse.body).toBeInstanceOf(Object);

      const cleanupResponse = await unauthorizedRequest
        .delete(artistsRoutes.delete(id))
        .set(adminHeaders);

      expect(cleanupResponse.statusCode).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with UNAUTHORIZED status code while getting artist by id in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .get(artistsRoutes.getById(randomUUID))
        .set(unauthorizedHeaders);
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with BAD_REQUEST status code in case of invalid id', async () => {
      const response = await unauthorizedRequest
        .get(artistsRoutes.getById('some-invalid-id'))
        .set(userHeaders);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should respond with NOT_FOUND status code in case if artist doesn't exist", async () => {
      const response = await unauthorizedRequest
        .get(artistsRoutes.getById(randomUUID))
        .set(userHeaders);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('POST', () => {
    it('should correctly create artist in case of "Admin" role', async () => {
      const response = await unauthorizedRequest
        .post(artistsRoutes.create)
        .set(adminHeaders)
        .send(createArtistDto);

      const { id, name, grammy } = response.body;

      expect(response.status).toBe(StatusCodes.CREATED);

      expect(name).toBe(createArtistDto.name);
      expect(grammy).toBe(createArtistDto.grammy);
      expect(validate(id)).toBe(true);
      const cleanupResponse = await unauthorizedRequest
        .delete(artistsRoutes.delete(id))
        .set(adminHeaders);

      expect(cleanupResponse.statusCode).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with FORBIDDEN status code in case of "User" role', async () => {
      const response = await unauthorizedRequest
        .post(artistsRoutes.create)
        .set(userHeaders)
        .send(createArtistDto);
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it('should respond with UNAUTHORIZED status code in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .post(artistsRoutes.create)
        .set(unauthorizedHeaders)
        .send(createArtistDto);
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with BAD_REQUEST in case of invalid required data and "Admin" role', async () => {
      const responses = await Promise.all([
        unauthorizedRequest
          .post(artistsRoutes.create)
          .set(adminHeaders)
          .send({}),
        unauthorizedRequest.post(artistsRoutes.create).set(adminHeaders).send({
          name: 'TEST_artist',
        }),
        unauthorizedRequest.post(artistsRoutes.create).set(adminHeaders).send({
          grammy: true,
        }),
        unauthorizedRequest.post(artistsRoutes.create).set(adminHeaders).send({
          name: null,
          grammy: 'true',
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
    it('should correctly update artist match in case of "Admin" role', async () => {
      const creationResponse = await unauthorizedRequest
        .post(artistsRoutes.create)
        .set(adminHeaders)
        .send(createArtistDto);

      const { id: createdId } = creationResponse.body;

      expect(creationResponse.status).toBe(StatusCodes.CREATED);

      const updateResponse = await unauthorizedRequest
        .put(artistsRoutes.update(createdId))
        .set(adminHeaders)
        .send({
          name: createArtistDto.name,
          grammy: false,
        });

      expect(updateResponse.statusCode).toBe(StatusCodes.OK);

      const { id: updatedId, name, grammy } = updateResponse.body;

      expect(name).toBe(createArtistDto.name);
      expect(grammy).toBe(false);
      expect(validate(updatedId)).toBe(true);
      expect(createdId).toBe(updatedId);

      const cleanupResponse = await unauthorizedRequest
        .delete(artistsRoutes.delete(createdId))
        .set(adminHeaders);

      expect(cleanupResponse.statusCode).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with UNAUTHORIZED status code in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .put(artistsRoutes.update(randomUUID))
        .set(unauthorizedHeaders)
        .send({
          name: 'name',
          grammy: true,
        });
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with FORBIDDEN status code in case of "User" role', async () => {
      const response = await unauthorizedRequest
        .put(artistsRoutes.update(randomUUID))
        .set(userHeaders)
        .send({
          name: 'name',
          grammy: true,
        });
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it('should respond with BAD_REQUEST status code in case of invalid id and "Admin" role', async () => {
      const response = await unauthorizedRequest
        .put(artistsRoutes.update('some-invalid-id'))
        .set(adminHeaders)
        .send({
          name: createArtistDto.name,
          grammy: false,
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with BAD_REQUEST status code in case of invalid dto and "Admin" role', async () => {
      const creationResponse = await unauthorizedRequest
        .post(artistsRoutes.create)
        .set(adminHeaders)
        .send(createArtistDto);

      const { id: createdId } = creationResponse.body;
      expect(creationResponse.status).toBe(StatusCodes.CREATED);

      const response = await unauthorizedRequest
        .put(artistsRoutes.update(createdId))
        .set(adminHeaders)
        .send({
          name: 12345,
          grammy: 'false',
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should respond with NOT_FOUND status code in case if artist doesn't exist and user has 'Admin role'", async () => {
      const response = await unauthorizedRequest
        .put(artistsRoutes.update(randomUUID))
        .set(adminHeaders)
        .send({
          name: createArtistDto.name,
          grammy: false,
        });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('DELETE', () => {
    it('should correctly delete artist', async () => {
      const response = await unauthorizedRequest
        .post(artistsRoutes.create)
        .set(adminHeaders)
        .send(createArtistDto);

      const { id } = response.body;

      expect(response.status).toBe(StatusCodes.CREATED);

      const cleanupResponse = await unauthorizedRequest
        .delete(artistsRoutes.delete(id))
        .set(adminHeaders);

      expect(cleanupResponse.statusCode).toBe(StatusCodes.NO_CONTENT);

      const searchResponse = await unauthorizedRequest
        .get(artistsRoutes.getById(id))
        .set(adminHeaders);

      expect(searchResponse.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    it('should respond with FORBIDDEN status code in case of "User" role', async () => {
      const response = await unauthorizedRequest
        .delete(artistsRoutes.delete(randomUUID))
        .set(userHeaders);
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it('should respond with UNAUTHORIZED status code in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .delete(artistsRoutes.delete(randomUUID))
        .set(unauthorizedHeaders);
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with BAD_REQUEST status code in case of invalid id and "Admin" role', async () => {
      const response = await unauthorizedRequest
        .delete(artistsRoutes.delete('some-invalid-id'))
        .set(adminHeaders);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should respond with NOT_FOUND status code in case if artist doesn't exist and user has 'Admin' role", async () => {
      const response = await unauthorizedRequest
        .delete(artistsRoutes.delete(randomUUID))
        .set(adminHeaders);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it('should set track.artistId to null after deletion in case of "Admin" role', async () => {
      const creationArtistResponse = await unauthorizedRequest
        .post(artistsRoutes.create)
        .set(adminHeaders)
        .send(createArtistDto);

      const { id: artistId } = creationArtistResponse.body;

      const createTrackDto = {
        name: 'TEST_track',
        albumId: null,
        artistId,
        duration: 200,
      };

      expect(creationArtistResponse.status).toBe(StatusCodes.CREATED);

      const creationTrackResponse = await unauthorizedRequest
        .post(tracksRoutes.create)
        .set(adminHeaders)
        .send(createTrackDto);

      const { id: trackId } = creationTrackResponse.body;

      expect(creationTrackResponse.statusCode).toBe(StatusCodes.CREATED);

      const artistDeletionResponse = await unauthorizedRequest
        .delete(artistsRoutes.delete(artistId))
        .set(adminHeaders);

      expect(artistDeletionResponse.statusCode).toBe(StatusCodes.NO_CONTENT);

      const searchTrackResponse = await unauthorizedRequest
        .get(tracksRoutes.getById(trackId))
        .set(adminHeaders);

      expect(searchTrackResponse.statusCode).toBe(StatusCodes.OK);

      const { artistId: trackArtistId } = searchTrackResponse.body;

      expect(trackArtistId).toBeNull();
    });
  });
});
