// Set CORS to all responses
var corsHeaders = {
  "access-control-allow-origin": "https://app.authr.blebbit.dev",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, atproto-proxy",
  "Access-Control-Max-Age": "86400"
}

let cspDirectives = {
  'default-src': "'self'",
  'script-src': "'self' 'unsafe-inline' 'unsafe-eval' static.cloudflareinsights.com",
  'style-src': "'self' 'unsafe-inline'",
  'img-src': "'self' data: cdn.bsky.app",
  'font-src': "'self' data:",
  'connect-src': "'self' auth.authr.blebbit.dev api.authr.blebbit.dev plc.blebbit.dev cloudflareinsights.com public.api.bsky.app",
};

let cspHeaderValue = Object.entries(cspDirectives)
  .map(([directive, source]) => `${directive} ${source}`)
  .join('; ');

let cspHeaders = {
  "Content-Security-Policy": cspHeaderValue,
};


let securityHeaders = {
  "Content-Security-Policy": "upgrade-insecure-requests",
  "Strict-Transport-Security": "max-age=1000",
	"X-Xss-Protection" : "1; mode=block",
	"X-Frame-Options" : "DENY",
	"X-Content-Type-Options" : "nosniff",
	"Referrer-Policy" : "strict-origin-when-cross-origin",
}

let sanitiseHeaders = {
	"Server" : "Authr Example Frontend",
}

let removeHeaders = [
	"Public-Key-Pins",
	"X-Powered-By",
	"X-AspNet-Version",
]
export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  // const origin = context.request.headers.get("Origin");
  // response.headers.set("Access-Control-Allow-Origin", origin);
  for (const key in corsHeaders) {
    response.headers.set(key, corsHeaders[key]);
  }
  for (const key in securityHeaders) {
    response.headers.set(key, securityHeaders[key]);
  }
  for (const key in sanitiseHeaders) {
    response.headers.set(key, sanitiseHeaders[key]);
  }
  for (const key in cspHeaders) {
    response.headers.set(key, cspHeaders[key]);
  }
  removeHeaders.forEach(header => {
    response.headers.delete(header)
  })
  return response;
};