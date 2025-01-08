import { Request, Response, NextFunction } from 'express';
export declare const register: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
export declare const login: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
