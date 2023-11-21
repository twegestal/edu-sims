import jwt from 'jsonwebtoken';

export const createToken = async (user) => {
  return jwt.sign({ user: user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};

export const createRefreshCookie = async (user) => {
  return jwt.sign({ user: user }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
};

export const validateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send('No token provided');
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }
    //req.user = user;
    next();
  });
};

export const validateRefreshToken = async () => {};
