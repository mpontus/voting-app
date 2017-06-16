import { ObjectID } from 'mongodb';
import { is, test, uniq, zipObj } from 'ramda';
import jwt from 'express-jwt';
import wrap from './utils/asyncErrorWrapper'
import HttpErrors from 'http-errors';

function viewPoll(doc, user) {
    let author;
    if (doc.author.anonymous) {
        author = {
            anonymous: true,
        };
    } else {
        const { id, username } = doc.author;

        author = {
            id,
            username,
        };
    }

    const ownedByMe = user.id === doc.author.id;
    const tally = zipObj(doc.options, doc.tally);

    let hasVoted = false, myVote = null;
    if (doc.votes[user.id]) {
        hasVoted = true;
        myVote = doc.votes[user.id];
    }

    return {
        id: doc._id,
        title: doc.title,
        options: doc.options,
        author,
        ownedByMe,
        tally,
        hasVoted,
        myVote,
    };
}

export default function (app, db, secret) {
    const jwtMiddleware = jwt({ secret });

    app.post('/polls', jwtMiddleware, wrap(async (req, res) => {
        const { title, options } = req.body;

        if (typeof title !== 'string') {
            throw new HttpErrors.BadRequest('Title must be a string');
        }

        if (title.length === 0) {
            throw new HttpErrors.BadRequest('Title must not be empty');
        }

        if (!Array.isArray(options)) {
            throw new HttpErrors.BadRequest('Options must be an array');
        }

        if (options.length < 2) {
            throw new HttpErrors.BadRequest('Too few options');
        }

        if (!options.every(is(String))) {
            throw new HttpErrors.BadRequest('Options must be strings');
        }

        if (!options.every(test(/./))) {
            throw new HttpErrors.BadRequest('Some of the options are empty');
        }

        if (options.length !== uniq(options).length) {
            throw new HttpErrors.BadRequest('Some of the options are duplicated');
        }

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
                tally: {},
                votes: {},
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
                author: 1,
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

        const polls = await cursor.map((doc) => viewPoll(doc, req.user))
            .toArray();

        res.json({
            items: polls,
            total,
        });
    }));

    app.get('/polls/:id', jwtMiddleware, wrap(async (req, res) => {
        const { id } = req.params;
        let doc;

        if (ObjectID.isValid(id)) {
            [doc] = await db.collection('polls')
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
        }

        if (!doc) {
            throw new HttpErrors.NotFound('Poll does not exist');
        }

        const poll = viewPoll(doc, req.user);

        res.json(poll);
    }));

    app.post('/polls/:id/votes', jwtMiddleware, wrap(async (req, res) => {
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

        const index = doc.options.indexOf(option);

        const result = await db.collection('polls')
            .updateOne({
                _id: ObjectID(id),
            }, {
                $inc: {
                    [`tally.${index}`]: 1,
                },
                $set: {
                    [`votes.${userId}`]: option,
                },
            });

        res.status(201).json({});
    }));
}
