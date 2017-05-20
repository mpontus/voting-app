import { ObjectID } from 'mongodb';
import jwt from 'express-jwt';
import wrap from './utils/asyncErrorWrapper'

export default function (app, db, secret) {
    const jwtMiddleware = jwt({ secret });

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
}
