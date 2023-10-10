import { Router } from "express";

export const getUserRoutes = () => {
    const router = Router();

    router.post('/register', (req, res, next) => {
        res.status(201).json('hej registrering');
    })

    
    
    return router;
}