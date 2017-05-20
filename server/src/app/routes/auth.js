import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import wrap from './utils/asyncErrorWrapper'

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
        }

        res.status(400).json({
            message: `Grant type ${grantType} is not supported`,
        });

    }));
}
