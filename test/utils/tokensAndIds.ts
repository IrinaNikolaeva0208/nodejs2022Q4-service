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
  mockAdminId: '4334b987-d9e1-4469-9ec4-888b379ef16c',
  adminToken:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MzM0Yjk4Ny1kOWUxLTQ0NjktOWVjNC04ODhiMzc5ZWYxNmMiLCJsb2dpbiI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjkwOTE3Mjk0LCJleHAiOjE2OTA5MjA4OTR9.vMOObqlb9Q_uOYHLqVWF-tUXGx4a5ddRsdGEQC3pFWM',
};

export { userDto as createUserDto };
