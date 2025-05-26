import { MegaphoneOff } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { RespError } from "./resp-error";
import { TID } from '@atproto/common-web'
import { useAuthr } from '../provider';

export const BskyPreferences = () => {
  const authr = useAuthr();

  const bskyPreferences = useQuery({
    queryKey: [authr.session?.did, 'acct', 'bskyPreferences'],
    queryFn: async () => {

      const r = await fetch(`${authr.options.xrpcHost}/xrpc/app.bsky.actor.getPreferences`, {
        credentials: 'include',
      })

      return r.json()
    },
    enabled: !!(authr.session?.did)
  })

  const mutation = useMutation({
    mutationFn: async (input: any) => {
      if (false) {
        console.log("M.input", input)
      }
      // get current preferences
      const r = await fetch(`${authr.options.xrpcHost}/xrpc/app.bsky.actor.getPreferences`, {
        credentials: 'include',
        headers: {
          // 'atproto-proxy': "did:web:api.bsky.app#bsky_appview"
        }
      })

      const curr: { preferences: any } = await r.json()
      // console.log("M.curr", curr.preferences)

      const mutes = curr.preferences.filter( (p: any) =>
        p.$type === "app.bsky.actor.defs#mutedWordsPref"
      )[0]
      // console.log("M.mutes", mutes)

      mutes.items.push({
        id: TID.nextStr(),
        actorTarget: "all",
        value: "mango moussilini",
        targets: ["tag", "content"]
      })

      console.log("M.post", curr)

      return fetch(`${authr.options.xrpcHost}/xrpc/app.bsky.actor.putPreferences`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          // 'atproto-proxy': "did:web:api.bsky.app#bsky_appview",
          'content-type': 'application/json',
        },
        body: JSON.stringify(curr)
      })
    },
  })

  if (bskyPreferences.isLoading) {
    return <div className="flex flex-col gap-2">
      <h2 className="font-light text-2xl">Loading Bsky Preferences...</h2>
    </div>
  }

  return (
    <div className="flex flex-col gap-2">
      { bskyPreferences.error ? <RespError error={bskyPreferences.error} /> : null }
      <span className="flex gap-2 justify-between items-center">
        <h2 className="font-light text-2xl">Preferences</h2>
        <span className="p-1 border rounded-md hover:cursor-pointer" onClick={() => {
          mutation.mutate({ text: 'Hello World' })
        }}>
          <MegaphoneOff className="text-red-500" />
        </span>
      </span>
      { bskyPreferences.data?.preferences ? <BskyPreferenceItems bskyPreferences={bskyPreferences.data.preferences} /> : null }
    </div>
  );
}

const BskyPreferenceItems = ({ bskyPreferences }: { bskyPreferences: any }) => {
  let prefs: any = {};

  for (const key in bskyPreferences) {
    const pref = bskyPreferences[key];
    prefs[pref.$type] = prefs[pref.$type] || [];
    prefs[pref.$type].push(pref);
  }

  // console.log("prefs", prefs);
  
  return (
    <div className="flex flex-col gap-3 pl-2">
      { Object.entries(prefs).map(([key, elems]) => {
        return <BskyPreferenceItem key={key} pref={key} elems={elems as any[]} />
      })}
    </div>
  )
}

const BskyPreferenceItem = ({ pref, elems }: { pref: any, elems: any[] }) => {
  switch (pref) {
    case "app.bsky.actor.defs#interestsPref":
      return (
        <span className="flex gap-2 items-end">
          <span className="text-gray-700 text-lg">Interests</span>
          <span className="font-light text-lg text-gray-600">{elems[0].tags.join(", ")}</span>
        </span>
      )

    case "app.bsky.actor.defs#mutedWordsPref":
      return (
        <span className="flex gap-2 items-end">
          <span className="text-gray-700 text-lg">Muted Words</span>
          <span className="font-light text-lg text-gray-600">{elems[0].items.length}</span>
        </span>
      )

    case "app.bsky.actor.defs#contentLabelPref":
      return (
        <span className="flex flex-col gap-1">
          <span className="text-gray-700 text-lg">Content Labels:</span>
          { elems && elems.map((elem, i) => {
            return (
              <span key={i} className="flex gap-2 items-end ml-4">
                <span className="text-gray-700">{elem.label}</span>
                <span className="font-light text-gray-600">{elem.visibility}</span>
              </span>
            )
          })}
        </span>
      )

    default:
      return (
        <span className="flex flex-col gap-1 items-start">
          <span className="text-gray-700 text-lg">{ pref }  .... </span>
          {/* <pre className="font-light text-gray-600">{JSON.stringify(elems, null, 2)}</pre> */}
        </span>
      )
  }

  return (
    <pre>
      { pref ? JSON.stringify(pref, null, 2) : null }
    </pre>
  )
}
