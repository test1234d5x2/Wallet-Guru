import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app';

describe('User API Integration Tests', function () {
    this.timeout(20000);

    const username = 'testuser@example.com';
    const password = 'initialPassword';
    const newPassword = 'newPassword123';
    let token: string;

    describe('POST /api/users (Create User)', () => {
        it('should create a new user with valid data', async () => {
            const res = await request(app)
                .post('/api/users')
                .send({ username, password })
                .expect(201);
        });

        it('should not create a duplicate user', async () => {
            const res = await request(app)
                .post('/api/users')
                .send({ username, password })
                .expect(409);
        });

        it('should return 400 if username or password is missing', async () => {
            await request(app)
                .post('/api/users')
                .send({ username })
                .expect(400);
        });
    });

    describe('POST /api/users/login (User Login)', () => {
        it('should login with correct credentials and return a token', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({ username, password })
                .expect(200);

            expect(res.body).to.have.property('token');
            token = res.body.token;
        });

        it('should fail to login with incorrect credentials', async () => {
            await request(app)
                .post('/api/users/login')
                .send({ username, password: 'wrongPassword' })
                .expect(404);
        });

        it('should return 400 if username or password is missing', async () => {
            await request(app)
                .post('/api/users/login')
                .send({ username })
                .expect(400);
        });
    });

    describe('PUT /api/users/changePassword (Change Password)', () => {
        it('should change the password when provided valid token and data', async () => {
            const res = await request(app)
                .put('/api/users/changePassword')
                .set('Authorization', `Bearer ${token}`)
                .send({ email: username, newPassword })
                .expect(200);
        });

        it('should return 400 if email or newPassword is missing', async () => {
            await request(app)
                .put('/api/users/changePassword')
                .set('Authorization', `Bearer ${token}`)
                .send({ newPassword })
                .expect(400);
        });

        it('should return 401 if no token is provided', async () => {
            await request(app)
                .put('/api/users/changePassword')
                .send({ email: username, newPassword })
                .expect(401);
        });
    });

    describe('POST /api/users/login (Login with Updated Password)', () => {
        it('should login successfully with the new password', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({ username, password: newPassword })
                .expect(200);

            expect(res.body).to.have.property('token');
            token = res.body.token;
        });
    });

    describe('DELETE /api/users/delete (Delete User)', () => {
        it('should delete the user when provided a valid token and matching email', async () => {
            const res = await request(app)
                .delete('/api/users/delete')
                .set('Authorization', `Bearer ${token}`)
                .send({ email: username })
                .expect(200);

        });

        it('should return 400 if email is missing', async () => {
            await request(app)
                .delete('/api/users/delete')
                .set('Authorization', `Bearer ${token}`)
                .send({})
                .expect(400);
        });

        it('should return 401 if no token is provided', async () => {
            await request(app)
                .delete('/api/users/delete')
                .send({ email: username })
                .expect(401);
        });

        it('should return 404 when attempting to login a deleted user', async () => {
            await request(app)
                .post('/api/users/login')
                .send({ username, password: newPassword })
                .expect(404);
        });
    });
});
