import request from 'supertest'
import {MongoClient, ObjectID} from 'mongodb';
import cuid from 'cuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createApp from '../src/app';

const secret = 'secret';
const getAnonymousToken = (id = cuid()) => jwt.sign({
    id,
    anonymous: true,
}, secret);
const getAuthenticatedToken = ({ id = cuid(), username, avatar }) => jwt.sign({
    id,
    name: username,
    avatar,
}, secret);

describe('API', () => {
    let app, db;

    beforeAll(async () => {
        db = await MongoClient.connect('mongodb://localhost:27017/voting-app-test');

        await db.dropDatabase();

        app = createApp(db, secret);
    });

    beforeEach(() => {
        return db.dropDatabase();
    });

    afterAll(() => {
        db.close();
    });

    describe('POST /token with client_credentials grant type', () => {
        it('must return access token', async () => {
            const response = await request(app).post('/token')
                .send({ grant_type: 'client_credentials' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                token_type: 'bearer',
                access_token: expect.any(String),
            });
        });
    });

    describe('POST /token with password grant type', () => {
        it('must return access token', async () => {
            // TODO: expose salt rounds via app config
            const passwordHash = await bcrypt.hash('123456', 10);

            db.collection('users').insertOne({
                username: 'foobar',
                passwordHash,
            });

            const response = await request(app).post('/token')
                .send({
                    grant_type: 'password',
                    username: 'foobar',
                    password: '123456',
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                token_type: 'bearer',
                access_token: expect.any(String),
            });
        });

        it('must raise an error when username is not provided', async () => {
            const response = await request(app).post('/token')
                .send({
                    grant_type: 'password',
                    password: '123456',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username is empty');
        });

        it('must raise an error when username is not a string', async () => {
            const response = await request(app).post('/token')
                .send({
                    grant_type: 'password',
                    username: [123],
                    password: '123456'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username must be a string');
        });

        it('must raise an error when password is not provided', async () => {
            const response = await request(app).post('/token')
                .send({
                    grant_type: 'password',
                    username: 'foobar',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Password is empty');
        });

        it('must raise an error when password is not a string', async () => {
            const response = await request(app).post('/token')
                .send({
                    grant_type: 'password',
                    username: 'foobar',
                    password: [123],
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Password must be a string');
        });

        it('must raise an error when user does not exist', async () => {
            const response = await request(app).post('/token')
                .send({
                    grant_type: 'password',
                    username: 'foobar',
                    password: '123456',
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid credentials');
        });

        it('must raise an error when password is invalid', async () => {
            const response = await request(app).post('/token')
                .send({
                    grant_type: 'password',
                    username: 'foobar',
                    password: '654321',
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid credentials');
        });
    });

    describe('POST /tokens with invalid grant type', () => {
        it('must raise an error', async () => {
            const response = await request(app).post('/token')
                .send({
                    grant_type: 'foobar',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid grant type');
        });
    });

    describe('POST /users', () => {
        it('must create a user', async () => {
            await request(app).post('/users')
                .send({
                    username: 'foobar',
                    password: '123456',
                });

            const cursor = db.collection('users').find({});

            expect(await cursor.count()).toBe(1);
            expect(await cursor.next()).toEqual({
                _id: expect.any(ObjectID),
                username: 'foobar',
                passwordHash: expect.any(String),
            });
        });

        it('must raise an error when username is empty', async () => {
            const response = await request(app).post('/users')
                .send({
                    username: '',
                    password: '123456',
                })

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username must not be empty');
        });

        it('must raise an error when password is too short', async () => {
            const response = await request(app).post('/users')
                .send({
                    username: 'foobar',
                    password: '123',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Password is too short');
        });

        it('must raise an error when username is already taken', async () => {
            await db.collection('users').insertOne({
                username: 'foobar',
            });

            const response = await request(app).post('/users')
                .send({
                    username: 'foobar',
                    password: '123456',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username is already taken');
        });
    });

    describe('POST /polls', () => {
        it('must save new poll in the database', async () => {
            const authorId = cuid();
            const token = getAnonymousToken(authorId);

            const response = await request(app).post('/polls')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'foo',
                    options: ['bar', 'baz'],
                });

            expect(response.body).toMatchObject({
                id: expect.any(String),
            });

            const cursor = db.collection('polls')
                .find({});

            expect(await cursor.count()).toBe(1);
            expect(await cursor.next()).toEqual({
                _id: ObjectID(response.body.id),
                title: 'foo',
                options: ['bar', 'baz'],
                author: {
                    id: authorId,
                    anonymous: true,
                },
                tally: [0, 0],
                votes: {},
            });
        });

        it('must save the details of authenticated user', async () => {
            const userId = cuid();
            const username = 'foobar';
            const avatar = 'http://avatar.com/url.png';
            const token = getAuthenticatedToken({ id: userId, username, avatar });

            const response = await request(app).post('/polls')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'foo',
                    options: ['bar', 'baz'],
                });

            expect(response.body).toMatchObject({
                id: expect.any(String),
            });

            const cursor = db.collection('polls')
                .find({});

            expect(await cursor.count()).toBe(1);
            expect(await cursor.next()).toEqual({
                _id: ObjectID(response.body.id),
                title: 'foo',
                options: ['bar', 'baz'],
                author: {
                    id: userId,
                    username,
                    avatar,
                },
                tally: [0, 0],
                votes: {},
            });
        });

        it('must raise an error when title is not a string', async () => {
            const response = await request(app).post('/polls')
                .set('Authorization', `Bearer ${getAnonymousToken(cuid())}`)
                .send({
                    title: ['foo', 'bar'],
                    options: ['foo', 'bar'],
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Title must be a string');
        });

        it('must raise an error when title is empty', async () => {
            const response = await request(app).post('/polls')
                .set('Authorization', `Bearer ${getAnonymousToken(cuid())}`)
                .send({
                    title: '',
                    options: ['foo', 'bar'],
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Title must not be empty');
        });

        it('must raise an error when options is not an array', async () => {
            const response = await request(app).post('/polls')
                .set('Authorization', `Bearer ${getAnonymousToken(cuid())}`)
                .send({
                    title: 'Question',
                    options: 'foobar',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Options must be an array');
        });

        it('must raise an error when there are too few options', async () => {
            const response = await request(app).post('/polls')
                .set('Authorization', `Bearer ${getAnonymousToken(cuid())}`)
                .send({
                    title: 'Question',
                    options: ['foo'],
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Too few options');
        });

        it('must raise an error when any option is not a string', async () => {
            const response = await request(app).post('/polls')
                .set('Authorization', `Bearer ${getAnonymousToken(cuid())}`)
                .send({
                    title: 'Question',
                    options: ['foo', ['bar']],
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Options must be strings');
        });

        it('must raise an error when any option is empty', async () => {
            const response = await request(app).post('/polls')
                .set('Authorization', `Bearer ${getAnonymousToken(cuid())}`)
                .send({
                    title: 'Question',
                    options: ['foo', '', 'baz'],
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Some of the options are empty');
        });

        it('must raise an error when there are duplicate options', async () => {
            const response = await request(app).post('/polls')
                .set('Authorization', `Bearer ${getAnonymousToken(cuid())}`)
                .send({
                    title: 'Question',
                    options: ['foo', 'foo', 'bar'],
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Some of the options are duplicated');
        });
    });

    describe('POST /polls/:id/votes', () => {
        it('must update the tally on an existing poll', async () => {
            const result = await db.collection('polls').insertOne({
                title: 'Question',
                options: ['foo', 'bar', 'baz'],
                author: {
                    id: cuid(),
                    anonymous: true,
                },
                tally: [2, 3, 6],
                votes: {},
            });
            const id = result.insertedId.toString();
            const token = getAnonymousToken(cuid());

            await request(app).post(`/polls/${id}/votes`)
                .set('Authorization', `Bearer ${token}`)
                .send({ option: 'bar' });

            const updatedPoll = await db.collection('polls')
                .findOne({ _id: ObjectID(id) });

            expect(updatedPoll.tally).toEqual([
                2,
                4,
                6,
            ])
        });

        it('must raise an error when specified poll does not exist', async () => {
            const token = getAnonymousToken(cuid());
            const response = await request(app).post(`/polls/123/votes`)
                .set('Authorization', `Bearer ${token}`)
                .send({ option: 'bar' });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Poll does not exist');
        });

        it('must raise an error when option is not specified', async () => {
            const result = await db.collection('polls').insertOne({
                title: 'Question',
                options: ['foo', 'bar', 'baz'],
                author: {
                    id: cuid(),
                    anonymous: true,
                },
                tally: [2, 3, 6],
                votes: {},
            });
            const id = result.insertedId;

            const token = getAnonymousToken(cuid());
            const response = await request(app).post(`/polls/${id}/votes`)
                .set('Authorization', `Bearer ${token}`)
                .send({ });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Option not specified');
        });

        it('must raise an error when option specified option does not exist', async () => {
            const result = await db.collection('polls').insertOne({
                title: 'Question',
                options: ['foo', 'bar'],
                author: {
                    id: cuid(),
                    anonymous: true,
                },
                tally: [2, 3, 6],
                votes: {},
            });
            const id = result.insertedId;

            const token = getAnonymousToken(cuid());
            const response = await request(app).post(`/polls/${id}/votes`)
                .set('Authorization', `Bearer ${token}`)
                .send({ option: 'baz' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Option does not exist');
        });

        it('must raise an error when someone votes on their own poll', async () => {
            const userId = cuid();
            const result = await db.collection('polls').insertOne({
                title: 'Question',
                options: ['foo', 'bar'],
                author: {
                    id: userId,
                    anonymous: true,
                },
                tally: [2, 3, 6],
                votes: {},
            });
            const id = result.insertedId;

            const token = getAnonymousToken(userId);
            const response = await request(app).post(`/polls/${id}/votes`)
                .set('Authorization', `Bearer ${token}`)
                .send({ option: 'bar' });

            expect(response.status).toBe(403);
            expect(response.body.message).toBe('You can not vote on your own poll');
        });

        it('must raise an error when someone tries to vote twice', async () => {
            const userId = cuid();
            const result = await db.collection('polls').insertOne({
                title: 'Question',
                options: ['foo', 'bar'],
                author: {
                    id: cuid(),
                    anonymous: true,
                },
                tally: [2, 3, 6],
                votes: {
                    [userId]: 'foo',
                },
            });
            const id = result.insertedId;

            const token = getAnonymousToken(userId);
            const response = await request(app).post(`/polls/${id}/votes`)
                .set('Authorization', `Bearer ${token}`)
                .send({ option: 'bar' });

            expect(response.status).toBe(403);
            expect(response.body.message).toBe('You can not vote twice on the same poll');
        });
    });

    describe('POST /polls/:id/options', () => {
        it('must add new option', async () => {
            const result = await db.collection('polls').insertOne({
                title: 'Question',
                options: ['foo', 'bar'],
                author: {
                    id: cuid(),
                    anonymous: true,
                },
                tally: [2, 3],
                votes: {},
            });
            const id = result.insertedId.toString();
            const userId = cuid();
            const token = getAuthenticatedToken({ id: userId, username: 'foobar' });

            await request(app).post(`/polls/${id}/options`)
                .set('Authorization', `Bearer ${token}`)
                .send({ option: 'baz' });

            const updatedPoll = await db.collection('polls')
                .findOne({ _id: ObjectID(id) });

            expect(updatedPoll.options).toEqual(['foo', 'bar', 'baz']);
            expect(updatedPoll.tally).toEqual([2, 3, 1]);
            expect(updatedPoll.votes).toMatchObject({
                [userId]: 'baz',
            })
        });

        it('must raise an error when user is not authenticated', async () => {
            const result = await db.collection('polls').insertOne({
                title: 'Question',
                options: ['foo', 'bar'],
                author: {
                    id: cuid(),
                    anonymous: true,
                },
                tally: [2, 3],
                votes: {},
            });
            const id = result.insertedId.toString();
            const token = getAnonymousToken();
            const response = await request(app).post(`/polls/${id}/options`)
                .set('Authorization', `Bearer ${token}`)
                .send({ option: 'baz' });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Authentication required');
        });

        it('must raise an error when poll does not exist', async () => {
            const token = getAuthenticatedToken('foobar');
            const response = await request(app).post(`/polls/123/options`)
                .set('Authorization', `Bearer ${token}`)
                .send({ option: 'bar' });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Poll does not exist');
        });


        it('must raise an error when someone votes on their own poll', async () => {
            const userId = cuid();
            const result = await db.collection('polls').insertOne({
                title: 'Question',
                options: ['foo', 'bar'],
                author: {
                    id: userId,
                    username: 'foobar',
                },
                tally: [2, 3, 6],
                votes: {},
            });
            const id = result.insertedId;

            const token = getAuthenticatedToken({ id: userId, username: 'foobar' });
            const response = await request(app).post(`/polls/${id}/options`)
                .set('Authorization', `Bearer ${token}`)
                .send({ option: 'baz' });

            expect(response.status).toBe(403);
            expect(response.body.message).toBe('You can not vote on your own poll');
        });

        it('must raise an error when user has already voted on the poll', async () => {
            const userId = cuid();
            const result = await db.collection('polls').insertOne({
                title: 'Question',
                options: ['foo', 'bar'],
                author: {
                    id: cuid(),
                    anonymous: true,
                },
                tally: [2, 3],
                votes: {
                    [userId]: 'bar',
                },
            });
            const id = result.insertedId.toString();
            const token = getAuthenticatedToken({ id: userId, username: 'foobar' });
            const response = await request(app).post(`/polls/${id}/options`)
                .set('Authorization', `Bearer ${token}`)
                .send({ option: 'bar' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('You can not vote twice on the same poll');
        });

        it('must raise an error when option already exists', async () => {
            const result = await db.collection('polls').insertOne({
                title: 'Question',
                options: ['foo', 'bar'],
                author: {
                    id: cuid(),
                    anonymous: true,
                },
                tally: [2, 3],
                votes: {},
            });
            const id = result.insertedId.toString();
            const token = getAuthenticatedToken('foobar');
            const response = await request(app).post(`/polls/${id}/options`)
                .set('Authorization', `Bearer ${token}`)
                .send({ option: 'bar' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Option already exists');
        });
    });

    describe('GET /polls/:id', () => {
        it('must retrieve the poll', async () => {
            const result = await db.collection('polls').insertOne({
                title: 'Question',
                options: ['foo', 'bar'],
                author: {
                    id: cuid(),
                    anonymous: true,
                },
                tally: [
                    3,
                    5,
                ],
                votes: {},
            });
            const id = result.insertedId.toString();
            const response = await request(app).get(`/polls/${id}`)
                .set('Authorization', `Bearer ${getAnonymousToken()}`);

            expect(response.body).toEqual({
                id,
                title: 'Question',
                options: ['foo', 'bar'],
                author: {
                    anonymous: true,
                },
                ownedByMe: false,
                tally: {
                    foo: 3,
                    bar: 5,
                },
                hasVoted: false,
                myVote: null,
            });
        });

        it('must indicate the option previously voted on by the user', async () => {
            const userId = cuid();
            const result = await db.collection('polls').insertOne({
                title: 'Question',
                options: ['foo', 'bar'],
                author: {
                    id: cuid(),
                    anonymous: true,
                },
                ownedByMe: false,
                tally: [
                    3,
                    5,
                ],
                votes: {
                    [userId]: 'bar',
                },
            });
            const id = result.insertedId.toString();
            const response = await request(app).get(`/polls/${id}`)
                .set('Authorization', `Bearer ${getAnonymousToken(userId)}`);

            expect(response.body).toEqual({
                id,
                title: 'Question',
                options: ['foo', 'bar'],
                author: {
                    anonymous: true,
                },
                ownedByMe: false,
                tally: {
                    foo: 3,
                    bar: 5,
                },
                hasVoted: true,
                myVote: 'bar',
            });
        });

        it('must indicate whether the poll is owned by the user', async () => {
            const userId = cuid();
            const result = await db.collection('polls').insertOne({
                title: 'Question',
                options: ['foo', 'bar'],
                author: {
                    id: userId,
                    anonymous: true,
                },
                ownedByMe: false,
                tally: [
                    3,
                    5,
                ],
                votes: {},
            });
            const id = result.insertedId.toString();
            const response = await request(app).get(`/polls/${id}`)
                .set('Authorization', `Bearer ${getAnonymousToken(userId)}`);

            expect(response.body).toEqual({
                id,
                title: 'Question',
                options: ['foo', 'bar'],
                author: {
                    anonymous: true,
                },
                ownedByMe: true,
                tally: {
                    foo: 3,
                    bar: 5,
                },
                hasVoted: false,
                myVote: null,
            });
        });

        it('must throw an error when the poll does not exist', async () => {
            const response = await request(app).get(`/polls/123`)
                .set('Authorization', `Bearer ${getAnonymousToken()}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Poll does not exist');
        })
    });

    describe('GET /polls', () => {
        beforeEach(() => {
            return db.collection('polls').insertMany([
                {
                    title: 'First question',
                    options: ['foo', 'bar'],
                    author: {
                        id: cuid(),
                        anonymous: true,
                    },
                    tally: [0, 0],
                    votes: {},
                },
                {
                    title: 'Second question',
                    options: ['foo', 'bar'],
                    author: {
                        id: cuid(),
                        anonymous: true,
                    },
                    tally: [0, 0],
                    votes: {},
                },
            ]);
        });

        it('must retrieve polls', async () => {
            const response = await request(app).get('/polls')
                .set('Authorization', `Bearer ${getAnonymousToken()}`);

            expect(response.body).toMatchObject({
                items: [
                    {
                        title: 'Second question',
                    },
                    {
                        title: 'First question',
                    },
                ],
                total: 2,
            });
        });

        it('must retrieve polls by offset', async () => {
            const response = await request(app).get('/polls?offset=1')
                .set('Authorization', `Bearer ${getAnonymousToken()}`);

            expect(response.body).toMatchObject({
                items: [
                    {
                        title: 'First question',
                    },
                ],
                total: 2,
            });
        });

        it('must retrieve polls with limit', async () => {
            const response = await request(app).get('/polls?limit=1')
                .set('Authorization', `Bearer ${getAnonymousToken()}`);

            expect(response.body).toMatchObject({
                items: [
                    {
                        title: 'Second question',
                    },
                ],
                total: 2,
            });
        });
    });
});
