export type AuthzConfig = {
  host: string,
  secret: string,
}

export type AuthzClient = {
  lookupSubjects: (
    resource: string,
    permission?: string,
    subject?: string,
  ) => Promise<any>,
  lookupResources: (
    subject: string,
    permission?: string,
    resource?: string,
  ) => Promise<any>,
  getRelationship: (
    resource: string,
    relation?: string,
    subject?: string,
  ) => Promise<any>,
  createRelationship: (
    resource: string,
    relation: string,
    subject: string,
  ) => Promise<any>,
  updateRelationship: (
    resource: string,
    relation: string,
    subject: string,
  ) => Promise<any>,
  deleteRelationship: (
    resource: string,
    relation?: string,
    subject?: string,
  ) => Promise<any>,
  checkPermission: (
    resource: string,
    permission: string,
    subject: string,
  ) => Promise<any>,
  checkBulkPermissions: (
    resources: string[],
    permission: string,
    subject: string,
  ) => Promise<any>,
}

export const callAuthz = async (
  config: AuthzConfig,
  opts: {
    method: string, 
    path: string,
    headers?: any,
    data?: any,
  }
) => {
  const url = `${config.host}${opts.path}`;
  const fopts: any = {
    method: opts.method || "GET",
    redirect: "manual",
    headers: {
      "x-authr-apikey": `${config.secret}`,
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

export function getAuthzClient(config: AuthzConfig) {

  return {

    lookupSubjects: async (
      resource: string,
      permission?: string,
      subject?: string,
    ) => {
      const response = await callAuthz(config, {
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
    },

    lookupResources: async (
      subject: string,
      permission?: string,
      resource?: string,
    ) => {
      const response = await callAuthz(config, {
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
    },

    getRelationship: async (
      resource: string,
      relation?: string,
      subject?: string,
    ) => {
      const response = await callAuthz(config, {
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
    },

    createRelationship: async (
      resource: string,
      relation: string,
      subject: string,
    ) => {
      const response = await callAuthz(config, {
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
    },

    updateRelationship: async (
      resource: string,
      relation: string,
      subject: string,
    ) => {
      const response = await callAuthz(config, {
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
    },

    deleteRelationship: async (
      resource: string,
      relation?: string,
      subject?: string,
    ) => {
      const response = await callAuthz(config, {
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
    },

    checkPermission: async (
      resource: string,
      permission: string,
      subject: string,
    ) => {

      const response = await callAuthz(config, {
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
    },

    checkBulkPermissions: async (
      resources: string[],
      permission: string,
      subject: string,
    ) => {

      const response = await callAuthz(config, {
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

  }

}
