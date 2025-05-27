import { getConfig } from "@/config";

const ranges = [
  "173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22", "141.101.64.0/18", "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20", "197.234.240.0/22", "198.41.128.0/17", "162.158.0.0/15", "104.16.0.0/13", "104.24.0.0/14", "172.64.0.0/13", "131.0.72.0/22", "2400:cb00::/32", "2606:4700::/32", "2803:f800::/32", "2405:b500::/32", "2405:8100::/32", "2a06:98c0::/29", "2c0f:f248::/32"
]

async function callAuthz(
  env: any,
  opts: {
    method: string, 
    path: string,
    headers?: any,
    data?: any,
  }
) {
  const config = getConfig(env);
  console.log("authz.callAuthz.config", config);

  const url = `${config.authz.host}${opts.path}`;
  const fopts: any = {
    method: opts.method || "GET",
    redirect: "manual",
    headers: {
      "x-authr-apikey": `${config.authz.secret}`,
      ...opts.headers,
    },
  }
  if (opts.data) {
    fopts.body = JSON.stringify(opts.data);
    fopts.headers["Content-Type"] = "application/json";
  }

  console.log("authz.callAuthz.url", url);
  console.log("authz.callAuthz.fopts", fopts);

  const resp = await fetch(url, fopts);
  console.log("authz.callAuthz.response", resp.status, resp.statusText, resp.headers.get('Location'));
  return resp
}

export async function getRelationship(
  env: any,
  resource: string,
  relation: string,
  subject: string,
) {
  const response = await callAuthz(env, {
    method: "POST",
    path: "/authz/relationship/query",
    data: {
      resource,
      relation,
      subject,
    }
  });

  if (!response.ok) {
    console.error("authz.getRelationship.error", response.statusText);
    return false;
  }

  const data = await response.json();

  console.log("authz.getRelationship.data", data);

  return data
}

export async function createRelationship(
  env: any,
  resource: string,
  relation: string,
  subject: string,
) {
  const response = await callAuthz(env, {
    method: "POST",
    path: "/authz/relationship",
    data: {
      resource,
      relation,
      subject,
    }
  });

  if (!response.ok) {
    console.error("authz.createRelationship.error", response.statusText);
    return false;
  }

  const data = await response.json();

  console.log("authz.createRelationship.data", data);

  return data
}

export async function checkPermission(
  env: any,
  resource: string,
  permission: string,
  subject: string,
) {

  const response = await callAuthz(env, {
    method: "POST",
    path: "/authz/check",
    data: {
      resource,
      permission,
      subject,
    }
  });

  if (!response.ok) {
    console.error("authz.checkPermission.error", response.statusText);
    return false;
  }

  const data = await response.json();

  console.log("authz.checkPermission.data", data);

  return data
}

export async function checkBulkPermissions (
  env: any,
  resources: string[],
  permission: string,
  subject: string,
) {

  const response = await callAuthz(env, {
    method: "POST",
    path: "/authz/check-bulk",
    data: {
      resources,
      permission,
      subject,
    }
  });

  if (!response.ok) {
    console.error("authz.checkBulkPermissions.error", response.statusText);
    return false;
  }

  const data = await response.json();

  console.log("authz.checkBulkPermissions.data", data);

  return data
}