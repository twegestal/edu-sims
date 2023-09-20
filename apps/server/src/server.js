import express from 'express';

export const createServer = () => {
    const app = express();

    app.use(express.json());
    
    app.get('/', (req, res) => {
        res.json('Hello, World!');
    })

    return app;
}