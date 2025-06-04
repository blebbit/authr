import { Tabs } from "radix-ui";

import { AtprotoInfo } from "../widgets/atproto-info";
import { OAuthInfo } from "../widgets/oauth-info";
import { OauthSession } from "../widgets/oauth-session";
import { BskyPreferences } from "../widgets/bsky-preferences";
import { BskyProfile } from "../widgets/bsky-profile";

const tabClass = "py-1 px-2 font-light text-atproto-zinc data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-gray-200 border rounded"
const valClass = "ml-4 p-4 border w-full overflow-hidden"

export const AccountPortal = () => {
  return (
    <Tabs.Root defaultValue="atproto" orientation="vertical" className="flex flex-grow h-full w-full">
      <Tabs.List aria-label="tabs example" className="flex flex-col border p-2 gap-2 min-w-32">
        <Tabs.Trigger value="atproto"
          className={tabClass}
        >@ATProto</Tabs.Trigger>
        <Tabs.Trigger value="oauth-info"
          className={tabClass}
        >OAuth Info</Tabs.Trigger>
        <Tabs.Trigger value="oauth-session"
          className={tabClass}
        >OAuth Session</Tabs.Trigger>
        <Tabs.Trigger value="bsky-profile"
          className={tabClass}
        >Bsky Profile</Tabs.Trigger>
        <Tabs.Trigger value="bsky-prefs"
          className={tabClass}
        >Bsky Prefs</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="atproto"
        className={valClass}
      >
        <AtprotoInfo />
      </Tabs.Content>
      <Tabs.Content value="oauth-info"
        className={valClass}
      >
        <OAuthInfo />
      </Tabs.Content>
      <Tabs.Content value="oauth-session"
        className={valClass}
      >
        <OauthSession />
      </Tabs.Content>
      <Tabs.Content value="bsky-profile"
        className={valClass}
      >
        <BskyProfile />
      </Tabs.Content>
      <Tabs.Content value="bsky-prefs"
        className={valClass}
      >
        <BskyPreferences />
      </Tabs.Content>
    </Tabs.Root>

  );
}