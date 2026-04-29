import crypto from 'crypto';

export const sessionMiddleware = (req, res, next) => {
  let sessionId = req.headers['x-session-id'];
  
  if (!sessionId) {
    sessionId = crypto.randomBytes(16).toString('hex');
  }
  
  req.sessionId = sessionId;
  res.setHeader('x-session-id', sessionId);
  next();
};
