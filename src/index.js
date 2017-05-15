import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import App from './app';

dotenv.config();

Array.of('SECRET', 'SALT_ROUNDS').forEach((varname) => {
    if (!varname in process.env) {
        console.error(`${varname} must be set in the environment variables`);
        console.error('Did you forget to copy .env.dist to .env?');
        process.exit(1);
    }
});

const port = parseInt(process.env.PORT || '3000', 10);
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/voting-app';

MongoClient.connect(mongoUrl, (err, db) => {
    if (err) {
        throw err;
    }

    console.log(`Connected to mongodb server on address ${mongoUrl}`);

    const app = App(db);
    const server = app.listen(port);

    server.on('listening', () => {
        console.log(`Server is listening on port ${port}`)
    });

    server.on('error', (error) => {
        console.log(error);

        if (error.syscall !== 'listen') {
            throw error;
        }

        switch (error.code) {
            case 'EACCESS':
                console.error(`Port ${port} requires elevated privileges`);
                break;

            case 'EADDRINUSE':
                console.error(`Port ${port} is already in use`);
                break;

            default:
                throw error;
        }

        process.exit(1);
    })
});
