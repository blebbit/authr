import { getConfig } from "@/config";

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

  const url = `${config.authz.host}${opts.path}`;
  const fopts: any = {
    method: opts.method || "GET",
    headers: {
      "Authorization": `Bearer ${config.authz.secret}`,
      ...opts.headers,
    },
  }
  if (opts.data) {
    fopts.body = JSON.stringify(opts.data);
    fopts.headers["Content-Type"] = "application/json";
  }

  return fetch(url, fopts);
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