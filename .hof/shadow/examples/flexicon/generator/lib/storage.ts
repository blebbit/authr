import { Context } from "hono";
import { TID } from "@atproto/common-web";


// TODO, make more of these crud functions

export async function createRecord(c: Context, cuid: string, did: string, nsid: string, value: any, pub: boolean = false) {

  // write to PDS if public
  //   rkey|cid would come from there if so

  const rkey = TID.nextStr() // standard rkey from ATProto
  const cid = null;

  // SPIKE, investigate the d1 query builder (https://workers-qb.massadas.com/)
  const stmt = `INSERT INTO records (id, public, acct, nsid, rkey, cid, value) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const dbret = await c.env.DB
    .prepare(stmt)
    .bind(cuid, pub, did, nsid, rkey, cid, JSON.stringify(value))
    .run()

  console.log("createRecord.dbret", dbret);

  // calculate a cid (hash) of the record (this is signed by the user's key on the PDS, so...)

  return {
    aturi: `at://${did}/${nsid}/${rkey}`,
    public: pub,
    value,
  }
}