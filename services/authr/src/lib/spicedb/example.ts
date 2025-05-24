import { v1 as spice } from '@authzed/authzed-node';

import client from '@/lib/spicedb';

console.log("args:", process.argv);
const objectType = process.argv[2] || "blog/post:1";
const permission = process.argv[3] || "read";
const subjectType = process.argv[4] || "blog/user:emilia";

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

const checkPermissionRequest = createCheckPermissionRequest(objectType, permission, subjectType);

console.log("checkPermissionRequest", checkPermissionRequest);

/*
enum Permissionship {
	PERMISSIONSHIP_UNSPECIFIED = 0;
	PERMISSIONSHIP_NO_PERMISSION = 1;
	PERMISSIONSHIP_HAS_PERMISSION = 2;
	PERMISSIONSHIP_CONDITIONAL_PERMISSION = 3;
}
*/

client.checkPermission(checkPermissionRequest, (err, response) => {
  // console.log(response);
  // console.log(err);
  if (response?.permissionship === spice.CheckPermissionResponse_Permissionship.HAS_PERMISSION) {
    console.log("true");
  } else if (response?.permissionship === spice.CheckPermissionResponse_Permissionship.NO_PERMISSION) {
    console.log("false");
  } else if (response?.permissionship === spice.CheckPermissionResponse_Permissionship.CONDITIONAL_PERMISSION) {
    console.log("conditional");
  } else if (response?.permissionship === spice.CheckPermissionResponse_Permissionship.UNSPECIFIED) {
    console.log("unspecified");
  } else {
    console.log("unknown");
  }
})

