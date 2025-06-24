-- a single table of all records
CREATE TABLE records (
    id VARCHAR PRIMARY KEY, -- CUID (spicedb resource id)
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- assume most people want a private by default experience
    public BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- strongRef ATProto stuff
    acct VARCHAR NOT NULL, -- DID
    nsid VARCHAR NOT NULL, -- collection
    rkey VARCHAR NOT NULL, -- TID
    cid VARCHAR,           -- CID (hash, if public)

    -- record value
    "value" TEXT NOT NULL, -- JSON

    -- extended ATPProto stuff, version format still tbd
    parent VARCHAR,        -- parent record (if has heirarchy, when != null) (CUID?)
    rver VARCHAR,          -- record version (if has history, when != null) (CUID?)
    lver VARCHAR           -- lexicon version (if the nsid has versioning enabled) (SEMVER?)
);

-- same constraint as ATProto
CREATE UNIQUE INDEX "record_main_idx" ON "records"("acct", "nsid", "rkey", "rver", "parent");