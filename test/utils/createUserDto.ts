export const createUserDto = (test: string) => {
  return {
    login: `${test}_user`,
    email: `${test}@yandex.ru`,
    password: 'test_password',
  };
};
