// types/Request.ts
import { Request as ExpressRequest } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: { id: string }; // Your custom property
    }
  }
}

export { ExpressRequest as Request };