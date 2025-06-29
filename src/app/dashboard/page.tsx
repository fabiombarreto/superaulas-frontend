import * as React from "react";
import type { Metadata } from "next";

import { config } from "@/config";
import Dashboard from "./dashboard";

export const metadata = { title: `Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
    return <Dashboard />;
}
