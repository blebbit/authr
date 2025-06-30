import { Context } from "hono";
import { TID } from "@atproto/common-web";
import { D1QB } from 'workers-qb';


// TODO, make more of these crud functions

export async function createRecord(c: Context, cuid: string, did: string, nsid: string, value: any, pub: boolean = false) {

  // write to PDS if public
  //   rkey|cid would come from there if so

  const rkey = TID.nextStr() // standard rkey from ATProto
  const cid = null;

  // SPIKE, investigate the d1 query builder (https://workers-qb.massadas.com/)
  const stmt = `INSERT INTO records (id, public, parent, acct, nsid, rkey, cid, value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  const dbret = await c.env.DB
    .prepare(stmt)
    .bind(cuid, pub, value.parent || "", did, nsid, rkey, cid, JSON.stringify(value))
    .run()

  console.log("createRecord.dbret", dbret);

  // calculate a cid (hash) of the record (this is signed by the user's key on the PDS, so...)

  return {
    aturi: `at://${did}/${nsid}/${rkey}`,
    public: pub,
    dbret,
  }
}

export async function updateRecord(c: Context, cuid: string, value: any, { pub, replace }: { pub?: boolean, replace?: boolean }) {
  // There is also a json_patch function, which could support the non-replace case
  //   it also supports removing fields, but we would have to know the current value
  //   and then calculate the patch. For now, any field deletes need to use replace.

  // TODO, use version to ensure we are not conflicting with another update

  var nextVal = value;

  if (!replace) {
    const origRec = await c.env.DB
      .prepare(`SELECT value FROM records WHERE id = ?`)
      .bind(cuid)
      .first();

    const origVal = JSON.parse(origRec.value);
    // TODO, make this recursive
    Object.assign(origVal, value);
    nextVal = origVal;
  }

  const stmt = `UPDATE records SET value = json(?) WHERE id = ?`;

  const dbret = await c.env.DB
    .prepare(stmt)
    .bind(JSON.stringify(nextVal), cuid)
    .run()

  console.log("createRecord.dbret", dbret);

}

export async function deleteRecord(c: Context, cuid: string) {
  const qb = new D1QB(c.env.DB);

  await qb.delete({
    tableName: 'records',
    where: {
      conditions: 'id = ?',
      params: cuid,
    },
  }).execute();

}
