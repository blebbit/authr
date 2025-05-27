import { v1 as spice } from '@authzed/authzed-node';

import config from '@/config';

const { promises } = spice.NewClient(config.spicedb.token, config.spicedb.host, spice.ClientSecurity.INSECURE_LOCALHOST_ALLOWED)
export { promises as client };

export function createObjectReference(objectType: string) {
    const [objectTypeName, objectId] = objectType.split(":");
    return spice.ObjectReference.create({
        objectType: objectTypeName,
        objectId: objectId,
    });
}

export function createSubjectReference(subjectType: string) {
  const [subjectTypeName, subjectId] = subjectType.split(":");
  return spice.SubjectReference.create({
    object: spice.ObjectReference.create({
      objectType: subjectTypeName,
      objectId: subjectId,
    }),
  });
}

export function createSubjectFilter(subjectType: string) {
  const [subjectTypeName, subjectId] = subjectType.split(":");
  return spice.SubjectFilter.create({
    subjectType: subjectTypeName,
    optionalSubjectId: subjectId || undefined,
  });
}

export function createCheckPermissionRequest(objectType: string, permission: string, subjectType: string) {
  const resource = createObjectReference(objectType);
  const subject = createSubjectReference(subjectType);
  return spice.CheckPermissionRequest.create({
    resource,
    permission,
    subject,
  });
}

export async function createRelationship(objectType: string, relation: string, subjectType: string) {
  const resource = createObjectReference(objectType);
  const subject = createSubjectReference(subjectType);
  const request = spice.WriteRelationshipsRequest.create({
    updates: [{
      operation: spice.RelationshipUpdate_Operation.CREATE,
      relationship: {
        resource,
        relation,
        subject,
      }
    }]
  });
  return promises.writeRelationships(request);
}

export async function lookupResources(subjectType: string, permission?: string, objectType?: string) {

  const request = spice.LookupResourcesRequest.create({
    subject: createSubjectReference(subjectType),
    permission,
    resourceObjectType: objectType,
  })

  return promises.lookupResources(request);
}

export async function lookupSubjects(objectType: string, permission?: string, subjectType?: string) {

  const payload: spice.LookupSubjectsRequest = {
    resource: createObjectReference(objectType),
  }

  if (permission) {
    payload.permission = permission;
  }
  if (subjectType) {
    payload.subjectObjectType = subjectType.split(":")[0];
  }

  console.log("lookupSubjects.payload", payload);

  const request = spice.LookupSubjectsRequest.create(payload)

  return promises.lookupSubjects(request);
}

export async function getRelationship(objectType?: string, relation?: string, subjectType?: string) {

  const payload: spice.ReadRelationshipsRequest = {
    relationshipFilter: {}
  }

  if (objectType) {
    const parts = objectType.split(":");
    payload.relationshipFilter.resourceType = parts[0];
    payload.relationshipFilter.optionalResourceId = parts[1] || undefined;
  }
  if (relation) {
    payload.relationshipFilter.optionalRelation = relation;
  }
  if (subjectType) {
    payload.relationshipFilter.optionalSubjectFilter = createSubjectFilter(subjectType);
  }
  console.log("getRelationship.payload", payload);

  const request = spice.ReadRelationshipsRequest.create(payload)

  return promises.readRelationships(request);
}

export async function checkPermission(objectType: string, permission: string, subjectType: string) {
  const checkPermissionRequest = createCheckPermissionRequest(objectType, permission, subjectType);
  const response = await promises.checkPermission(checkPermissionRequest);
  if (response?.permissionship === spice.CheckPermissionResponse_Permissionship.HAS_PERMISSION) {
    console.log("true");
    return { allowed: "yes" };
  } else if (response?.permissionship === spice.CheckPermissionResponse_Permissionship.NO_PERMISSION) {
    console.log("false");
    return { allowed: "no" };
  } else if (response?.permissionship === spice.CheckPermissionResponse_Permissionship.CONDITIONAL_PERMISSION) {
    console.log("conditional");
    return { allowed: "conditional" };
  } else if (response?.permissionship === spice.CheckPermissionResponse_Permissionship.UNSPECIFIED) {
    console.log("unspecified");
    return { allowed: "unspecified" };
  } else {
    console.log("unknown");
    return { allowed: "unknown" };
  }
}

export function createBulkReference(objectTypes: string[], permission: string, subjectType: string) {
  const subject = createSubjectReference(subjectType);
  return objectTypes.map((objectType) => {
    const [objectTypeName, objectId] = objectType.split(":");
    const obj = spice.ObjectReference.create({
        objectType: objectTypeName,
        objectId: objectId,
    });
    return spice.BulkCheckPermissionRequestItem.create({
      resource: obj,
      permission,
      subject,
    });
  });
}

export function createBulkCheckPermissionRequest(objectTypes: string[], permission: string, subjectType: string) {
  const subject = createSubjectReference(subjectType);
  return spice.BulkCheckPermissionRequest.create({
    items: createBulkReference(objectTypes, permission, subjectType),
  });
}


export async function checkBulkPermission(objectTypes: string[], permission: string, subjectType: string) {
  const checkPermissionRequest = createBulkCheckPermissionRequest(objectTypes, permission, subjectType);
  const response = await promises.bulkCheckPermission(checkPermissionRequest);
  console.log("checkBulkPermission", response);
  return response;
  // if (response?.permissionship === spice.CheckPermissionResponse_Permissionship.HAS_PERMISSION) {
  //   console.log("true");
  //   return { allowed: "yes" };
  // } else if (response?.permissionship === spice.CheckPermissionResponse_Permissionship.NO_PERMISSION) {
  //   console.log("false");
  //   return { allowed: "no" };
  // } else if (response?.permissionship === spice.CheckPermissionResponse_Permissionship.CONDITIONAL_PERMISSION) {
  //   console.log("conditional");
  //   return { allowed: "conditional" };
  // } else if (response?.permissionship === spice.CheckPermissionResponse_Permissionship.UNSPECIFIED) {
  //   console.log("unspecified");
  //   return { allowed: "unspecified" };
  // } else {
  //   console.log("unknown");
  //   return { allowed: "unknown" };
  // }
}
