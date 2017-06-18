import authRoutes from './auth';
import usersRoutes from './users';
import pollsRoutes from './polls'

export default function (app, db, secret, saltRounds) {
    authRoutes(app, db, secret);
    usersRoutes(app, db, secret, saltRounds);
    pollsRoutes(app, db, secret);
}
