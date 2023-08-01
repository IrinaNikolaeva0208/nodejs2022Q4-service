import { validate } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { request } from './lib';
import { tokensAndIds, removeTokenUser } from './utils';
import { tracksRoutes } from './endpoints';

const createTrackDto = {
  name: 'TEST_TRACK',
  duration: 199,
  artistId: null,
  albumId: null,
};

// Probability of collisions for UUID is almost zero
const randomUUID = '0a35dd62-e09f-444b-a628-f4e7c6954f57';

describe('Tracks (e2e)', () => {
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
    it('should correctly get all tracks', async () => {
      const response = await unauthorizedRequest
        .get(tracksRoutes.getAll)
        .set(userHeaders);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toBeInstanceOf(Array);
    });

    it('should respond with UNAUTHORIZED status code while getting all tracks in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .get(tracksRoutes.getAll)
        .set(unauthorizedHeaders);
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with UNAUTHORIZED status code while getting track by id in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .get(tracksRoutes.getById(randomUUID))
        .set(unauthorizedHeaders);
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should correctly get track by id', async () => {
      const creationResponse = await unauthorizedRequest
        .post(tracksRoutes.create)
        .set(adminHeaders)
        .send(createTrackDto);

      const { id } = creationResponse.body;

      expect(creationResponse.statusCode).toBe(StatusCodes.CREATED);

      const searchResponse = await unauthorizedRequest
        .get(tracksRoutes.getById(id))
        .set(userHeaders);

      expect(searchResponse.statusCode).toBe(StatusCodes.OK);
      expect(searchResponse.body).toBeInstanceOf(Object);

      const cleanupResponse = await unauthorizedRequest
        .delete(tracksRoutes.delete(id))
        .set(adminHeaders);

      expect(cleanupResponse.statusCode).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with BAD_REQUEST status code in case of invalid id ', async () => {
      const response = await unauthorizedRequest
        .get(tracksRoutes.getById('some-invalid-id'))
        .set(userHeaders);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should respond with NOT_FOUND status code in case if track doesn't exist", async () => {
      const response = await unauthorizedRequest
        .get(tracksRoutes.getById(randomUUID))
        .set(userHeaders);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('POST', () => {
    it('should respond with FORBIDDEN status code in case of "User" role', async () => {
      const response = await unauthorizedRequest
        .post(tracksRoutes.create)
        .set(userHeaders)
        .send(createTrackDto);
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it('should respond with UNAUTHORIZED status code in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .post(tracksRoutes.create)
        .set(unauthorizedHeaders)
        .send(createTrackDto);
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should correctly create track in case of "Admin" role', async () => {
      const response = await unauthorizedRequest
        .post(tracksRoutes.create)
        .set(adminHeaders)
        .send(createTrackDto);

      expect(response.status).toBe(StatusCodes.CREATED);

      const { id, name, duration, artistId, albumId } = response.body;
      expect(validate(id)).toBe(true);
      expect(name).toBe(createTrackDto.name);
      expect(duration).toBe(createTrackDto.duration);
      expect(artistId).toBe(createTrackDto.artistId);
      expect(albumId).toBe(createTrackDto.albumId);

      const cleanupResponse = await unauthorizedRequest
        .delete(tracksRoutes.delete(id))
        .set(adminHeaders);

      expect(cleanupResponse.statusCode).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with BAD_REQUEST in case of invalid required data and "Admin" role', async () => {
      const responses = await Promise.all([
        unauthorizedRequest
          .post(tracksRoutes.create)
          .set(adminHeaders)
          .send({}),
        unauthorizedRequest.post(tracksRoutes.create).set(adminHeaders).send({
          name: 'TEST_TRACK',
        }),
        unauthorizedRequest.post(tracksRoutes.create).set(adminHeaders).send({
          duration: 99,
        }),
        unauthorizedRequest.post(tracksRoutes.create).set(adminHeaders).send({
          name: null,
          duration: '99',
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
    it('should respond with UNAUTHORIZED status code in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .put(tracksRoutes.update(randomUUID))
        .set(unauthorizedHeaders)
        .send({
          name: createTrackDto.name,
          duration: 188,
          artistId: createTrackDto.artistId,
          albumId: createTrackDto.albumId,
        });
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with FORBIDDEN status code in case of "User" role', async () => {
      const response = await unauthorizedRequest
        .put(tracksRoutes.update(randomUUID))
        .set(userHeaders)
        .send({
          name: createTrackDto.name,
          duration: 188,
          artistId: createTrackDto.artistId,
          albumId: createTrackDto.albumId,
        });
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it('should correctly update track match in case of "Admin" role', async () => {
      const creationResponse = await unauthorizedRequest
        .post(tracksRoutes.create)
        .set(adminHeaders)
        .send(createTrackDto);

      const { id: createdId } = creationResponse.body;

      expect(creationResponse.status).toBe(StatusCodes.CREATED);

      const updateResponse = await unauthorizedRequest
        .put(tracksRoutes.update(createdId))
        .set(adminHeaders)
        .send({
          name: createTrackDto.name,
          duration: 188,
          artistId: createTrackDto.artistId,
          albumId: createTrackDto.albumId,
        });

      expect(updateResponse.statusCode).toBe(StatusCodes.OK);

      const {
        id: updatedId,
        name,
        duration,
        artistId,
        albumId,
      } = updateResponse.body;

      expect(name).toBe(createTrackDto.name);
      expect(artistId).toBe(createTrackDto.artistId);
      expect(albumId).toBe(createTrackDto.albumId);
      expect(typeof duration).toBe('number');
      expect(validate(updatedId)).toBe(true);
      expect(createdId).toBe(updatedId);

      const cleanupResponse = await unauthorizedRequest
        .delete(tracksRoutes.delete(createdId))
        .set(adminHeaders);

      expect(cleanupResponse.statusCode).toBe(StatusCodes.NO_CONTENT);
    });

    it('should respond with BAD_REQUEST status code in case of invalid id and "Admin" role', async () => {
      const response = await unauthorizedRequest
        .put(tracksRoutes.update('some-invalid-id'))
        .set(adminHeaders)
        .send({
          name: createTrackDto.name,
          duration: 188,
          artistId: createTrackDto.artistId,
          albumId: createTrackDto.albumId,
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with BAD_REQUEST status code in case of invalid dto and "Admin" role', async () => {
      const creationResponse = await unauthorizedRequest
        .post(tracksRoutes.create)
        .set(adminHeaders)
        .send(createTrackDto);

      const { id: createdId } = creationResponse.body;

      expect(creationResponse.status).toBe(StatusCodes.CREATED);

      const response = await unauthorizedRequest
        .put(tracksRoutes.update(createdId))
        .set(adminHeaders)
        .send({
          name: null,
          duration: '188',
          artistId: 123,
          albumId: 123,
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should respond with NOT_FOUND status code in case if track doesn't exist in case of 'Admin' role", async () => {
      const response = await unauthorizedRequest
        .put(tracksRoutes.update(randomUUID))
        .set(adminHeaders)
        .send({
          name: createTrackDto.name,
          duration: 188,
          artistId: createTrackDto.artistId,
          albumId: createTrackDto.albumId,
        });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('DELETE', () => {
    it('should respond with FORBIDDEN status code in case of "User" role', async () => {
      const response = await unauthorizedRequest
        .delete(tracksRoutes.delete(randomUUID))
        .set(userHeaders);
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it('should respond with UNAUTHORIZED status code in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .delete(tracksRoutes.delete(randomUUID))
        .set(unauthorizedHeaders);
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should correctly delete track in case of "Admin" role', async () => {
      const response = await unauthorizedRequest
        .post(tracksRoutes.create)
        .set(adminHeaders)
        .send(createTrackDto);

      const { id } = response.body;

      expect(response.status).toBe(StatusCodes.CREATED);

      const cleanupResponse = await unauthorizedRequest
        .delete(tracksRoutes.delete(id))
        .set(adminHeaders);

      expect(cleanupResponse.statusCode).toBe(StatusCodes.NO_CONTENT);

      const searchResponse = await unauthorizedRequest
        .get(tracksRoutes.getById(id))
        .set(adminHeaders);

      expect(searchResponse.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    it('should respond with BAD_REQUEST status code in case of invalid id and "Admin" role', async () => {
      const response = await unauthorizedRequest
        .delete(tracksRoutes.delete('some-invalid-id'))
        .set(adminHeaders);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should respond with NOT_FOUND status code in case if track doesn't exist and user is admin", async () => {
      const response = await unauthorizedRequest
        .delete(tracksRoutes.delete(randomUUID))
        .set(adminHeaders);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
