import { Divide } from "lucide-react";
import { RespError } from "./resp-error";

export const BskyPreferences = ({ data }: { data: any }) => {

  return (
    <div className="flex flex-col gap-2 p-4 border rounded-md bg-white shadow-sm">
      { data.error ? <RespError error={data.error} /> : null }
      <h2 className="font-light text-2xl">Preferences</h2>
      { data.preferences ? <BskyPreferenceItems bskyPreferences={data.preferences} /> : null }
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

  console.log("prefs", prefs);
  
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
