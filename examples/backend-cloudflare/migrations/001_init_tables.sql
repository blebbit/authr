CREATE TABLE users (
    userId INTEGER PRIMARY KEY,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL,
    did TEXT NOT NULL,
    handle TEXT NOT NULL,
    email TEXT NOT NULL,
    emailConfirmed BOOLEAN NOT NULL,
    emailAuthFactor BOOLEAN NOT NULL,
    active BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_did_idx" ON "users"("did");

-- CreateIndex
CREATE UNIQUE INDEX "user_handle_idx" ON "users"("handle");


CREATE TABLE posts (
    postId INTEGER PRIMARY KEY,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL,

    published BOOLEAN NOT NULL,
    record TEXT NOT NULL, -- JSON

    ownerId INTEGER,
    FOREIGN KEY(ownerId) REFERENCES users(userId)
);