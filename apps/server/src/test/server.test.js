import supertest from 'supertest';
import { describe, it, expect } from 'vitest';

import { createServer } from '../server';
import { validateLogin, validateRegistration, validatePassword } from 'api';
import { getRegularUser, getAdmin } from './testUtils';

const requestWithSupertest = supertest(createServer());

describe('server', () => {
  it('health check returns Hello world!', async () => {
    await requestWithSupertest
      .get('/')
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual('Hello, world!');
      });
  });
});

describe('login validation', () => {
  it('should throw error due to incorrect email field in login', () => {
    const user = {
      email: 'apan.se',
      password: 'Aa1!Aa1!Aa1!',
    };
    const result = validateLogin(user);
    expect(result.errors[0].message).toEqual('Email must me a valid email address');
  });

  it('should throw an error due to password being less than 8 characters', () => {
    const user = {
      email: 'apan@hotmail.se',
      password: 'Aa1!A3A',
    };
    const result = validateLogin(user);
    expect(result.errors[0].message).toEqual('Password must be at least 8 characters');
  });

  it('should throw an error due to password being longer than 12 characters', () => {
    const user = {
      email: 'apan@hotmail.se',
      password: 'Aa!Aa!333Aaa2',
    };
    const result = validateLogin(user);
    expect(result.errors[0].message).toEqual('Password can not be longer than 12 characters');
  });

  it('should throw an error if password does not contain at least one lower case character', () => {
    const user = {
      email: 'apan@hotmail.se',
      password: 'AAA222!!!',
    };

    const result = validateLogin(user);
    expect(result.errors[0].message).toEqual(
      'Password must contain at least one lower case character',
    );
  });

  it('should throw an error if password does not contain at least one upper case character', () => {
    const user = {
      email: 'apan@hotmail.se',
      password: 'aaa222!!!',
    };

    const result = validateLogin(user);
    expect(result.errors[0].message).toEqual(
      'Password must contain at least one upper case character',
    );
  });

  it('should throw an error if password does not contain at least one number', () => {
    const user = {
      email: 'apan@hotmail.se',
      password: 'aaaAa%!!!',
    };

    const result = validateLogin(user);
    expect(result.errors[0].message).toEqual('Password must contain at least one number');
  });

  it('should throw an error if password does not contain at least ONE special character', () => {
    const user = {
      email: 'apan@hotmail.se',
      password: 'aaaAa1234',
    };

    const result = validateLogin(user);
    expect(result.errors[0].message).toEqual(
      'Password must contain at least one special character',
    );
  });

  it('should return information of a succesful login validation', () => {
    const user = {
      email: 'jagfunkar@gmail.com',
      password: 'Ab1!ab1!',
    };

    const result = validateLogin(user);
    expect(result.success).toEqual(true);
  });
});

describe('registration validation', () => {
  it('should throw an error if group_id is less than one character long', () => {
    const user = {
      email: 'hejsan@hotmail.se',
      password: 'Lösenord12!',
      group_id: '',
    };

    const result = validateRegistration(user);
    expect(result.errors[0].message).toEqual('Group id can not be empty');
  });

  it('should return information of a successful registration validation', () => {
    const user = {
      email: 'hejsan@hotmail.se',
      password: 'Lösenord12!',
      group_id: 'grupp1',
    };

    const result = validateRegistration(user);
    expect(result.success).toEqual(true);
  });
});

describe('testing jwt tokens', () => {
  it('a valid token should be returned when logging in regular user', async () => {
    const user = getRegularUser();

    await requestWithSupertest
      .post('/auth/login')
      .send(user)
      .expect(200)
      .then((res) => {
        expect(res.body.token).toBeDefined();
      });
  });

  it('logging in with a user that does not exist should return http status 404', async () => {
    const user = {
      email: 'apannnnnn@apan.se',
      password: 'Aa1!Aa1!',
    };

    await requestWithSupertest
      .post('/auth/login')
      .send(user)
      .expect(404)
      .then((res) => {
        expect(res.body.token).toBeUndefined();
      });
  });
  it('should return refresh cookie', async () => {
    const user = getRegularUser();

    await requestWithSupertest
      .post('/auth/login')
      .send(user)
      .expect(200)
      .then((res) => {
        expect(res.headers['set-cookie']).toBeDefined();
      });
  });
});

describe('update user password', () => {
  it('should successfully update a users password', async () => {
    const user = getAdmin();
    const loginResponse = await requestWithSupertest.post('/auth/login').send(user);
    const token = loginResponse.body.token;
    const id = loginResponse.body.id;

    await requestWithSupertest
      .patch('/user/update-password')
      .set('Authorization', `Bearer ${token}`)
      .set('id', id)
      .send({
        email: 'apansson@apa.se',
        newPassword: 'Lösenord1!',
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toBeDefined();
      });
  });

  it('should fail due to user not being an admin', async () => {
    const user = getRegularUser();
    const loginResponse = await requestWithSupertest.post('/auth/login').send(user);
    const token = loginResponse.body.token;
    const id = loginResponse.body.id;

    await requestWithSupertest
      .patch('/user/update-password')
      .set('Authorization', `Bearer ${token}`)
      .set('id', id)
      .send({
        email: 'apansson@apa.se',
        newPassword: 'Lösenord1!',
      })
      .expect(403)
      .then((res) => {
        expect(res.body).toEqual('Not authorized for selected resource');
      });
  });

  it('should fail due to not finding the resource', async () => {
    const user = getAdmin();
    const loginResponse = await requestWithSupertest.post('/auth/login').send(user);
    const token = loginResponse.body.token;
    const id = loginResponse.body.id;

    await requestWithSupertest
      .patch('/user/update-password')
      .set('Authorization', `Bearer ${token}`)
      .set('id', id)
      .send({
        email: 'noEmail',
        newPassword: 'Lösenord1!',
      })
      .expect(404)
      .then((res) => {
        expect(res.body).toEqual('Could not find resource');
      });
  });
});

describe('user group tests', () => {
  it('should return a list of user groups', async () => {
    const user = getAdmin();
    const loginResponse = await requestWithSupertest.post('/auth/login').send(user);
    const token = loginResponse.body.token;
    const id = loginResponse.body.id;

    await requestWithSupertest
      .get('/user/getUserGroups')
      .set('Authorization', `Bearer ${token}`)
      .set('id', id)
      .expect(200)
      .then((res) => {
        expect(Object.keys(res.body)).not.toHaveLength(0);
      });
  });

  it('should return information about deactivated user group', async () => {
    const user = getAdmin();
    const loginResponse = await requestWithSupertest.post('/auth/login').send(user);
    const token = loginResponse.body.token;
    const id = loginResponse.body.id;

    await requestWithSupertest
      .post('/user/deactivateUserGroup')
      .set('Authorization', `Bearer ${token}`)
      .set('id', id)
      .set('user_group_id', '04ca9240-d148-4c4e-8f05-3532f7344eeb')
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual('Resource deactivated');
      });
  });

  it('should return 403 due to user not being admin', async () => {
    const user = getRegularUser();
    const loginResponse = await requestWithSupertest.post('/auth/login').send(user);
    const token = loginResponse.body.token;
    const id = loginResponse.body.id;

    await requestWithSupertest
      .post('/user/deactivateUserGroup')
      .set('Authorization', `Bearer ${token}`)
      .set('id', id)
      .set('user_group_id', '04ca9240-d148-4c4e-8f05-3532f7344eeb')
      .expect(403)
      .then((res) => {
        expect(res.body).toEqual('Not authorized for selected resource');
      });
  });

  it('should return 404 due to not finding the resource', async () => {
    const user = getAdmin();
    const loginResponse = await requestWithSupertest.post('/auth/login').send(user);
    const token = loginResponse.body.token;
    const id = loginResponse.body.id;

    await requestWithSupertest
      .post('/user/deactivateUserGroup')
      .set('Authorization', `Bearer ${token}`)
      .set('id', id)
      .set('user_group_id', '')
      .expect(500)
      .then((res) => {
        expect(res.body).toEqual('Internal Server Error');
      });
  });
});
