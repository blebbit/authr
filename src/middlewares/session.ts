import { Request, Response, NextFunction } from 'express';
import { getSession } from "../lib/auth/session";

import { db } from '../db/client';

export const sessionHandler = async (req: Request, res: Response, next: NextFunction) => {
  const session = await getSession(req);

  // lookup in database or cache
  if (session) {
    const r = await db.selectFrom("oauth_session")
      .where("key", "=", session.did)
      .selectAll()
      .executeTakeFirst()

    const d = JSON.parse(r.session)

    session.osess = d
  }

  req.session = session

  next()
}