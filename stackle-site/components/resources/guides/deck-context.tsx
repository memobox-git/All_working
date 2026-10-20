"use client";

import { createContext } from "react";

// Lets the deck outline ask a code slide to switch to one of its tabs.
export type TabRequest = { slide: number; tab: string; seq: number };
export const DeckContext = createContext<{ request: TabRequest | null }>({ request: null });
