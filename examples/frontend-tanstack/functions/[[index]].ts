// Set CORS to all responses
export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  // const origin = context.request.headers.get("Origin");
  // response.headers.set("Access-Control-Allow-Origin", origin);
  // response.headers.set("access-control-allow-origin", "https://api.authr.blebbit.dev");
  // response.headers.set("access-control-allow-origin", "https://auth.authr.blebbit.dev");
  response.headers.set("access-control-allow-origin", "https://app.authr.blebbit.dev");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, atproto-proxy");
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
};