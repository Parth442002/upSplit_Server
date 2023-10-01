import { Response, NextFunction,Request } from 'express';
import jwt from 'jsonwebtoken';

const config = process.env;
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send('JWT Token is Missing');
  }
  try {
    const decoded: any = jwt.verify(token, 'token');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send('Invalid Token, Login again');
  }
};

export { verifyToken};

