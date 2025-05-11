import { Request, Response, NextFunction } from 'express';

export const getPermissions = async (req: Request, res: Response, next: NextFunction) => {

  if (!req.session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    res.status(200).json({
      permissions: [
        'read:posts',
        'write:posts',
      ]
    });
  } catch (error) {
    next(error);
  }
};