import { Request, Response, NextFunction } from 'express';

/* todo:
  - better path handling, xrpc comes in a variety of formats
  - better error handling
  - handle mutations and payloads
  - caching responses
*/ 

export const handleXrpc = async (req: Request, res: Response, next: NextFunction) => {
  // note the lack of error handling here... ¯\_(ツ)_/¯

  if (!req.session && req.method === 'POST') {
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log("xrpc.url:", req.url)
  // console.log("xrpc.reqPath:", req.path);
  // console.log("xrpc.reqQuery:", req.query);

  // const url1 = `${req.session.pds}/xrpc/com.atproto.repo.getRecord?repo=${req.query.repo}&collection=${req.query.collection}&rkey=${req.query.rkey}`
  const url2 = `${req.session.pds}${req.url}`
  // console.log("xrpc.url1:", url1)
  console.log("xrpc.url2:", url2)

  const authz = `dpop ${req.session.access_token}`

  const resp = await fetch(url2, {
    method: req.method,
    headers: {
      Authorization: authz,
      "at-proxy": req.headers['at-proxy'] as string,
    },
    body: req.method === 'POST' ? req.body : undefined,
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
      // session: req.session,
      session: {
        did: req.session.did,
        handle: req.session.handle,
        pds: req.session.pds,
        expires_at: req.session.expires_at,
      },
      record: rdata,
    });
  } catch (error) {
    next(error);
  }
};