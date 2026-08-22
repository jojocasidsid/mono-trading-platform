import type { JWT } from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyReply {
    refreshJwtSign: JWT['sign'];
  }

  interface FastifyRequest {
    refreshJwtVerify: JWT['verify'];
    refreshJwtDecode: JWT['decode'];
  }
}
