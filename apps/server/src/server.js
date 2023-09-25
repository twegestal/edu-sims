import express from 'express';

export const createServer = () => {
    const app = express();

    app.use(express.json());
    
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