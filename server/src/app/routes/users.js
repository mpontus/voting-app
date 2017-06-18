import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import wrap from './utils/asyncErrorWrapper'

export default function (app, db, secret, saltRounds) {
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
                message: 'Password is too short',
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

        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const result = await db.collection('users').insertOne({
            username,
            passwordHash,
        });

        const [user] = result.ops;

        const payload = {
            id: user._id,
            name: user.username,
        };
        const token = jwt.sign(payload, secret);

        res.status(201).json({
            access_token: token,
            token_type: 'bearer',
        });
    }));
}
