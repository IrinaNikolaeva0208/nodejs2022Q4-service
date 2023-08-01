import { createUserDto } from './createUserDto';
import { request } from '../lib';
import { authRoutes } from '../endpoints';

const userDto = createUserDto((Math.random() * 100).toFixed(0));
const response1 = request
  .post(authRoutes.signup)
  .set({ Accept: 'application/json' })
  .send(userDto);
const response2 = request
  .post(authRoutes.login)
  .set({ Accept: 'application/json' })
  .send(userDto);

//make sure your admin token is not expired and id is in database
//otherwise test won't work properly
export const tokensAndIds = {
  mockUserId: response1,
  userToken: response2,
  mockAdminId: '1ca5a1f3-d26c-4426-91a3-3cc879c22f25',
  adminToken:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OTJlYTBlOS00MWFlLTRlYTEtOTA3ZC05MzQ4ZTQ2OWExNzYiLCJsb2dpbiI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjkwNzQzMjA3LCJleHAiOjE2OTA3NDY4MDd9.vrPektm3e4zE6RtSX0hulQzrtglgXeskMdI5En2IV24',
};

export { userDto as createUserDto };
