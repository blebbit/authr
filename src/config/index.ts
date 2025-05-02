import dotenv from 'dotenv';

dotenv.config();

const stringToBoolean = (stringValue: string) => {
    switch(stringValue?.toLowerCase()?.trim()){
        case "true": 
        case "yes": 
        case "1": 
          return true;

        case "false": 
        case "no": 
        case "0": 
        case null: 
        case undefined:
          return false;

        default: 
          return JSON.parse(stringValue);
    }
}

interface Config {
  port: number;
  nodeEnv: string;

  oauth: {
    clientName: string;
    publicUrl: string;
    defaultRedirect: string;
    bskyScopes: string;
    jwks: string[];
  }

  cookie: {
    name: string;
    secret: Uint8Array<ArrayBufferLike>;
    secretString: string | undefined; // For debugging
    alg: string;
    issuer: string;
    audience: string;
    expirationTime: string;  // ex: '12h'
    expirationMillis: number// Cookie lifetime in milliseconds
    httpOnly: boolean, // **CRITICAL:** Prevents client-side JS access (XSS mitigation)
    secure: boolean, // Send only over HTTPS in production
    sameSite: string // Recommended for sessions ('lax' or 'strict'). Mitigates CSRF.
    path: string , // Cookie is valid for the entire site
    domain: string // Optional: Set if needed for subdomains
  }
}

const config: Config = {
  port: Number(process.env.PORT) || 3333,
  nodeEnv: process.env.NODE_ENV || 'development',

  oauth: {
    clientName: process.env.OAUTH_CLIENT_NAME || 'blebbit',
    publicUrl: process.env.OAUTH_PUBLIC_URL || 'https://auth.blebbit.org',
    defaultRedirect: process.env.OAUTH_DEFAULT_REDIRECT || 'https://app.blebbit.org/me',
    bskyScopes: process.env.OAUTH_SCOPES || 'atproto transition:generic',
    jwks: [
      process.env.OAUTH_PRIVATE_KEY_1 || "dummy1",
      process.env.OAUTH_PRIVATE_KEY_2 || "dummy2",
    ],
  },

  cookie: {
    name: process.env.COOKIE_NAME || 'authr_id',
    secretString: process.env.COOKIE_SECRET,
    secret: new TextEncoder().encode(process.env.COOKIE_SECRET),
    alg: process.env.COOKIE_ALG || 'HS256',
    issuer: process.env.COOKIE_ISSUER || 'urn:example:issuer',
    audience: process.env.COOKIE_AUDIENCE || 'urn:example:audience',
    expirationTime: process.env.COOKIE_EXPIRATION_TIME || '12h',
    expirationMillis: parseInt(process.env.COOKIE_EXPIRATION_MILLIS || "43200000"), // 12 * 60 * 60 * 1000, 12 hours
    secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
    sameSite: process.env.COOKIE_SAME_SITE || 'lax', // Recommended for sessions ('lax' or 'strict'). Mitigates CSRF.
    path: process.env.COOKIE_PATH || '/', // Cookie is valid for the entire site
    // note the leading dot to make the cookie valid for all subdomains
    domain: process.env.COOKIE_DOMAIN || ".blebbit.org",
    httpOnly: stringToBoolean(process.env.COOKIE_HTTP_ONLY || "true"), // **CRITICAL:** Prevents client-side JS access (XSS mitigation)
  }
};

if (config.nodeEnv === 'development') {
  console.log("config:", config)
}

export default config;
