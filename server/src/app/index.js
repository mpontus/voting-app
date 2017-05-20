import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import configureRoutes from './routes';

export default function createApp(db, secret, saltRounds = 10) {
    const app = express();

    app.use(morgan('combined'));
    app.use(bodyParser.json());

    configureRoutes(app, db, secret, saltRounds);

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json(err.stack);
    });

    return app;
};
