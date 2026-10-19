// Where the workspace screen can be: a DM, a channel, or one of the pages.
// Plain module (not client-only) so the server page can read it too.

export const PAGES = ["needs", "board", "profile", "connectors", "settings"] as const;
export type PageType = (typeof PAGES)[number];
export type View = { type: "dm"; agentId: string } | { type: "channel"; channelId: string } | { type: PageType };

export function isPage(view: View): view is { type: PageType } {
  return (PAGES as readonly string[]).includes(view.type);
}

export const PAGE_TITLES: Record<PageType, string> = {
  needs: "Needs you",
  board: "Board",
  profile: "Business Profile",
  connectors: "Connectors",
  settings: "Settings",
};

