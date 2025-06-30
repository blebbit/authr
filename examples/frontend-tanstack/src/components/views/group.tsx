import { useAuthr } from "@blebbit/authr-react-tanstack";
import { Link } from "@tanstack/react-router"
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query"

import { AcctSearch } from "@/components/widgets/acct-search";

import { ArrowLeft } from "lucide-react"

import {
  APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_DOC
} from 'authr-example-flexicon/common-ts'

import {
  appBlebbitAuthrGroupGetGroup,
  appBlebbitAuthrGroupCreateGroupRelationship,
  appBlebbitAuthrGroupUpdateGroupRelationship,
  appBlebbitAuthrGroupDeleteGroupRelationship,
} from 'authr-example-flexicon/client-ts'
import { PermissionTable } from "../widgets/perm-table";

const groupRoles = [
  "owner",
  "editor",
  "reader",
]

export const GroupView = ({ gid }: { gid: string }) => {
  const queryClient = useQueryClient();
  const authr = useAuthr();
  const session = authr.session

  const authrGroup: any = useQuery({
    queryKey: [APP_BLEBBIT_AUTHR_GROUP_CREATE_GROUP_DOC.id, gid],
    queryFn: async () => {
      return appBlebbitAuthrGroupGetGroup({
        id: gid,
      })
    },
    // enabled: !!(session?.did)
  })

  const acctInfos: any[] = useQueries({
    queries: (authrGroup.data?.groupRelations || []).map((relation: any) => {
      const did = relation.relationship.subject.object.objectId.replaceAll("_", ":")
      if (did.startsWith("did:")) {
        return ({
          queryKey: [did, 'info'],
          queryFn: async () => {
            const r = await fetch(`https://plc.blebbit.dev/info/${did}`)

            return r.json()
          },
          staleTime: 5 * 60 * 1000,
          // enabled: !!(relation.relationship.subject.object.objectId)
        })
      } else {
        return ({
          queryKey: ["group", 'info'],
          queryFn: async () => {
            const g = await appBlebbitAuthrGroupGetGroup({
              id: did,
            })
            console.log("groupInfo queryFn", did, g)
            return g
          },
          staleTime: 5 * 60 * 1000,
          // enabled: !!(relation.relationship.subject.object.objectId)
        })
      }
    })
  })

  const createRelation = useMutation({
    mutationFn: async ({id, relation}: {id: string, relation: string}) => {
      console.log("createRelation", gid, id, relation)
      return appBlebbitAuthrGroupCreateGroupRelationship({
        resource: gid,
        relation,
        subject: id,
      })
    },
    onSuccess: (data) => {
      console.log("createRelation.onSuccess", data)
      setTimeout(() => {
        console.log("createRelation.onSuccess.invalidateQueries", gid)
        queryClient.invalidateQueries({ queryKey:['authrGroups', gid]})
      }, 3000)
    }
  })

  const updateRelation = useMutation({
    mutationFn: async ({id, relation}: {id: string, relation: string}) => {
      console.log("updateRelation", gid, id, relation)
      return appBlebbitAuthrGroupUpdateGroupRelationship({
        resource: gid,
        relation,
        subject: id,
      })
    },
    onSuccess: (data) => {
      console.log("updateRelation.onSuccess", data)
      setTimeout(() => {
        console.log("updateRelation.onSuccess.invalidateQueries", gid)
        queryClient.invalidateQueries({ queryKey:['authrGroups', gid]})
      }, 2000)
    }
  })

  const deleteRelation = useMutation({
    mutationFn: async ({id}: {id: string}) => {
      console.log("deleteRelation", gid, id)
      return appBlebbitAuthrGroupDeleteGroupRelationship({
        resource: gid,
        subject: id,
      })
    },
    onSuccess: (data) => {
      console.log("deleteRelation.onSuccess", data)
      setTimeout(() => {
        console.log("deleteRelation.onSuccess.invalidateQueries", gid)
        queryClient.invalidateQueries({ queryKey:['authrGroups', gid]})
      }, 3000)
    }
  })



  if (authrGroup.isLoading || acctInfos.some(info => info.isLoading)) {
    return (
      <div className="flex flex-col gap-4">
        <p>Loading...</p>
      </div>
    )
  }

  console.log("authrGroup", authrGroup)
  console.log("authrGroup.data", authrGroup.data)
  console.log("authrGroup.accInfos", acctInfos)

  const data = authrGroup.data as any
  const group = data?.group || null
  const relations = data?.groupRelations || []
  console.log("authrGroup.group", group)
  const value = JSON.parse(group?.value || '{}')
  console.log("authrGroup.value", value)

  if (data?.error) {
    return (
      <div className="flex flex-col gap-4">
        <p>Error: {data.error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-row gap-2 items-center">
        <Link
          to="/groups"
          className="text-blue-500 hover:underline"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <span className="text-3xl font-light">{value.name || value.title}</span>
        { group.public ?
          <span className="rounded px-1 py-0 text-[.6rem] text-white bg-green-500 inline-block align-middle max-h-4">public</span>
          : 
          <span className="rounded px-1 py-0 text-[.6rem] text-white bg-red-500 inline-block align-middle max-h-4">private</span>
        }

        <div className="flex flex-grow gap-2 justify-end">
          <AcctSearch 
            addMember={createRelation.mutate}
          />
        </div>
      </div>
      <PermissionTable
        roles={groupRoles}
        relations={relations}
        memberInfos={acctInfos}
        createRelation={createRelation.mutate}
        updateRelation={updateRelation.mutate}
        deleteRelation={deleteRelation.mutate}
      />
    </div>
  )
}