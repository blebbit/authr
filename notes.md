## Notes

- atproto oauth server
- spicedb setup
- Keycloak or DEX for OICD?
- create account w/o PDS
- log into Blebbit w/o @account, limited capabilities
- select PDS provider and do PLC/PDS stuff
- multiple accounts / devices
- frontend components / sample app
- admin UI
- published images / container(s)
- linking in external accounts for integrations

### SaaS

We may offer this as a SaaS for those who do not what to run their own servers.
These are just thoughts about what that might look like, nothing is set in stone.

- free tier
  - setup for devs and ephemeral envs, so they can use localhost again
- managed instances
- custom domain
- 2FA / SSO
- hosted backend for auth to support things like
  - website comments
  - website chat


### Verification

[Bluesky Soft Launch - Delegated Verification](https://bsky.app/profile/pfrazee.com/post/3ln46nufjik2b)


### Other Thoughts

- use `did:web:...` instead of `did:plc:...`?
  - need to improve at-mirror / lookups

- extract functionality out of the PDS and into a separate "Identity Management" component in ATProto