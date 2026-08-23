import type { FastifyInstance } from 'fastify';

export async function create_authenticated_user(app: FastifyInstance) {
  const unique_id = `${Date.now()}-${Math.random()}`;

  const user = {
    email: `trade-test-${unique_id}@example.com`,
    username: `trade_test_${Date.now()}`,
    name: 'Trade Test User',
    password: 'Password123!',
  };

  const signup_response = await app.inject({
    method: 'POST',
    url: '/api/auth/signup',
    payload: user,
  });

  if (signup_response.statusCode !== 201) {
    throw new Error(`Failed to create test user: ${signup_response.body}`);
  }

  const login_response = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      email: user.email,
      password: user.password,
    },
  });

  if (login_response.statusCode !== 200) {
    throw new Error(`Failed to login test user: ${login_response.body}`);
  }

  const cookies = login_response.cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

  return {
    user,
    cookies,
  };
}
