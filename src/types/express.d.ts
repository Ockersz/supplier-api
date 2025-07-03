import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: any; // Or use a proper interface for the JWT payload
  }
}
