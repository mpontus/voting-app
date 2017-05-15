import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import { ObjectID } from 'mongodb';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

// Wrapper to catch errors from async functions
const wrap = fn => (...args) => fn(...args).catch(args[2]);

const App = (db) => {
    const app = express();

    app.use(morgan('combined'));
    app.use(bodyParser.json());

    const jwtMiddleware = jwt({ secret: process.env.SECRET });

    app.post('/token', wrap(async (req, res) => {
        const { grant_type: grantType } = req.body;

        switch (grantType) {
            case 'client_credentials': {
                const id = uuid();
                const payload = {
                    id,
                    anonymous: true,
                };
                const token = sign(payload, process.env.SECRET);

                res.json({
                    access_token: token,
                    token_type: 'bearer',
                });

                return;
            }

            case 'password': {
                const { username, password } = req.body;
                const user = await db.collection('users').findOne({ username });

                if (!user) {
                    res.status(401).json({
                        message: 'Invalid credentials',
                    });

                    return;
                }

                const isValidPassword = await bcrypt.compare(password, user.passwordHash);

                if (!isValidPassword) {
                    res.status(401).json({
                        message: 'Invalid credentials',
                    });

                    return;
                }

                const payload = {
                    id: user._id,
                    name: user.username,
                };
                const token = sign(payload, process.env.SECRET);

                res.json({
                    access_token: token,
                    token_type: 'bearer',
                });

                return;
            }
        }

        res.status(400).json({
            message: `Grant type ${grantType} is not supported`,
        });

    }));

    app.post('/users', wrap(async (req, res) => {
        const { username, password } = req.body;

        if (!username) {
            res.status(400).json({
                message: 'Username must not be empty',
            });

            return;
        }

        if (!password) {
            res.status(400).json({
                message: 'Password must not be empty',
            });

            return;
        }

        if (password.length < 6) {
            res.status(400).json({
                message: 'Password must be at least 6 characters long',
            });

            return;
        }

        let doc = await db.collection('users')
            .findOne({ username });

        if (doc) {
            res.status(400).json({
                message: 'Username is already taken',
            });

            return;
        }

        const saltRounds = Number(process.env.SALT_ROUNDS);
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const result = await db.collection('users').insertOne({
            username,
            passwordHash,
        });

        [doc] = result.ops;

        const user = {
            id: doc._id,
            username: doc.username,
        };

        res.status(201).json(user);
    }));

    app.post('/polls', jwtMiddleware, wrap(async (req, res) => {
        const { title, options } = req.body;

        const author = {
            id: req.user.id,
        };

        if (req.user.anonymous) {
            author.anonymous = true;
        } else {
            author.anonymous = false;
            author.username = req.user.name;
        }

        const result = await db.collection('polls')
            .insertOne({
                title,
                options,
                author,
                votes: {},
                tally: {},
            });

        const [doc] = result.ops;

        res.status(201).json({
            id: doc._id,
        });
    }));

    app.get('/polls', jwtMiddleware, wrap(async (req, res) => {
        const { limit, offset } = req.query;

        const total = await db.collection('polls')
            .count();

        const cursor = db.collection('polls')
            .find()
            .project({
                title: 1,
                options: 1,
                tally: 1,
                [`votes.${req.user.id}`]: 1,
            })
            .sort('_id', -1);

        if (limit) {
            cursor.limit(Number(limit));
        }

        if (offset) {
            cursor.skip(Number(offset));
        }

        const polls = await cursor.map((doc) => {
            let hasVoted = false, myVote = null;

            if (doc.votes[req.user.id]) {
                hasVoted = true;
                myVote = doc.votes[req.user.id];
            }

            return {
                id: doc._id,
                title: doc.title,
                options: doc.options,
                tally: doc.tally,
                hasVoted,
                myVote,
            };
        }).toArray();

        res.json({
            items: polls,
            total,
        });
    }));

    app.get('/polls/:id', jwtMiddleware, wrap(async (req, res) => {
        const { id } = req.params;

        if (!ObjectID.isValid(id)) {
            res.status(404).json({
                message: 'Poll does not exist',
            });

            return;
        }

        const [doc] = await db.collection('polls')
            .find({
                _id: ObjectID(id),
            })
            .project({
                title: 1,
                options: 1,
                tally: 1,
                [`votes.${req.user.id}`]: 1,
            })
            .toArray();

        if (!doc) {
            res.status(404).json({
                message: 'Poll does not exist',
            });

            return;
        }

        let hasVoted = false, myVote = null;

        if (doc.votes[req.user.id]) {
            hasVoted = true;
            myVote = doc.votes[req.user.id];
        }

        const poll = {
            id: doc._id,
            title: doc.title,
            options: doc.options,
            tally: doc.tally,
            hasVoted,
            myVote,
        };

        res.json(poll);
    }));

    app.post('/polls/:id/votes', jwt({ secret: process.env.SECRET }), wrap(async (req, res) => {
        const { id } = req.params;
        const { option } = req.body;
        const userId = req.user.id;

        if (!option) {
            res.status(400).json({
                message: 'Option not specified',
            });

            return;
        }

        if (!ObjectID.isValid(id)) {
            res.status(404).json({
                message: 'Poll does not exist',
            });

            return;
        }

        const [doc] = await db.collection('polls')
            .find({
                _id: ObjectID(id),
            })
            .project({
                title: 1,
                options: 1,
                tally: 1,
                author: 1,
                [`votes.${req.user.id}`]: 1,
            })
            .toArray();

        if (!doc) {
            res.status(404).json({
                message: 'Poll does not exist',
            });

            return;
        }

        if (doc.author.id === req.user.id) {
            res.status(403).json({
                message: 'You can not vote on your own poll',
            });

            return;
        }

        if (doc.votes[req.user.id]) {
            res.status(403).json({
                message: 'You can not vote on this poll again',
            });

            return;
        }

        if (!doc.options.includes(option)) {
            res.status(400).json({
                message: 'Option does not exist',
            });

            return;
        }

        await db.collection('polls')
            .updateOne({
                _id: ObjectID(id),
            }, {
                $inc: {
                    [`tally.${option}`]: 1,
                },
                $set: {
                    [`votes.${userId}`]: option,
                },
            });

        res.status(201).end();
    }));

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json(err.stack);
    });

    return app;
};

export default App;
