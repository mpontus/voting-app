import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import wrap from './utils/asyncErrorWrapper'
import HttpErrors from 'http-errors';

export default function (app, db, secret) {
    app.post('/token', wrap(async (req, res) => {
        const { grant_type: grantType } = req.body;

        switch (grantType) {
            case 'client_credentials': {
                const id = uuid();
                const payload = {
                    id,
                    anonymous: true,
                };
                const token = sign(payload, secret);

                res.json({
                    access_token: token,
                    token_type: 'bearer',
                });

                return;
            }

            case 'password': {
                const { username, password } = req.body;

                if (!username) {
                    throw new HttpErrors.BadRequest('Username is empty');
                }

                if (typeof username !== 'string') {
                    throw new HttpErrors.BadRequest('Username must be a string');
                }

                if (!password) {
                    throw new HttpErrors.BadRequest('Password is empty');
                }

                if (typeof password !== 'string') {
                    throw new HttpErrors.BadRequest('Password must be a string');
                }

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
                const token = sign(payload, secret);

                res.json({
                    access_token: token,
                    token_type: 'bearer',
                });

                return;
            }

            default:
                throw new HttpErrors.BadRequest('Invalid grant type');
        }

        res.status(400).json({
            message: `Grant type ${grantType} is not supported`,
        });

    }));
}
