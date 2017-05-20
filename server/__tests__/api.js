import request from 'supertest'
import {MongoClient, ObjectID} from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import App from '../src/app';

const isValidJwt = (token) => {
    try {
        jwt.decode(token);

        return true;
    } catch (error) {
        return false;
    }
};

const createPoll = async (app, data) => {
    const response = await request(app).post('/polls').send(data);

    return response.body.id;
};

const createAnonymousToken = (app) =>
    request(app)
        .post('/token')
        .send({ grant_type: 'client_credentials' })
        .expect(200)
        .then(response => response.body.access_token);

const registerAndAuthenticate = async (app, username, password) => {
    await request(app).post('/users').send({
        username,
        password,
    });

    return await request(app)
        .post('/token')
        .send({
            grant_type: 'password',
            username,
            password,
        })
        .expect(200)
        .then(response => response.body.access_token);
};

describe('API', () => {
    let app, db;

    beforeAll(async () => {
        db = await MongoClient.connect('mongodb://localhost:27017/voting-app-test');

        await db.dropDatabase();

        app = App(db);
    });

    describe('POST /token', () => {
        describe('Client Credentials Grant', () => {
            let response;

            beforeEach(async () => {
                response = await request(app)
                    .post('/token')
                    .send({ grant_type: 'client_credentials' })
            });

            it('must return "200 Ok" status', () => {
                expect(response.status).toBe(200);
            });

            it('must return access token', () => {
                expect(response.body.access_token).toBeDefined();
            });

            it('must return token type of "bearer"', () => {
                expect(response.body.token_type).toBe('bearer');
            })
        });

        describe('Password Grant', () => {
            describe('with invalid username', () => {
                let response

                beforeEach(async () => {
                    response = await request(app)
                        .post('/token')
                        .send({
                            grant_type: 'password',
                            username: 'foo',
                            password: 'bar',
                        });
                });

                it('must return "401 Unauthorized" status', () => {
                    expect(response.status).toBe(401);
                });

                it('must return error message', () => {
                    expect(response.body.message).toBe('Invalid credentials')
                })
            });

            describe('with invalid password', () => {
                let response;

                beforeEach(async () => {
                    const passwordHash = await bcrypt.hash('bar', 10);

                    await db.collection('users').insertOne({
                        username: 'foo',
                        passwordHash,
                    });

                    response = await request(app)
                        .post('/token')
                        .send({
                            grant_type: 'password',
                            username: 'foo',
                            password: 'baz',
                        });
                });

                it('must return "401 Unauthorized" status', () => {
                    expect(response.status).toBe(401);
                });

                it('must return error message', () => {
                    expect(response.body.message).toBe('Invalid credentials')
                })
            });

            describe('with valid credentials', () => {
                const username = 'mikep';
                const password = 'Passw0rd!';
                let response;

                beforeEach(async () => {
                    const passwordHash = await bcrypt.hash(password, 10);

                    await db.collection('users').insertOne({
                        username,
                        passwordHash,
                    });

                    response = await request(app)
                        .post('/token')
                        .send({
                            grant_type: 'password',
                            username,
                            password,
                        });
                });

                it('must return "200 Ok" status', () => {
                    expect(response.status).toBe(200);
                });

                it('must return access token', () => {
                    expect(response.body.access_token).toBeDefined();
                });

                it('must return token type of "bearer"', () => {
                    expect(response.body.token_type).toBe('bearer');
                });
            });
        });
    });

    describe('POST /users', () => {
        const username = 'michaelp';
        const password = '123456';
        let response;

        describe('when username is missing', () => {
            beforeAll(async () => {
                response = await request(app)
                    .post('/users')
                    .send({});
            });

            it('should return "400 Bad Request" status', () => {
                expect(response.status).toBe(400);
            });

            it('should return error message', () => {
                expect(response.body.message).toBe('Username must not be empty');
            });
        });

        describe('when password is missing', () => {
            beforeAll(async () => {
                response = await request(app)
                    .post('/users')
                    .send({
                        username,
                    });
            });

            it('should return "400 Bad Request" status', () => {
                expect(response.status).toBe(400);
            });

            it('should return error message', () => {
                expect(response.body.message).toBe('Password must not be empty');
            });
        });

        describe('when password is too short', () => {
            beforeAll(async () => {
                response = await request(app)
                    .post('/users')
                    .send({
                        username,
                        password: '12345',
                    });
            });

            it('should return "400 Bad Request" status', () => {
                expect(response.status).toBe(400);
            });

            it('should return error message', () => {
                expect(response.body.message).toBe('Password must be at least 6 characters long');
            });
        });

        describe('when the request is valid', () => {
            beforeAll(async () => {
                response = await request(app)
                    .post('/users')
                    .send({
                        username,
                        password,
                    });
            });

            it('should return "201 Created" status', () => {
                expect(response.status).toBe(201);
            });

            it('must return the id of the created user', () => {
                expect(response.body.id).toBeDefined()
            });

            it('must persist the created user in database', async () => {
                const user = await db.collection('users')
                    .findOne({
                        _id: ObjectID(response.body.id),
                    });

                expect(user).not.toBe(null);
                expect(user.username).toBe(username);
            });

            it('must encrypt the password', async () => {
                const user = await db.collection('users')
                    .findOne({
                        _id: ObjectID(response.body.id),
                    });

                expect(user.passwordHash).not.toBe(null);

                const isValidPassword = await bcrypt.compare(password, user.passwordHash);

                expect(isValidPassword).toBe(true);
            });
        });

        describe('when the username is taken', () => {
            beforeAll(async () => {
                response = await request(app)
                    .post('/users')
                    .send({
                        username,
                        password,
                    });
            });

            it('must return "400 Bad Request" status', () => {
                expect(response.status).toBe(400);
            });

            it('must return the error message', () => {
                expect(response.body.message).toBe('Username is already taken')
            })
        });
    });

    describe('POST /polls', () => {
        let response, user;

        beforeAll(async () => {
            const token = await registerAndAuthenticate(app, 'michaelp', '123456');

            [user, response] = await Promise.all([
                jwt.decode(token),
                request(app)
                    .post('/polls')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        title: 'Who is your favorite pop singer?',
                        options: [
                            'Catty Perry',
                            'Mariah Carry',
                        ],
                    }),
            ]);
        });

        it('must return "201 Created" response', () => {
            expect(response.status).toBe(201);
        });

        it('must return the id of the created poll', () => {
            expect(response.body.id).toBeDefined();
        });

        it('must persist the poll in the database', async () => {
            const doc = await db.collection('polls')
                .findOne({_id: ObjectID(response.body.id)});

            expect(doc).toEqual({
                _id: ObjectID(response.body.id),
                title: 'Who is your favorite pop singer?',
                options: [
                    'Catty Perry',
                    'Mariah Carry',
                ],
                author: {
                    id: user.id,
                    anonymous: false,
                    username: user.name,
                },
                tally: {},
                votes: {},
            });
        });
    });

    describe('POST /polls/:id/votes', () => {
        let response, token, otherToken, pollId;

        beforeAll(async () => {
            [token, otherToken] = await Promise.all([
                registerAndAuthenticate(app, 'michaelp', '123456'),
                registerAndAuthenticate(app, 'foobar', '123456'),
            ]);

            const response = await request(app)
                .post('/polls')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Preferred option?',
                    options: ['foo', 'bar'],
                });

            pollId = response.body.id;
        });

        describe('when the poll does not exist', () => {
            beforeAll(async () => {
                response = await request(app)
                    .post(`/polls/9999/votes`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({option: 'foo'})
            });

            it('must return "404 Not Found" status', () => {
                expect(response.status).toBe(404);
            });

            it('must return the error message', () => {
                expect(response.body.message).toBe('Poll does not exist');
            });
        });

        describe('when I do not specify an option', () => {
            beforeAll(async () => {
                response = await request(app)
                    .post(`/polls/${pollId}/votes`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({})
            });

            it('must return "400 Bad Request" status', () => {
                expect(response.status).toBe(400);
            });

            it('must return the error message', () => {
                expect(response.body.message).toBe('Option not specified');
            });
        });

        describe('when I try to vote on my own poll', () => {
            beforeAll(async () => {
                response = await request(app)
                    .post(`/polls/${pollId}/votes`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({option: 'foo'})
            });

            it('must return "403 Forbidden" status', () => {
                expect(response.status).toBe(403);
            });

            it('must return the error message', () => {
                expect(response.body.message).toBe('You can not vote on your own poll');
            })
        });

        describe('when I vote on others poll', () => {
            beforeAll(async () => {
                const response = await request(app)
                    .post('/polls')
                    .set('Authorization', `Bearer ${otherToken}`)
                    .send({
                        title: 'Preferred option?',
                        options: ['foo', 'bar'],
                    });

                pollId = response.body.id;
            });

            beforeAll(async () => {
                response = await request(app)
                    .post(`/polls/${pollId}/votes`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({option: 'foo'})
            });

            it('must return "201 Created" status', () => {
                expect(response.status).toBe(201);
            });
        });

        describe('when I have already voted', () => {
            beforeAll(async () => {
                response = await request(app)
                    .post(`/polls/${pollId}/votes`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({option: 'bar'})
            });

            it('must return "403 Forbidden" status', () => {
                expect(response.status).toBe(403);
            });

            it('must return the error message', () => {
                expect(response.body.message).toBe('You can not vote on this poll again');
            })
        });
    });

    describe('GET /polls/:id', () => {
        let response, pollId, myToken, otherToken;

        beforeAll(async () => {
            [myToken, otherToken] = await Promise.all([
                registerAndAuthenticate(app, 'moby', '123456'),
                registerAndAuthenticate(app, 'sarah', '123456'),
            ]);
        });

        describe('when the poll does not exist', () => {
            beforeAll(async () => {
                response = await request(app)
                    .get(`/polls/9999`)
                    .set('Authorization', `Bearer ${myToken}`);
            });

            it('should return "404 Not Found" status', () => {
                expect(response.status).toBe(404);
            });

            it('must return the error message', () => {
                expect(response.body.message).toBe('Poll does not exist');
            });
        });

        describe('when the poll has not been voted on', () => {
            // Create the poll
            beforeAll(async () => {
                const authorToken = await registerAndAuthenticate(app, 'mmm', '123456');
                const response = await request(app)
                    .post('/polls')
                    .set('Authorization', `Bearer ${authorToken}`)
                    .send({
                        title: 'Choose an option',
                        options: ['foo', 'bar'],
                    });

                pollId = response.body.id;
            });

            // Retrieve the poll
            beforeAll(async () => {
                response = await request(app)
                    .get(`/polls/${pollId}`)
                    .set('Authorization', `Bearer ${myToken}`);
            });

            it('should return "200 Ok" status', () => {
                expect(response.status).toBe(200);
            });

            it('should return poll id', () => {
                expect(response.body.id).toBe(pollId);
            });

            it('should return poll title', () => {
                expect(response.body.title).toBe('Choose an option');
            });

            it('should return poll options', () => {
                expect(response.body.options).toEqual(['foo', 'bar']);
            });

            it('the tally must be empty', () => {
                expect(response.body.tally).toEqual({});
            });
        });

        describe('when someone else has voted on the poll', () => {
            beforeAll(async () => {
                await request(app)
                    .post(`/polls/${pollId}/votes`)
                    .set('Authorization', `Bearer ${otherToken}`)
                    .send({ option: 'foo' });

                response = await request(app)
                    .get(`/polls/${pollId}`)
                    .set('Authorization', `Bearer ${myToken}`);
            });

            it('should return "200 Ok" status', async () => {
                expect(response.status).toBe(200);
            });

            it('should return the updated tally', () => {
                expect(response.body.tally).toEqual({
                    foo: 1,
                });
            });

            it('should return hasVoted of false', () => {
                expect(response.body.hasVoted).toBe(false);
            });
        });

        describe('when I have voted on the poll', () => {
            beforeAll(async () => {
                await request(app)
                    .post(`/polls/${pollId}/votes`)
                    .set('Authorization', `Bearer ${myToken}`)
                    .send({option: 'bar'});

                response = await request(app)
                    .get(`/polls/${pollId}`)
                    .set('Authorization', `Bearer ${myToken}`);
            });

            it('should return hasVoted of true', () => {
                expect(response.body.hasVoted).toBe(true);
            });

            it('should return myVote equal to the chosen option', () => {
                expect(response.body.myVote).toBe('bar');
            });
        });
    });

    describe('GET /polls', () => {
        let response;

        beforeAll(async () => {
            await db.dropDatabase();
            await db.collection('polls').insertMany([{
                title: 'Best 90s Pop Band?',
                options: [
                    'Spice girls',
                    'Backstreet Boys',
                    'Aqua',
                ],
                tally: {},
                votes: {},
            }, {
                title: 'Best Classic Horror Movie?',
                options: [
                    'Frankenstein',
                    'The Omen',
                    'The Body Snatcher',
                    'Night of the Living Dead',
                ],
                tally: {},
                votes: {},
            }, {
                title: 'Best Italian Dish?',
                options: [
                    'Pizza',
                    'Lasagna',
                    'Pasta',
                ],
                tally: {},
                votes: {},
            }]);

            const token = await createAnonymousToken(app);

            response = await request(app)
                .get(`/polls`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
        });

        it('must return the list of existing polls', () => {
            expect(response.body.items.length).toBe(3);
        });

        it('must return the total number of polls', () => {
            expect(response.body.total).toBe(3);
        });

        it('must return the most recent result first', () => {
            expect(response.body.items[0].title).toBe(
                'Best Italian Dish?',
            )
        });

        describe('when queried with a limit parameter', () => {
            beforeAll(async () => {
                const token = await createAnonymousToken(app);

                response = await request(app)
                    .get(`/polls?limit=2`)
                    .set('Authorization', `Bearer ${token}`);
            });

            it('must limit the number of results', () => {
                expect(response.body.items.length).toBe(2);
            });
        });

        describe('when queried with an offset parameter', () => {
            beforeAll(async () => {
                const token = await createAnonymousToken(app);

                response = await request(app)
                    .get(`/polls?offset=1`)
                    .set('Authorization', `Bearer ${token}`);
            });

            it('must skip the specified number of polls', () => {
                expect(response.body.items[0].title).toBe(
                    'Best Classic Horror Movie?',
                )
            });
        })
    })
});
