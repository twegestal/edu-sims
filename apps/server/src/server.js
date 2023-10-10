import express from 'express';
import { getUserRoutes } from './routes/userRoutes.js';

export const createServer = () => {
    const app = express();

    app.use(express.json());
    app.use('/user', getUserRoutes());

    app.get('/hello', (req, res) => {
        res.status(201).json(greetingPhrase());
    })

    return app;
}

const greetingPhrase = () => {
    const phrases = [
        "Hallå eller!",
        "E du go eller",
        "Full bäs",
        "Kamma dej",
        "Abrovinsch"
    ];

    return phrases[Math.floor(Math.random() * phrases.length)];
}