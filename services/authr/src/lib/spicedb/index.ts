import { v1 as spice } from '@authzed/authzed-node';

import config from '@/config';

const { promises } = spice.NewClient(config.spicedb.token, config.spicedb.host, spice.ClientSecurity.INSECURE_LOCALHOST_ALLOWED)

function createObjectReference(objectType: string) {
    const [objectTypeName, objectId] = objectType.split(":");
    return spice.ObjectReference.create({
        objectType: objectTypeName,
        objectId: objectId,
    });
}

function createSubjectReference(subjectType: string) {
  const [subjectTypeName, subjectId] = subjectType.split(":");
  return spice.SubjectReference.create({
    object: spice.ObjectReference.create({
      objectType: subjectTypeName,
      objectId: subjectId,
    }),
  });
}

function createCheckPermissionRequest(objectType: string, permission: string, subjectType: string) {
  const resource = createObjectReference(objectType);
  const subject = createSubjectReference(subjectType);
  return spice.CheckPermissionRequest.create({
    resource,
    permission,
    subject,
  });
}

async function createRelationship(objectType: string, relation: string, subjectType: string) {
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

async function checkPermission(objectType: string, permission: string, subjectType: string) {
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

function createBulkReference(objectTypes: string[], permission: string, subjectType: string) {
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

function createBulkCheckPermissionRequest(objectTypes: string[], permission: string, subjectType: string) {
  const subject = createSubjectReference(subjectType);
  return spice.BulkCheckPermissionRequest.create({
    items: createBulkReference(objectTypes, permission, subjectType),
  });
}


async function checkBulkPermission(objectTypes: string[], permission: string, subjectType: string) {
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

export {
  promises as client,
  createRelationship,
  checkPermission,
  checkBulkPermission,
  createObjectReference,
  createSubjectReference,
  createCheckPermissionRequest,
};