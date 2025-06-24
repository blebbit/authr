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
  // console.log("authz.callAuthz.config", config);

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

  // console.log("authz.callAuthz.url", url);
  // console.log("authz.callAuthz.fopts", fopts);

  const resp = await fetch(url, fopts);
  // console.log("authz.callAuthz.response", resp.status, resp.statusText, resp.headers.get('Location'));
  return resp
}

export async function lookupSubjects(
  env: any,
  resource: string,
  permission?: string,
  subject?: string,
) {
  const response = await callAuthz(env, {
    method: "POST",
    path: "/authz/lookup/subjects",
    data: {
      resource,
      permission,
      subject,
    }
  });

  if (!response.ok) {
    console.error("authz.lookupSubjects.error", response.statusText);
    return false;
  }

  const data = await response.json();

  // console.log("authz.lookupSubjects.data", data);

  return data
}

export async function lookupResources(
  env: any,
  subject: string,
  permission?: string,
  resource?: string,
) {
  const response = await callAuthz(env, {
    method: "POST",
    path: "/authz/lookup/resources",
    data: {
      resource,
      permission,
      subject,
    }
  });

  if (!response.ok) {
    console.error("authz.lookupResources.error", response.statusText);
    return false;
  }

  const data = await response.json();

  // console.log("authz.lookupResources.data", data);

  return data
}

export async function getRelationship(
  env: any,
  resource: string,
  relation?: string,
  subject?: string,
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

  // console.log("authz.getRelationship.data", data);

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

  // console.log("authz.createRelationship.data", data);

  return data
}

export async function updateRelationship(
  env: any,
  resource: string,
  relation: string,
  subject: string,
) {
  const response = await callAuthz(env, {
    method: "PUT",
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

  // console.log("authz.createRelationship.data", data);

  return data
}

export async function deleteRelationship(
  env: any,
  resource: string,
  relation: string,
  subject: string,
) {
  const response = await callAuthz(env, {
    method: "DELETE",
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

  // console.log("authz.createRelationship.data", data);

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
    return {
      error: response.statusText,
      status: response.status,
      message: "Failed to check permission",
    }
  }

  const data = await response.json();

  // console.log("authz.checkPermission.data", data);

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
    return {
      error: response.statusText,
      status: response.status,
      message: "Failed to check bulk permissions",
    }
  }

  const data = await response.json();

  // console.log("authz.checkBulkPermissions.data", data);

  return data
}