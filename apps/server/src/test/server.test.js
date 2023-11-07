import supertest from 'supertest';
import { describe, it, expect } from 'vitest';

import { createServer } from '../server';

const requestWithSupertest = supertest(createServer());

describe('server', () => {
  it('health check returns Hellom world!', async () => {
    await requestWithSupertest
      .get('/')
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual('Hello, world!');
      });
  });
});
