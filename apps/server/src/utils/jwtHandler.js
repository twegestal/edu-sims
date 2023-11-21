import jwt from 'jsonwebtoken';

export const createToken = async (user) => {
  return jwt.sign({ user: user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};

export const createRefreshCookie = async (user) => {
  return jwt.sign({ user: user }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
};

export const validateToken = async (req, res, next) => {
  if (!req.headers['Authorization']) {
    return res.status(401).send('No token provided');
  }
  const token = req.headers['Authorization'].split(' ')[1];
  if (!token) {
    return res.status(401).send('No token provided');
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }
    req.user = user;
    next();
  });
};

export const validateRefreshToken = async () => {};
