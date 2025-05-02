import { Request, Response, NextFunction } from 'express';

export const handleXrpc = async (req: Request, res: Response, next: NextFunction) => {
  // note the lack of error handling here... ¯\_(ツ)_/¯

  if (!req.session && req.method === 'POST') {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const url = `${req.session.pds}/xrpc/com.atproto.repo.getRecord?repo=${req.params.account}&collection=${req.params.collection}&rkey=${req.params.rkey}`

  const authz = `dpop ${req.session.osess.tokenSet.access_token}`

  const resp = await fetch(url, {
    headers: {
      Authorization: authz,
    }
  })
  const rdata = await resp.json()

  try {
    res.status(200).json({
      message: "XRPC endpoint",
      method: req.method,
      params: {
        account: req.params.account,
        collection: req.params.collection,
        rkey: req.params.rkey,
      },
      session: {
        did: req.session.did,
        handle: req.session.handle,
        pds: req.session.pds,
        expires_at: req.session.osess.tokenSet.expires_at,
      },
      record: rdata,
    });
  } catch (error) {
    next(error);
  }
};