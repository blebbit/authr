import { Context } from "hono";
import { TID } from "@atproto/common-web";


// TODO, make more of these crud functions

export function createRecord(c: Context, cuid: string, did: string, nsid: string, record: any, pub: boolean = false) {

  // write to PDS if public
  //   rkey|cid would come from there if so

  const rkey = TID.nextStr() // standard rkey from ATProto
  const cid = null;

  c.env.DB.prepare('INSERT INTO records (id, public, acct, nsid, rkey, cid, record) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(cuid, pub, did, nsid, rkey, cid, JSON.stringify(record))
    .run()

  // calculate a cid (hash) of the record (this is signed by the user's key on the PDS, so...)

  return {
    aturi: `at://${did}/${nsid}/${rkey}`,
    public: pub,
    record,
  }
}