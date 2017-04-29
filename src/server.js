import App from './app';
import { MongoClient } from 'mongodb';

const PORT = 8080;
const MONGO_URL = 'mongodb://localhost:27017/voting-app-test';

const startServer = async (port, mongoUrl) => {
    const db = await MongoClient.connect(mongoUrl);
    const app = App(db);

    await app.listen(port);

    console.log(`Server started on port ${port}`);
};

startServer(PORT, MONGO_URL)
    .catch(console.error);
