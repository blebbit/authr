import { Tabs } from "radix-ui";

import { AtprotoInfo } from "../widgets/atproto-info";
import { OAuthInfo } from "../widgets/oauth-info";
import { BskyPreferences } from "../widgets/bsky-preferences";
import { BskyProfile } from "../widgets/bsky-profile";

const tabClass = "py-1 px-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white  bg-secondary border rounded"
const valClass = "ml-4 p-4 border w-full overflow-hidden"

export const AccountPortal = () => {
  return (
    <div className="flex">
      <Tabs.Root defaultValue="atproto" orientation="vertical" className="flex h-full w-full">
        <Tabs.List aria-label="tabs example" className="flex flex-col border p-2 gap-2">
          <Tabs.Trigger value="atproto"
            className={tabClass}
          >@ATProto</Tabs.Trigger>
          <Tabs.Trigger value="oauth"
            className={tabClass}
          >OAuth</Tabs.Trigger>
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
        <Tabs.Content value="oauth"
          className={valClass}
        >
          <OAuthInfo />
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
    </div>

  );
}