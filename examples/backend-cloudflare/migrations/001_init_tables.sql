-- a single table of all records
CREATE TABLE records (
    id VARCHAR PRIMARY KEY, -- UUID, do we need this or use it? (spicedb resource id?)
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- assume most people want a private by default experience
    public BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- actual ATProto stuff
    acct VARCHAR NOT NULL, -- DID
    nsid VARCHAR NOT NULL, -- collection
    rkey VARCHAR NOT NULL, -- TID
    cid VARCHAR,           -- CID (hash, if public)

    record TEXT NOT NULL -- JSON
);

-- same constraint as ATProto
CREATE UNIQUE INDEX "aturi_idx" ON "records"("acct", "nsid", "rkey");