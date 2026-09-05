"use client";

import dynamic from "next/dynamic";

/** The lead popup is interaction-only; keep its animation library out of the first paint. */
export const LeadPopupLazy = dynamic(() => import("./LeadPopup").then((m) => m.LeadPopup), { ssr: false });
