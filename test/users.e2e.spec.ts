import { validate } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import { request } from './lib';
import { removeTokenUser, createUserDto, tokensAndIds } from './utils';
import { usersRoutes, authRoutes } from './endpoints';

// Probability of collisions for UUID is almost zero
const randomUUID = '0a35dd62-e09f-444b-a628-f4e7c6954f57';

describe('Users (e2e)', () => {
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
    it('should correctly get all users in case of "Admin" role', async () => {
      const response = await unauthorizedRequest
        .get(usersRoutes.getAll)
        .set(adminHeaders);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toBeInstanceOf(Array);
    });

    it('should respond with FORBIDDEN status code while getting all users in case of "User" role', async () => {
      const response = await unauthorizedRequest
        .get(usersRoutes.getAll)
        .set(userHeaders);
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it('should respond with UNAUTHORIZED status code while getting all users in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .get(usersRoutes.getAll)
        .set(unauthorizedHeaders);
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with UNAUTHORIZED status code while getting user by id in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .get(usersRoutes.getById(randomUUID))
        .set(unauthorizedHeaders);
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should respond with FORBIDDEN status code while getting user by id in case of "User" role', async () => {
      const response = await unauthorizedRequest
        .get(usersRoutes.getById(randomUUID))
        .set(userHeaders);
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it('should correctly get user by id in case of "Admin" role', async () => {
      const searchResponse = await unauthorizedRequest
        .get(usersRoutes.getById(mockUserId))
        .set(adminHeaders);

      expect(searchResponse.statusCode).toBe(StatusCodes.OK);
      expect(searchResponse.body).toBeInstanceOf(Object);
    });

    it('should respond with BAD_REQUEST status code in case of invalid id and "Admin" role', async () => {
      const response = await unauthorizedRequest
        .get(usersRoutes.getById('some-invalid-id'))
        .set(adminHeaders);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should respond with NOT_FOUND status code in case if user doesn't exist and 'Admin' role", async () => {
      const response = await unauthorizedRequest
        .get(usersRoutes.getById(randomUUID))
        .set(adminHeaders);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('PUT', () => {
    it('should respond with UNAUTHORIZED status code in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .put(usersRoutes.update(mockUserId))
        .set(unauthorizedHeaders)
        .send({
          oldPassword: createUserDto.password,
          newPassword: 'NEW_PASSWORD',
        });
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should correctly update user password match', async () => {
      const updateResponse = await unauthorizedRequest
        .put(usersRoutes.update(mockUserId))
        .set(userHeaders)
        .send({
          oldPassword: createUserDto.password,
          newPassword: 'NEW_PASSWORD',
        });

      expect(updateResponse.statusCode).toBe(StatusCodes.OK);

      const {
        id: updatedId,
        version,
        login,
        email,
        emailIsConfirmed,
        createdAt,
        updatedAt,
        role,
      } = updateResponse.body;

      expect(login).toBe(createUserDto.login);
      expect(updateResponse.body).not.toHaveProperty('password');
      expect(validate(updatedId)).toBe(true);
      expect(mockUserId).toBe(updatedId);
      expect(version).toBe(2);
      expect(typeof createdAt).toBe('number');
      expect(typeof updatedAt).toBe('number');
      expect(typeof email).toBe('string');
      expect(typeof emailIsConfirmed).toBe('boolean');
      expect(role).toBe('user');
      expect(createdAt === updatedAt).toBe(false);

      const updateResponse2 = await unauthorizedRequest
        .put(usersRoutes.update(mockUserId))
        .set(userHeaders)
        .send({
          oldPassword: createUserDto.password,
          newPassword: 'NEW_PASSWORD',
        });

      expect(updateResponse2.statusCode).toBe(StatusCodes.FORBIDDEN);
    });

    it('should respond with BAD_REQUEST status code in case of invalid id', async () => {
      const response = await unauthorizedRequest
        .put(usersRoutes.update('some-invalid-id'))
        .set(userHeaders)
        .send({
          oldPassword: 'test',
          newPassword: 'fake',
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should respond with BAD_REQUEST status code in case of invalid dto', async () => {
      const response = await unauthorizedRequest
        .put(usersRoutes.update(randomUUID))
        .set(userHeaders)
        .send({});

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should respond with NOT_FOUND status code in case if user doesn't exist", async () => {
      const response = await unauthorizedRequest
        .put(usersRoutes.update(randomUUID))
        .set(userHeaders)
        .send({
          oldPassword: 'test',
          newPassword: 'fake',
        });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('DELETE', () => {
    it('should respond with FORBIDDEN status code in case of "User" role', async () => {
      const response = await unauthorizedRequest
        .delete(usersRoutes.delete(randomUUID))
        .set(userHeaders);
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it('should respond with UNAUTHORIZED status code in case of not being unauthorized', async () => {
      const response = await unauthorizedRequest
        .delete(usersRoutes.delete(randomUUID))
        .set(unauthorizedHeaders);
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('should correctly delete user in case of "Admin" role', async () => {
      const signUpResponse = await unauthorizedRequest
        .post(authRoutes.signup)
        .set(unauthorizedHeaders)
        .send({
          login: '123',
          password: '555',
          email: 'taffy.grrr@gmail.com',
        });

      const { id } = signUpResponse.body;

      const cleanupResponse = await unauthorizedRequest
        .delete(usersRoutes.delete(id))
        .set(adminHeaders);

      expect(cleanupResponse.statusCode).toBe(StatusCodes.NO_CONTENT);

      const searchResponse = await unauthorizedRequest
        .get(usersRoutes.getById(id))
        .set(adminHeaders);

      expect(searchResponse.statusCode).toBe(StatusCodes.NOT_FOUND);
    });

    it('should respond with BAD_REQUEST status code in case of invalid id in case of "Admin" role', async () => {
      const response = await unauthorizedRequest
        .delete(usersRoutes.delete('some-invalid-id'))
        .set(adminHeaders);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("should respond with NOT_FOUND status code in case if user doesn't exist in case of 'Admin' role", async () => {
      const response = await unauthorizedRequest
        .delete(usersRoutes.delete(randomUUID))
        .set(adminHeaders);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
